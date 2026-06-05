import { useRef, useEffect, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber@8.18.0';
import * as THREE from 'three';

interface BookData {
  title: string;
  coverFront: string;
  coverBack: string;
  spineText: string;
  pages: Array<{
    id: string;
    imageUrl: string;
    text: string;
    pageNumber: number;
  }>;
  thickness: number;
}

interface MinimalBookProps {
  bookData: BookData;
  currentPage: number;
}

export function MinimalBook({ bookData, currentPage }: MinimalBookProps) {
  const groupRef = useRef<any>(null);
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  const [backTexture, setBackTexture] = useState<THREE.Texture | null>(null);
  const [currentPageTexture, setCurrentPageTexture] = useState<THREE.Texture | null>(null);

  // Load textures
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    
    // Load front cover
    if (bookData.coverFront) {
      loader.load(
        bookData.coverFront,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          setFrontTexture(texture);
        },
        undefined,
        (error) => console.warn('Failed to load front cover:', error)
      );
    }

    // Load back cover
    if (bookData.coverBack) {
      loader.load(
        bookData.coverBack,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          setBackTexture(texture);
        },
        undefined,
        (error) => console.warn('Failed to load back cover:', error)
      );
    }
  }, [bookData.coverFront, bookData.coverBack]);

  // Load current page texture
  useEffect(() => {
    if (currentPage >= 0 && currentPage < bookData.pages.length) {
      const page = bookData.pages[currentPage];
      if (page.imageUrl) {
        const loader = new THREE.TextureLoader();
        loader.load(
          page.imageUrl,
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            setCurrentPageTexture(texture);
          },
          undefined,
          (error) => console.warn('Failed to load page texture:', error)
        );
      }
    }
  }, [currentPage, bookData.pages]);

  // Gentle floating animation
  useFrame((state) => {
    try {
      if (groupRef.current) {
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      }
    } catch (error) {
      console.error(' MinimalBook animation error:', error);
    }
  });

  // Create spine text texture
  const createSpineTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#be185d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(bookData.spineText || bookData.title, canvas.width / 2, canvas.height / 2);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  const spineTexture = createSpineTexture();

  return (
    <group ref={groupRef}>
      {/* Front cover with image */}
      <mesh position={[bookData.thickness / 2 + 0.01, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <planeGeometry args={[bookData.thickness, 0.85]} />
        <meshStandardMaterial 
          map={frontTexture} 
          color={frontTexture ? '#ffffff' : '#ec4899'}
          roughness={0.3} 
          metalness={0.1}
        />
      </mesh>

      {/* Back cover with image */}
      <mesh position={[-bookData.thickness / 2 - 0.01, 0, 0]} rotation={[0, -Math.PI / 2, 0]} castShadow receiveShadow>
        <planeGeometry args={[bookData.thickness, 0.85]} />
        <meshStandardMaterial 
          map={backTexture}
          color={backTexture ? '#ffffff' : '#be185d'}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Spine with text */}
      <mesh position={[0, 0, bookData.thickness / 2 + 0.01]} castShadow receiveShadow>
        <planeGeometry args={[0.85, 0.85]} />
        <meshStandardMaterial 
          map={spineTexture}
          roughness={0.4}
        />
      </mesh>

      {/* Pages block - showing stack of pages */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.83, bookData.thickness - 0.02]} />
        <meshStandardMaterial color="#fffbeb" roughness={0.8} metalness={0.0} />
      </mesh>

      {/* Current visible page (when flipping) */}
      {currentPageTexture && currentPage > 0 && (
        <mesh position={[0.01, 0, bookData.thickness / 2 - 0.01]} rotation={[0, 0, 0]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial 
            map={currentPageTexture}
            color="#ffffff"
            roughness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Top edge */}
      <mesh position={[0, 0.425, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.01, bookData.thickness]} />
        <meshStandardMaterial color="#d97706" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Bottom edge */}
      <mesh position={[0, -0.425, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.01, bookData.thickness]} />
        <meshStandardMaterial color="#d97706" roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  );
}
