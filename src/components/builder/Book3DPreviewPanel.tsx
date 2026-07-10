import { useState, useRef, useMemo, useEffect, Suspense } from 'react';
import { RotateCcw, Maximize2, Box } from 'lucide-react';
import { BookData } from '../../App';
import { toBookViewerData } from '../../utils/bookViewerAdapter';
import type { ViewerPage } from '../../types/bookViewer';
import { loadImage } from '../../utils/imageHelpers';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface Book3DPreviewPanelProps {
  book: BookData;
  className?: string;
}

// ── Cover texture generator (renders ViewerPage to canvas) ──

async function renderCoverToCanvas(
  page: ViewerPage,
  width: number,
  height: number,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Background color
  ctx.fillStyle = page.backgroundColor || '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // 2. Background image
  if (page.backgroundImage) {
    try {
      const img = await loadImage(page.backgroundImage);
      ctx.drawImage(img, 0, 0, width, height);
    } catch {
      // background image load failed — continue with color only
    }
  }

  // 3. Elements sorted by zIndex
  const elements = [...(page.elements || [])].sort(
    (a, b) => (a.zIndex || 0) - (b.zIndex || 0),
  );

  for (const el of elements) {
    ctx.save();

    const ex = el.x || 0;
    const ey = el.y || 0;
    const ew = el.width || 100;
    const eh = el.height || 100;
    const cx = ex + ew / 2;
    const cy = ey + eh / 2;

    // Transform: position + rotation + opacity
    ctx.translate(cx, cy);
    if (el.rotation) ctx.rotate((el.rotation * Math.PI) / 180);
    ctx.globalAlpha = el.opacity ?? 1;
    ctx.translate(-cx, -cy);

    if (el.type === 'text') {
      if (!el.content) { ctx.restore(); continue; }
      const fontSize = el.fontSize || 16;
      ctx.fillStyle = el.color || '#000000';
      ctx.font = `${el.fontStyle || ''} ${el.fontWeight || 'normal'} ${fontSize}px "${el.fontFamily || 'Poppins'}", sans-serif`;
      ctx.textAlign = (el.textAlign as CanvasTextAlign) || 'left';
      ctx.textBaseline = 'top';
      if (el.textShadow) {
        ctx.shadowColor = el.textShadow;
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
      }
      ctx.fillText(el.content, ex, ey, ew);
    } else if (el.type === 'image') {
      const imgSrc = el.src || (el as any).url;
      if (!imgSrc) { ctx.restore(); continue; }
      try {
        const img = await loadImage(imgSrc);
        if (el.borderRadius) {
          ctx.beginPath();
          (ctx as any).roundRect?.(ex, ey, ew, eh, el.borderRadius);
          ctx.clip();
        }
        if (el.objectFit === 'contain') {
          const scale = Math.min(ew / img.width, eh / img.height);
          const iw = img.width * scale;
          const ih = img.height * scale;
          ctx.drawImage(img, ex + (ew - iw) / 2, ey + (eh - ih) / 2, iw, ih);
        } else {
          // cover or fill — scale to fill
          const imgRatio = img.width / img.height;
          const boxRatio = ew / eh;
          let sx = 0, sy = 0, sw = img.width, sh = img.height;
          if (imgRatio > boxRatio) {
            sh = img.height;
            sw = img.height * boxRatio;
            sx = (img.width - sw) / 2;
          } else {
            sw = img.width;
            sh = img.width / boxRatio;
            sy = (img.height - sh) / 2;
          }
          ctx.drawImage(img, sx, sy, sw, sh, ex, ey, ew, eh);
        }
      } catch { /* element image load failed */ }
    } else if (el.type === 'shape') {
      ctx.fillStyle = el.fill || '#000000';
      if (el.borderRadius) {
        ctx.beginPath();
        (ctx as any).roundRect?.(ex, ey, ew, eh, el.borderRadius);
        ctx.fill();
      } else {
        ctx.fillRect(ex, ey, ew, eh);
      }
      if (el.stroke) {
        ctx.strokeStyle = el.stroke;
        ctx.lineWidth = el.strokeWidth || 1;
        if (el.borderRadius) {
          ctx.beginPath();
          (ctx as any).roundRect?.(ex, ey, ew, eh, el.borderRadius);
          ctx.stroke();
        } else {
          ctx.strokeRect(ex, ey, ew, eh);
        }
      }
    } else if (el.type === 'sticker') {
      const stickerSize = Math.min(ew, eh);
      ctx.font = `${stickerSize * 0.8}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(el.emoji || el.content || '⭐', cx, cy);
    } else if (el.type === 'icon') {
      ctx.fillStyle = el.color || '#000000';
      ctx.font = `${Math.min(ew, eh) * 0.7}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('◆', cx, cy);
    }

    ctx.restore();
  }

  return canvas;
}

