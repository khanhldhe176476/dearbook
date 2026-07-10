import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut,
  Home, Share2, Printer, Download, Bookmark, Menu,
  Maximize2, Music, Volume2, VolumeX
} from 'lucide-react';
import { BookData } from '../App';
import { toBookViewerData } from '../utils/bookViewerAdapter';
import type { BookViewerData, ViewerPage } from '../types/bookViewer';
import { getRandomThemeMusicWithInfo } from '../data/backgroundMusic';
import { AudioGenerator } from '../utils/audioGenerator';
import { resolveImageUrl } from '../utils/pagePreview';

interface FlipBookReaderProps {
  book: BookData;
  onClose: () => void;
}

// ── Constants ──

const THEME_GRADIENTS: Record<string, string> = {
  love: 'linear-gradient(135deg, #FF6B9D 0%, #FFA8C3 50%, #FFD4E5 100%)',
  family: 'linear-gradient(135deg, #60A5FA 0%, #93C5FD 50%, #DBEAFE 100%)',
  birthday: 'linear-gradient(135deg, #C084FC 0%, #E9D5FF 50%, #F3E8FF 100%)',
  friendship: 'linear-gradient(135deg, #FBBF24 0%, #FDE68A 50%, #FEF3C7 100%)',
};

// ── Animation utility (single RAF — replaces 3 separate loops) ──

type AnimCallback = (progress: number, eased: number) => void;

function runAnimation(
  duration: number,
  easing: (t: number) => number,
  onFrame: AnimCallback,
  onComplete: () => void,
): () => void {
  let rafId: number;
  let cancelled = false;
  const startTime = performance.now();

  const tick = () => {
    if (cancelled) return;
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easing(progress);
    onFrame(progress, eased);
    if (progress < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      onComplete();
    }
  };

  rafId = requestAnimationFrame(tick);

  return () => {
    cancelled = true;
    cancelAnimationFrame(rafId);
  };
}

// Easing functions
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuad = (t: number) => 1 - Math.pow(1 - t, 2);
const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// ── PageRenderer (extracted) ──