// ── Book 3D Mesh (with useFrame for smooth animation) ──
function BookMesh({ spineText, pageCount, coverPage }: {
  spineText: string;
  pageCount: number;
  coverPage: ViewerPage | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const thickness = Math.max(0.08, Math.min(0.4, (pageCount || 20) * 0.02));
  const coverTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const [coverTexture, setCoverTexture] = useState<THREE.CanvasTexture | null>(null);

  // Generate cover texture asynchronously
  useEffect(() => {
    let cancelled = false;

    async function generate() {
      // Dispose previous texture
      if (coverTextureRef.current) {
        coverTextureRef.current.dispose();
        coverTextureRef.current = null;
      }

      if (!coverPage) {
        setCoverTexture(null);
        return;
      }

      try {
        const canvas = await renderCoverToCanvas(coverPage, 512, 726);
        if (cancelled) return;

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;

        coverTextureRef.current = texture;
        setCoverTexture(texture);
      } catch (err) {
        console.warn('Failed to generate cover texture:', err);
        if (!cancelled) setCoverTexture(null);
      }
    }

    generate();
    return () => { cancelled = true; };
  }, [coverPage]);

  // Cleanup all textures on unmount
  useEffect(() => {
    return () => {
      if (coverTextureRef.current) coverTextureRef.current.dispose();
    };
  }, []);

  // Smooth floating animation via R3F's useFrame
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.04;
    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.08;
  });

  // Spine texture (canvas-generated)
  const spineTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Leather background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 128, 512);

    // Gold trim
    ctx.fillStyle = '#c9a84c';
    ctx.fillRect(8, 0, 2, 512);
    ctx.fillRect(118, 0, 2, 512);

    // Spine title
    ctx.fillStyle = '#f0d78c';
    ctx.font = 'bold 24px serif';
    ctx.textAlign = 'center';
    ctx.fillText(spineText || 'DearBook', 64, 256);

    // Raised bands
    ctx.fillStyle = '#8b7340';
    ctx.fillRect(24, 140, 80, 1);
    ctx.fillRect(24, 170, 80, 1);
    ctx.fillRect(24, 342, 80, 1);
    ctx.fillRect(24, 372, 80, 1);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [spineText]);

  // Cleanup texture on unmount
  useEffect(() => {
    return () => { spineTexture.dispose(); };
  }, [spineTexture]);

  return (
    <group ref={groupRef}>
      {/* Front Cover — uses generated texture, falls back to solid color */}
      <mesh position={[0, 0, thickness / 2]}>
        <planeGeometry args={[1.2, 1.7]} />
        <meshStandardMaterial
          map={coverTexture}
          color={coverTexture ? '#ffffff' : '#f5f0fa'}
          roughness={0.35}
          metalness={0.05}
        />
      </mesh>

      {/* Back Cover */}
      <mesh position={[0, 0, -thickness / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.2, 1.7]} />
        <meshStandardMaterial color="#e8e5ec" roughness={0.5} metalness={0.02} />
      </mesh>

      {/* Page Block */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.18, 1.66, thickness]} />
        <meshStandardMaterial color="#fafaf5" roughness={0.75} metalness={0} />
      </mesh>

      {/* Spine */}
      <mesh position={[-0.6, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[thickness, 1.7]} />
        <meshStandardMaterial map={spineTexture} roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Page edges (top/bottom/right) */}
      <mesh position={[0, -0.83, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.18, thickness]} />
        <meshStandardMaterial color="#f0f0e8" roughness={0.8} metalness={0} />
      </mesh>
      <mesh position={[0, 0.83, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.18, thickness]} />
        <meshStandardMaterial color="#f0f0e8" roughness={0.8} metalness={0} />
      </mesh>
      <mesh position={[0.59, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[thickness, 1.66]} />
        <meshStandardMaterial color="#f5f5f0" roughness={0.85} metalness={0} />
      </mesh>
    </group>
  );
}

// ── 3D Scene ──
function BookScene({ autoRotate, spineText, pageCount, coverPage }: {
  autoRotate: boolean;
  spineText: string;
  pageCount: number;
  coverPage: ViewerPage | null;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, -4]} intensity={0.3} />
      <pointLight position={[0, 3, 5]} intensity={0.4} color="#fff5f0" />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={2.5}
        maxDistance={6}
        autoRotate={autoRotate}
        autoRotateSpeed={1.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={2 * Math.PI / 3}
      />
      <Environment preset="studio" />
      <BookMesh spineText={spineText} pageCount={pageCount} coverPage={coverPage} />
    </>
  );
}

// ── Loading fallback ──
function CanvasLoading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 rounded-2xl z-10">
      <div className="text-center">
        <Box className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-pulse" />
        <div className="text-xs text-gray-500">Loading 3D...</div>
      </div>
    </div>
  );
}

// ── Canvas wrapper ──
function Book3DCanvas({ autoRotate, spineText, pageCount, coverPage }: {
  autoRotate: boolean;
  spineText: string;
  pageCount: number;
  coverPage: ViewerPage | null;
}) {
  return (
    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center relative overflow-hidden">
      <Suspense fallback={<CanvasLoading />}>
        <Canvas
          camera={{ position: [0, 0.5, 3.5], fov: 40 }}
          style={{ width: '100%', height: '100%' }}
          gl={{
            preserveDrawingBuffer: false,
            antialias: true,
            powerPreference: 'high-performance',
          }}
        >
          <BookScene autoRotate={autoRotate} spineText={spineText} pageCount={pageCount} coverPage={coverPage} />
        </Canvas>
      </Suspense>
    </div>
  );
}

// ── Main Component ──
export function Book3DPreviewPanel({ book, className = '' }: Book3DPreviewPanelProps) {
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const viewerData = useMemo(() => toBookViewerData(book), [book]);

  const spineText = book.title || viewerData.title || 'DearBook';
  const pageCount = book.pages?.length || 20;
  const coverPage = viewerData.cover;

  return (
    <div className={`bg-white/80 backdrop-blur-sm p-6 ${className}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Xem trước 3D</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-lg transition-all text-xs font-medium ${
                autoRotate ? 'bg-pink-100 text-pink-600' : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={autoRotate ? 'Dừng xoay' : 'Tự động xoay'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              title="Toàn màn hình"
            >
              <Maximize2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 3D Preview Canvas */}
        <Book3DCanvas autoRotate={autoRotate} spineText={spineText} pageCount={pageCount} coverPage={coverPage} />

        {/* Book Info */}
        <div className="p-4 bg-gradient-to-br from-rose-50 to-amber-50 rounded-xl text-sm space-y-2">
          <p className="font-semibold text-gray-800">📚 Chi tiết sách</p>
          <div className="space-y-1 text-xs text-gray-700">
            <p>• Kích thước: 20×25cm</p>
            <p>• Số trang: {pageCount}</p>
            <p>• Chất liệu: Giấy cao cấp</p>
            <p>• Bìa: Cứng, bo góc</p>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center text-white text-2xl transition-all"
          >
            ✕
          </button>
          <div className="max-w-4xl w-full aspect-[4/3] flex items-center justify-center">
            <Book3DCanvas autoRotate={autoRotate} spineText={spineText} pageCount={pageCount} coverPage={coverPage} />
          </div>
        </div>
      )}
    </div>
  );
}