const PageRenderer = ({ page, debugMode = false }: { page: ViewerPage | null; debugMode?: boolean }) => {
  if (!page) {
    console.warn('⚠️ PageRenderer: page is null or undefined');
    return null;
  }

  if (!page.elements || page.elements.length === 0) {
    console.warn('⚠️ PageRenderer: page has no elements', { pageId: page.id });
  }

  const isCover = page.id === 'cover';
  const isBackCover = page.id === 'back-cover';
  const isCoverPage = isCover || isBackCover;

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: isCoverPage && (page as any).theme
          ? THEME_GRADIENTS[(page as any).theme] || page.backgroundColor || '#ffffff'
          : page.backgroundColor || '#ffffff',
      }}
    >
      {/* Paper texture overlay */}
      {!isCoverPage && (
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E")`,
            mixBlendMode: 'multiply',
          }}
        />
      )}
      {/* Background Pattern for Cover */}
      {isCoverPage && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'%3E%3C/path%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Background Image */}
      {page.backgroundImage && (
        <img
          src={resolveImageUrl(page.backgroundImage) || page.backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: isCoverPage ? 1 : 0.95 }}
        />
      )}

      {/* Elements */}
      <div className="relative w-full h-full p-8">
        {(!page.elements || page.elements.length === 0) && !isCoverPage && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-300">
              <div className="text-6xl mb-4">📄</div>
              <div className="text-sm">Trang trống</div>
            </div>
          </div>
        )}

        {page.elements?.map((el, idx) => (
          <div
            key={el.id || idx}
            className={`absolute ${debugMode ? 'outline outline-2 outline-red-500' : ''}`}
            style={{
              left: `${el.x || 0}px`,
              top: `${el.y || 0}px`,
              width: `${el.width || 100}px`,
              height: `${el.height || 100}px`,
              transform: `rotate(${el.rotation || 0}deg)`,
              opacity: el.opacity !== undefined ? el.opacity : 1,
              zIndex: el.zIndex !== undefined ? el.zIndex : idx,
            }}
          >
            {el.type === 'text' && (
              <div
                style={{
                  fontFamily: el.fontFamily || 'Poppins',
                  fontSize: `${el.fontSize || 16}px`,
                  color: el.color || '#000',
                  fontWeight: el.fontWeight || 'normal',
                  fontStyle: el.fontStyle || 'normal',
                  textAlign: (el.textAlign || 'left') as any,
                  lineHeight: el.lineHeight || 1.5,
                  textShadow: el.textShadow || (isCoverPage ? '2px 2px 4px rgba(0,0,0,0.2)' : 'none'),
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap',
                }}
                className="w-full h-full overflow-hidden flex items-center justify-center px-2"
              >
                {el.content || ''}
              </div>
            )}

            {el.type === 'image' && (el.src || (el as any).url) && (
              <img
                src={resolveImageUrl(el.src || (el as any).url) || el.src || (el as any).url}
                alt=""
                className="w-full h-full object-cover rounded-lg"
                style={{
                  objectFit: (el.objectFit || 'cover') as any,
                  borderRadius: `${el.borderRadius || 0}px`,
                }}
              />
            )}

            {el.type === 'shape' && (
              <div
                className="w-full h-full"
                style={{
                  backgroundColor: el.fill,
                  borderRadius: `${el.borderRadius || 0}px`,
                  border: el.stroke ? `${el.strokeWidth || 1}px solid ${el.stroke}` : 'none',
                }}
              />
            )}

            {el.type === 'sticker' && (
              <div
                className="w-full h-full flex items-center justify-center text-6xl"
                style={{ fontSize: `${el.width * 0.8}px` }}
              >
                {el.emoji || el.content}
              </div>
            )}

            {el.type === 'icon' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full" style={{ color: el.color }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Component ──

export function FlipBookReader({ book, onClose }: FlipBookReaderProps) {
  // ── Convert book data once (memoized) ──
  const viewerData: BookViewerData = useMemo(() => toBookViewerData(book), [book]);

  // ── Core navigation state ──
  const [currentSpread, setCurrentSpread] = useState(0);
  const [zoom, setZoom] = useState(1);

  // ── Consolidated curl state (reduces 4 states → 1 object) ──
  const [curlState, setCurlState] = useState<{
    isCurling: boolean;
    isFlipping: boolean;
    curlAmount: number;
    curlSide: 'left' | 'right' | null;
    curlPosition: { x: number; y: number };
  }>({
    isCurling: false,
    isFlipping: false,
    curlAmount: 0,
    curlSide: null,
    curlPosition: { x: 0, y: 0 },
  });

  // ── Mouse state via refs (no re-renders during drag!) ──
  const mouseRef = useRef({ x: 0, y: 0, dragStartX: 0, dragStartY: 0 });
  const curlStartPos = useRef({ x: 0, y: 0 });

  // ── Hover state (debounced — only triggers re-render for CSS transitions) ──
  const [isHovering, setIsHovering] = useState<'left' | 'right' | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Music state ──
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showMusicTooltip, setShowMusicTooltip] = useState(false);
  const [showMusicNotification, setShowMusicNotification] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(true);
  const [debugMode, setDebugMode] = useState(false);
  const audioGeneratorRef = useRef<AudioGenerator | null>(null);

  // ── Refs ──
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const cancelAnimRef = useRef<(() => void) | null>(null);

  // ── Derived data (memoized) ──
  const totalPages = viewerData.pages.length;
  // Front cover (spread 0) + content + back cover (last spread)
  const totalSpreads = 1 + Math.ceil(totalPages / 2);

  // Pre-computed spreads — only recalculated when currentSpread or viewerData changes
  const spreadData = useMemo(() => {
    // Front cover (spread 0)
    if (currentSpread === 0) {
      return {
        left: null as ViewerPage | null,
        right: viewerData.cover,
        isSinglePage: true,
      };
    }

    // Back cover (last spread)
    if (currentSpread === totalSpreads) {
      return {
        left: null as ViewerPage | null,
        right: viewerData.backCover,
        isSinglePage: true,
      };
    }

    // Content pages
    const leftIndex = (currentSpread - 1) * 2;
    const rightIndex = leftIndex + 1;

    return {
      left: leftIndex < totalPages ? viewerData.pages[leftIndex] : null,
      right: rightIndex < totalPages ? viewerData.pages[rightIndex] : null,
      isSinglePage: false,
    };
  }, [currentSpread, viewerData, totalSpreads, totalPages]);

  const { left, right, isSinglePage } = spreadData;

  // ── Audio initialization ──
  useEffect(() => {
    const { music, index: musicIdx } = getRandomThemeMusicWithInfo(book.theme);
    console.log('🎵 Initializing ambient music for theme:', book.theme);

    setIsAudioLoading(true);
    const generator = new AudioGenerator();
    audioGeneratorRef.current = generator;

    const startMusic = async () => {
      try {
        await generator.start({ theme: book.theme as any });
        setIsPlaying(true);
        setIsAudioLoading(false);
        console.log('✅ Ambient music started for theme:', book.theme);
        setShowMusicNotification(true);
        setTimeout(() => setShowMusicNotification(false), 3000);
      } catch {
        console.log('⏸️ Auto-play prevented by browser. User can click play button.');
        setIsPlaying(false);
        setIsAudioLoading(false);
      }
    };

    const playTimer = setTimeout(startMusic, 300);

    return () => {
      clearTimeout(playTimer);
      cancelAnimRef.current?.();
      if (audioGeneratorRef.current) {
        audioGeneratorRef.current.destroy();
        audioGeneratorRef.current = null;
      }
    };
  }, [book.theme]);

  // ── Music handlers ──
  const togglePlay = useCallback(() => {
    if (!audioGeneratorRef.current) return;
    if (isPlaying) {
      audioGeneratorRef.current.pause();
      setIsPlaying(false);
    } else {
      audioGeneratorRef.current.resume();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!audioGeneratorRef.current) return;
    const newMuted = !isMuted;
    audioGeneratorRef.current.setVolume(newMuted ? 0 : volume);
    setIsMuted(newMuted);
  }, [isMuted, volume]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioGeneratorRef.current) {
      audioGeneratorRef.current.setVolume(newVolume);
    }
    if (newVolume > 0 && isMuted) setIsMuted(false);
  }, [isMuted]);

  // ── Zoom ──
  const handleZoomIn = useCallback(() => setZoom(prev => Math.min(1.5, prev + 0.1)), []);
  const handleZoomOut = useCallback(() => setZoom(prev => Math.max(0.7, prev - 0.1)), []);

  // ── Corner detection ──
  const isNearCorner = useCallback((x: number, y: number, side: 'left' | 'right', rect: DOMRect): boolean => {
    const cornerSize = 150;
    const localX = x - rect.left;
    const localY = y - rect.top;
    if (side === 'right') {
      return localX > rect.width - cornerSize && localY > rect.height - cornerSize;
    }
    return localX < cornerSize && localY > rect.height - cornerSize;
  }, []);

  // ── Debounced hover setter ──
  const setHoverDebounced = useCallback((value: 'left' | 'right' | null) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => setIsHovering(value), 50);
  }, []);

  // ── Mouse handlers ──
  const handleMouseDown = useCallback((e: React.MouseEvent, side: 'left' | 'right') => {
    if (!pageRef.current) return;
    const rect = pageRef.current.getBoundingClientRect();
    if (isNearCorner(e.clientX, e.clientY, side, rect)) {
      e.stopPropagation();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      mouseRef.current = { x: localX, y: localY, dragStartX: localX, dragStartY: localY };
      curlStartPos.current = { x: e.clientX, y: e.clientY };
      setCurlState({
        isCurling: true,
        isFlipping: false,
        curlAmount: 0,
        curlSide: side,
        curlPosition: { x: e.clientX, y: e.clientY },
      });
      document.body.style.cursor = 'grabbing';
    }
  }, [isNearCorner]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const st = curlState;
    if (!st.isCurling) {
      // Hover detection (debounced)
      if (pageRef.current) {
        const rect = pageRef.current.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        if (currentSpread === 0) {
          setHoverDebounced(isNearCorner(x, y, 'right', rect) ? 'right' : null);
        } else {
          if (currentSpread > 0 && isNearCorner(x, y, 'left', rect)) {
            setHoverDebounced('left');
          } else if (currentSpread < totalSpreads && isNearCorner(x, y, 'right', rect)) {
            setHoverDebounced('right');
          } else {
            setHoverDebounced(null);
          }
        }
      }
      return;
    }

    if (!pageRef.current) return;
    const rect = pageRef.current.getBoundingClientRect();

    // Update mouse ref (no re-renders!)
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    mouseRef.current.x = localX;
    mouseRef.current.y = localY;

    // Calculate curl amount
    const startX = curlStartPos.current.x;
    const startY = curlStartPos.current.y;
    const deltaX = st.curlSide === 'right' ? startX - e.clientX : e.clientX - startX;
    const deltaY = startY - e.clientY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 500;
    let amount = Math.max(0, Math.min(1, distance / maxDistance));
    amount = amount * amount * (3 - 2 * amount); // smoothstep

    // Only update state for curl values (batched by React)
    setCurlState(prev => ({
      ...prev,
      curlAmount: amount,
      curlPosition: { x: e.clientX, y: e.clientY },
    }));
  }, [curlState, currentSpread, totalSpreads, isNearCorner, setHoverDebounced]);

  const handleMouseUp = useCallback(() => {
    const st = curlState;
    if (!st.isCurling) return;
    document.body.style.cursor = '';

    // Cancel any in-progress animation
    cancelAnimRef.current?.();

    if (st.curlAmount > 0.45) {
      // Complete flip
      setCurlState(prev => ({ ...prev, isFlipping: true }));

      const startAmount = st.curlAmount;
      cancelAnimRef.current = runAnimation(
        450, easeOutCubic,
        (_p, eased) => {
          setCurlState(prev => ({
            ...prev,
            curlAmount: startAmount + (1 - startAmount) * eased,
          }));
        },
        () => {
          if (st.curlSide === 'right' && currentSpread < totalSpreads) {
            setCurrentSpread(prev => prev + 1);
          } else if (st.curlSide === 'left' && currentSpread > 0) {
            setCurrentSpread(prev => prev - 1);
          }
          setCurlState({
            isCurling: false, isFlipping: false,
            curlAmount: 0, curlSide: null,
            curlPosition: { x: 0, y: 0 },
          });
        },
      );
    } else {
      // Snap back
      const startAmount = st.curlAmount;
      cancelAnimRef.current = runAnimation(
        350, easeOutQuad,
        (_p, eased) => {
          setCurlState(prev => ({
            ...prev,
            curlAmount: startAmount * (1 - eased),
          }));
        },
        () => {
          setCurlState({
            isCurling: false, isFlipping: false,
            curlAmount: 0, curlSide: null,
            curlPosition: { x: 0, y: 0 },
          });
        },
      );
    }
  }, [curlState, currentSpread, totalSpreads]);

  // ── Navigation ──
  const handleNext = useCallback(() => {
    if (currentSpread >= totalSpreads || curlState.isFlipping) return;
    setCurlState(prev => ({ ...prev, isFlipping: true, curlSide: 'right' }));
    cancelAnimRef.current?.();

    cancelAnimRef.current = runAnimation(
      500, easeInOutQuad,
      (_p, eased) => {
        setCurlState(prev => ({ ...prev, curlAmount: eased }));
      },
      () => {
        setCurrentSpread(prev => prev + 1);
        setCurlState({
          isCurling: false, isFlipping: false,
          curlAmount: 0, curlSide: null,
          curlPosition: { x: 0, y: 0 },
        });
      },
    );
  }, [currentSpread, totalSpreads, curlState.isFlipping]);

  const handlePrev = useCallback(() => {
    if (currentSpread <= 0 || curlState.isFlipping) return;
    setCurlState(prev => ({ ...prev, isFlipping: true, curlSide: 'left' }));
    cancelAnimRef.current?.();

    cancelAnimRef.current = runAnimation(
      500, easeInOutQuad,
      (_p, eased) => {
        setCurlState(prev => ({ ...prev, curlAmount: eased }));
      },
      () => {
        setCurrentSpread(prev => prev - 1);
        setCurlState({
          isCurling: false, isFlipping: false,
          curlAmount: 0, curlSide: null,
          curlPosition: { x: 0, y: 0 },
        });
      },
    );
  }, [currentSpread, curlState.isFlipping]);

  // ── Keyboard navigation (stale-closure fix via refs) ──
  const handleNextRef = useRef(handleNext);
  const handlePrevRef = useRef(handlePrev);
  handleNextRef.current = handleNext;
  handlePrevRef.current = handlePrev;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNextRef.current();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrevRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty deps — always calls latest via ref

  // ── Page curl visual helpers ──
  const curlyCurl = curlState.isCurling;
  const flipCurl = curlState.isFlipping;
  const activeCurl = curlyCurl || flipCurl; // Distinguish: curlyCurl = user dragging

  // ── Render ──
  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 z-50"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* ── Top Toolbar ── */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-20 shadow-sm">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Close">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <div className="h-8 w-px bg-gray-200" />
            <h2 className="text-lg font-bold text-gray-900 truncate max-w-md leading-tight" title={book.title || 'Untitled Book'}>
              {book.title || 'Untitled Book'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Home"><Home className="w-5 h-5 text-gray-600" /></button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Share"><Share2 className="w-5 h-5 text-gray-600" /></button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Print"><Printer className="w-5 h-5 text-gray-600" /></button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Download"><Download className="w-5 h-5 text-gray-600" /></button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Bookmark"><Bookmark className="w-5 h-5 text-gray-600" /></button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Menu"><Menu className="w-5 h-5 text-gray-600" /></button>
            <div className="h-8 w-px bg-gray-200 mx-2" />
            <button onClick={handleZoomIn} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Zoom In"><ZoomIn className="w-5 h-5 text-gray-600" /></button>
            <button onClick={handleZoomOut} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Zoom Out"><ZoomOut className="w-5 h-5 text-gray-600" /></button>
            <button className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all" title="Fullscreen"><Maximize2 className="w-5 h-5 text-gray-600" /></button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-all"
              onMouseEnter={() => setShowMusicTooltip(true)} onMouseLeave={() => setShowMusicTooltip(false)}>
              <button onClick={togglePlay} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center transition-all group"
                title={isAudioLoading ? 'Loading music...' : (isPlaying ? 'Pause Music' : 'Play Music')} disabled={isAudioLoading}>
                {isAudioLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-pink-500 rounded-full animate-spin" />
                ) : isPlaying ? (
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                      <div className="w-1 h-4 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="w-1 h-3 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                ) : (
                  <Music className="w-4 h-4 text-gray-600 group-hover:text-pink-500 transition-colors" />
                )}
              </button>
              <button onClick={toggleMute} className="w-8 h-8 rounded-full hover:bg-white flex items-center justify-center transition-all"
                title={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-gray-600" />}
              </button>
              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-200 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-pink-500
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-125"
                style={{ background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${volume * 100}%, #e5e7eb ${volume * 100}%, #e5e7eb 100%)` }} />
              {showMusicTooltip && (
                <div className="absolute bottom-full right-0 mb-2 px-4 py-2.5 bg-gray-900 text-white text-xs rounded-xl shadow-2xl max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="font-bold text-sm mb-1 leading-tight">
                    {book.theme === 'love' ? '❤️ Romantic Ambient' : book.theme === 'family' ? '👨‍👩‍👧 Family Warmth' : book.theme === 'birthday' ? '🎉 Birthday Celebration' : '🤝 Friendship Cheer'}
                  </div>
                  <div className="text-gray-300 text-[11px] leading-snug">Generative ambient music</div>
                  <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45" />
                </div>
              )}
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-sm text-gray-600 font-medium">
              Trang <span className="font-bold text-gray-900">{currentSpread + 1}</span> / <span className="font-bold text-gray-900">{totalSpreads + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Music Notification ── */}
      {showMusicNotification && (
        <div className="fixed top-24 right-6 z-30 animate-in slide-in-from-right-5 fade-in duration-300">
          <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-sm border border-white/20 max-w-xs">
            <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <div className="flex gap-0.5">
                <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-3 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm leading-tight mb-1">🎵 Nhạc nền đang phát</div>
              <div className="text-xs text-white/95 font-medium truncate leading-tight">
                Ambient {book.theme === 'love' ? 'Romantic' : book.theme === 'family' ? 'Warmth' : book.theme === 'birthday' ? 'Celebration' : 'Cheerful'} Music
              </div>
              <div className="text-[10px] text-white/80 mt-0.5">Generative audio</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Book Container ── */}
      <div ref={containerRef} className="w-full h-full flex items-center justify-center pt-20 pb-8"
        style={{ perspective: '3000px', perspectiveOrigin: '50% 50%' }}>
        <div className="relative" style={{ transform: `scale(${zoom}) rotateX(5deg)`, transformStyle: 'preserve-3d', transition: 'transform 0.3s ease-out', willChange: 'transform' }}>
          <div ref={pageRef} className="relative bg-white rounded-lg overflow-visible"
            style={{
              width: isSinglePage ? '400px' : '800px', height: '600px',
              transformStyle: 'preserve-3d',
              boxShadow: '0 30px 90px rgba(0,0,0,0.25), 0 15px 40px rgba(0,0,0,0.15), 0 5px 15px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.1)',
              filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.2))',
              willChange: 'transform',
            }}>
            {/* ── Left Page ── */}
            {left && (() => {
              const isFrontCover = currentSpread === 0;
              let transform = '';
              const m = mouseRef.current;

              if (isFrontCover && activeCurl && curlState.curlSide === 'right') {
                const dx = 400 - m.x;
                const dy = 600 - m.y;
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const clampedAngle = Math.max(-45, Math.min(45, 135 - angle));
                const rotateY = curlState.curlAmount * 180;
                const rotateZ = -clampedAngle * curlState.curlAmount * 0.3;
                transform = `translateX(${curlState.curlAmount * 15}px) translateY(${(m.y - m.dragStartY) * curlState.curlAmount * 0.3}px) translateZ(${curlState.curlAmount * 40}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
              } else if (!isFrontCover && activeCurl && curlState.curlSide === 'left') {
                const dx = m.x;
                const dy = 600 - m.y;
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const clampedAngle = Math.max(-45, Math.min(45, angle - 45));
                const rotateY = -curlState.curlAmount * 180;
                const rotateZ = clampedAngle * curlState.curlAmount * 0.3;
                transform = `translateX(${-curlState.curlAmount * 15}px) translateY(${(m.y - m.dragStartY) * curlState.curlAmount * 0.3}px) translateZ(${curlState.curlAmount * 40}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
              } else if (isFrontCover && isHovering === 'right') {
                transform = 'rotateY(3deg) translateZ(8px)';
              } else if (!isFrontCover && isHovering === 'left') {
                transform = 'rotateY(-3deg) translateZ(8px)';
              }

              return (
                <div className="absolute top-0 left-0"
                  style={{
                    width: '400px', height: '600px', transformStyle: 'preserve-3d',
                    transformOrigin: 'right bottom', transform,
                    transition: activeCurl ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    willChange: 'transform',
                  }}
                  onMouseDown={(e) => {
                    if (isFrontCover && currentSpread < totalSpreads) handleMouseDown(e, 'right');
                    else if (currentSpread > 0) handleMouseDown(e, 'left');
                  }}>
                  {/* Front face */}
                  <div className="absolute inset-0 bg-white overflow-hidden"
                    style={{
                      borderRadius: '8px 0 0 8px',
                      boxShadow: activeCurl && ((isFrontCover && curlState.curlSide === 'right') || (!isFrontCover && curlState.curlSide === 'left'))
                        ? (isFrontCover
                          ? `${curlState.curlAmount * 20}px ${curlState.curlAmount * 5}px ${25 + curlState.curlAmount * 25}px rgba(0,0,0,${0.04 + curlState.curlAmount * 0.08})`
                          : `${-curlState.curlAmount * 20}px ${curlState.curlAmount * 5}px ${25 + curlState.curlAmount * 25}px rgba(0,0,0,${0.04 + curlState.curlAmount * 0.08})`)
                        : '2px 0 10px rgba(0,0,0,0.02)',
                      backfaceVisibility: 'hidden',
                    }}>
                    <div className="absolute inset-y-0 right-0 w-16 pointer-events-none"
                      style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.015) 0%, transparent 100%)', opacity: activeCurl ? 0 : 0.7, transition: 'opacity 0.2s ease-out' }} />
                    <PageRenderer page={left} debugMode={debugMode} />
                  </div>
                  {/* Back face */}
                  <div className="absolute inset-0 bg-white overflow-hidden"
                    style={{ borderRadius: '0 8px 8px 0', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', boxShadow: '2px 0 15px rgba(0,0,0,0.05)' }}>
                    <div className="w-full h-full flex items-center justify-center text-gray-200" />
                  </div>
                  {/* Curl indicator */}
                  {!activeCurl && (isFrontCover ? currentSpread < totalSpreads : currentSpread > 0) && (
                    <div className={`absolute bottom-0 w-32 h-32 cursor-grab group transition-all ${isFrontCover ? 'right-0' : 'left-0'}`}
                      style={{ background: isFrontCover
                        ? (isHovering === 'right' ? 'linear-gradient(225deg, transparent 0%, transparent 50%, rgba(0,0,0,0.04) 100%)' : 'linear-gradient(225deg, transparent 0%, transparent 65%, rgba(0,0,0,0.01) 100%)')
                        : (isHovering === 'left' ? 'linear-gradient(135deg, transparent 0%, transparent 50%, rgba(0,0,0,0.04) 100%)' : 'linear-gradient(135deg, transparent 0%, transparent 65%, rgba(0,0,0,0.01) 100%)'),
                        transition: 'background 0.2s ease-out' }}>
                      <div className={`absolute bottom-6 transition-all duration-200 group-hover:scale-125 ${isFrontCover ? 'right-6' : 'left-6'}`}>
                        {isFrontCover
                          ? <ChevronRight className="w-6 h-6 text-gray-400 opacity-0 group-hover:opacity-80 transition-all duration-200 drop-shadow-lg" />
                          : <ChevronLeft className="w-6 h-6 text-gray-400 opacity-0 group-hover:opacity-80 transition-all duration-200 drop-shadow-lg" />}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── Right Page ── */}
            {right && (() => {
              let transform = '';
              const m = mouseRef.current;

              if (activeCurl && curlState.curlSide === 'right') {
                const adjustedMouseX = isSinglePage ? m.x : m.x - 400;
                const dx = 400 - adjustedMouseX;
                const dy = 600 - m.y;
                const angle = Math.atan2(dy, dx) * (180 / Math.PI);
                const clampedAngle = Math.max(-45, Math.min(45, 135 - angle));
                const rotateY = curlState.curlAmount * 180;
                const rotateZ = -clampedAngle * curlState.curlAmount * 0.3;
                transform = `translateX(${curlState.curlAmount * 15}px) translateY(${(m.y - m.dragStartY) * curlState.curlAmount * 0.3}px) translateZ(${curlState.curlAmount * 40}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`;
              } else if (isHovering === 'right') {
                transform = 'rotateY(3deg) translateZ(8px)';
              }

              return (
                <div className="absolute top-0 right-0"
                  style={{
                    width: '400px', height: '600px', transformStyle: 'preserve-3d',
                    transformOrigin: isSinglePage ? 'center bottom' : 'left bottom', transform,
                    transition: activeCurl ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    willChange: 'transform',
                  }}
                  onMouseDown={(e) => currentSpread < totalSpreads && handleMouseDown(e, 'right')}>
                  {/* Front face */}
                  <div className="absolute inset-0 bg-white overflow-hidden"
                    style={{
                      borderRadius: isSinglePage ? '8px' : '0 8px 8px 0',
                      boxShadow: activeCurl && curlState.curlSide === 'right'
                        ? `${curlState.curlAmount * 20}px ${curlState.curlAmount * 5}px ${25 + curlState.curlAmount * 25}px rgba(0,0,0,${0.04 + curlState.curlAmount * 0.08})`
                        : '-2px 0 10px rgba(0,0,0,0.02)',
                      backfaceVisibility: 'hidden',
                    }}>
                    <div className="absolute inset-y-0 left-0 w-16 pointer-events-none"
                      style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.015) 0%, transparent 100%)', opacity: activeCurl && curlState.curlSide === 'right' ? 0 : 0.7, transition: 'opacity 0.2s ease-out' }} />
                    <PageRenderer page={right} debugMode={debugMode} />
                  </div>
                  {/* Back face */}
                  <div className="absolute inset-0 bg-white overflow-hidden"
                    style={{ borderRadius: '8px 0 0 8px', transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', boxShadow: '-2px 0 15px rgba(0,0,0,0.05)' }}>
                    <div className="w-full h-full flex items-center justify-center text-gray-200" />
                  </div>
                  {/* Curl indicator */}
                  {!activeCurl && currentSpread < totalSpreads && (
                    <div className="absolute bottom-0 right-0 w-32 h-32 cursor-grab group transition-all"
                      style={{ background: isHovering === 'right'
                        ? 'linear-gradient(225deg, transparent 0%, transparent 50%, rgba(0,0,0,0.04) 100%)'
                        : 'linear-gradient(225deg, transparent 0%, transparent 65%, rgba(0,0,0,0.01) 100%)',
                        transition: 'background 0.2s ease-out' }}>
                      <div className="absolute bottom-6 right-6 transition-all duration-200 group-hover:scale-125">
                        <ChevronRight className="w-6 h-6 text-gray-400 opacity-0 group-hover:opacity-80 transition-all duration-200 drop-shadow-lg" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ── Center Spine Shadow ── */}
            {!isSinglePage && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-10 transition-all duration-300"
                style={{
                  width: activeCurl ? `${4 - curlState.curlAmount * 1.5}px` : '4px', height: '700px',
                  background: 'linear-gradient(to right, rgba(0,0,0,0.04), rgba(0,0,0,0.02), rgba(0,0,0,0.04))',
                  filter: `blur(${activeCurl ? 1 : 2}px)`,
                  opacity: activeCurl ? 1 - curlState.curlAmount * 0.6 : 0.5,
                }} />
            )}

            {/* ── 3D Curled Page Effect ── */}
            {activeCurl && curlState.curlSide && curlState.curlAmount > 0.05 && (() => {
              const pw = 400, ph = 560;
              const m = mouseRef.current;
              let cornerX: number, cornerY: number;
              if (curlState.curlSide === 'right') {
                cornerX = pw - (pw - m.x) * curlState.curlAmount;
                cornerY = ph - (ph - m.y) * curlState.curlAmount;
              } else {
                cornerX = m.x * curlState.curlAmount;
                cornerY = ph - (ph - m.y) * curlState.curlAmount;
              }
              const distFromCorner = Math.sqrt(
                Math.pow(m.x - (curlState.curlSide === 'right' ? pw : 0), 2) + Math.pow(m.y - ph, 2),
              );
              const curlSize = Math.min(400, 200 + distFromCorner * 0.5) * curlState.curlAmount;
              const dx = curlState.curlSide === 'right' ? pw - m.x : m.x;
              const dy = ph - m.y;
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              const isRight = curlState.curlSide === 'right';

              return (
                <>
                  {/* Main curl shadow */}
                  <div className="absolute pointer-events-none" style={{
                    width: `${curlSize}px`, height: `${curlSize}px`,
                    bottom: `${ph - cornerY}px`,
                    right: isRight ? `${pw - cornerX}px` : 'auto',
                    left: isRight ? 'auto' : `${cornerX - curlSize}px`,
                    background: isRight
                      ? `radial-gradient(ellipse at ${curlSize * 0.9}px ${curlSize * 0.85}px, rgba(255,255,255,1) 0%, rgba(245,245,245,0.98) 12%, rgba(230,230,230,0.85) 25%, rgba(200,200,200,0.65) 40%, rgba(160,160,160,0.45) 55%, rgba(120,120,120,0.25) 72%, transparent 100%)`
                      : `radial-gradient(ellipse at ${curlSize * 0.1}px ${curlSize * 0.85}px, rgba(255,255,255,1) 0%, rgba(245,245,245,0.98) 12%, rgba(230,230,230,0.85) 25%, rgba(200,200,200,0.65) 40%, rgba(160,160,160,0.45) 55%, rgba(120,120,120,0.25) 72%, transparent 100%)`,
                    borderRadius: isRight ? '100% 0 0 0' : '0 100% 0 0',
                    boxShadow: `${isRight ? '-' : ''}${8 * curlState.curlAmount}px ${5 * curlState.curlAmount}px ${25 * curlState.curlAmount}px rgba(0,0,0,${0.08 * curlState.curlAmount})`,
                    transform: `rotate(${isRight ? angle - 45 : 45 - angle}deg) scale(${1 + curlState.curlAmount * 0.2})`,
                    transformOrigin: isRight ? 'bottom right' : 'bottom left',
                    opacity: Math.min(curlState.curlAmount * 1.4, 1),
                    filter: `blur(${curlState.curlAmount * 2}px)`,
                    zIndex: 15,
                  }} />
                  {/* Curl highlight */}
                  <div className="absolute pointer-events-none" style={{
                    width: `${curlSize * 0.85}px`, height: `${curlSize * 0.85}px`,
                    bottom: `${ph - cornerY}px`,
                    right: isRight ? `${pw - cornerX}px` : 'auto',
                    left: isRight ? 'auto' : `${cornerX - curlSize * 0.85}px`,
                    background: isRight
                      ? `linear-gradient(${230 + angle * 0.25}deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.45) 40%, transparent 70%)`
                      : `linear-gradient(${130 - angle * 0.25}deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 20%, rgba(255,255,255,0.45) 40%, transparent 70%)`,
                    borderRadius: isRight ? '100% 0 0 0' : '0 100% 0 0',
                    transform: `rotate(${isRight ? angle - 45 : 45 - angle}deg)`,
                    transformOrigin: isRight ? 'bottom right' : 'bottom left',
                    opacity: curlState.curlAmount * 0.85,
                    mixBlendMode: 'screen' as any,
                    zIndex: 16,
                  }} />
                  {/* Fold line */}
                  <div className="absolute pointer-events-none" style={{
                    width: `${curlSize * 1.4}px`, height: '3px',
                    bottom: `${ph - cornerY + 1}px`,
                    right: isRight ? `${pw - cornerX - curlSize * 0.7}px` : 'auto',
                    left: isRight ? 'auto' : `${cornerX - curlSize * 0.7}px`,
                    background: `linear-gradient(to ${isRight ? 'left' : 'right'}, rgba(80,80,80,${0.2 * curlState.curlAmount}) 0%, rgba(100,100,100,${0.35 * curlState.curlAmount}) 30%, rgba(120,120,120,${0.4 * curlState.curlAmount}) 50%, rgba(100,100,100,${0.25 * curlState.curlAmount}) 70%, transparent 100%)`,
                    transform: `rotate(${isRight ? angle - 45 : 45 - angle}deg)`,
                    transformOrigin: isRight ? 'right center' : 'left center',
                    filter: 'blur(0.5px)',
                    zIndex: 17,
                  }} />
                  {/* Inner shadow */}
                  <div className="absolute pointer-events-none" style={{
                    width: `${curlSize * 0.6}px`, height: `${curlSize * 0.6}px`,
                    bottom: `${ph - cornerY - 5}px`,
                    right: isRight ? `${pw - cornerX - 10}px` : 'auto',
                    left: isRight ? 'auto' : `${cornerX - curlSize * 0.6 + 10}px`,
                    background: isRight
                      ? `radial-gradient(ellipse at bottom right, rgba(0,0,0,${0.12 * curlState.curlAmount}) 0%, rgba(0,0,0,${0.06 * curlState.curlAmount}) 30%, transparent 65%)`
                      : `radial-gradient(ellipse at bottom left, rgba(0,0,0,${0.12 * curlState.curlAmount}) 0%, rgba(0,0,0,${0.06 * curlState.curlAmount}) 30%, transparent 65%)`,
                    borderRadius: isRight ? '0 0 100% 0' : '0 0 0 100%',
                    transform: `rotate(${isRight ? angle - 45 : 45 - angle}deg)`,
                    transformOrigin: isRight ? 'bottom right' : 'bottom left',
                    opacity: curlState.curlAmount * 0.9,
                    filter: 'blur(2px)',
                    zIndex: 14,
                  }} />
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* ── Navigation Arrows ── */}
      <button onClick={handlePrev} disabled={currentSpread === 0}
        className="fixed left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-xl hover:shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-110 z-10"
        style={{ opacity: currentSpread === 0 ? 0.3 : 1 }}>
        <ChevronLeft className="w-7 h-7 text-gray-700" />
      </button>
      <button onClick={handleNext} disabled={currentSpread >= totalSpreads}
        className="fixed right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-xl hover:shadow-2xl disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:scale-110 z-10"
        style={{ opacity: currentSpread >= totalSpreads ? 0.3 : 1 }}>
        <ChevronRight className="w-7 h-7 text-gray-700" />
      </button>

      {/* ── Bottom Progress ── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg z-10">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSpreads + 1 }).map((_, i) => (
            <button key={i} onClick={() => {
              if (!curlState.isFlipping) {
                setCurlState(prev => ({ ...prev, isFlipping: true }));
                setTimeout(() => {
                  setCurrentSpread(i);
                  setCurlState(prev => ({ ...prev, isFlipping: false }));
                }, 300);
              }
            }}
            className={`w-2 h-2 rounded-full transition-all ${i === currentSpread ? 'bg-blue-500 w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
            title={`Spread ${i + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
