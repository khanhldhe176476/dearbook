import { useRef } from 'react';
import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

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

interface SimpleBookProps {
  bookData: BookData;
  currentPage: number;
}

export function SimpleBook({ bookData, currentPage }: SimpleBookProps) {
  const groupRef = useRef<any>(null);

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main book body */}
      <Box 
        args={[0.6, 0.85, bookData.thickness]} 
        position={[0, 0, 0]}
        material-color="#ec4899"
        material-roughness={0.3}
        material-metalness={0.2}
      />

      {/* Front cover */}
      <Box 
        args={[0.02, 0.85, bookData.thickness]} 
        position={[0.31, 0, 0]}
        material-color="#f472b6"
        material-roughness={0.4}
      />

      {/* Back cover */}
      <Box 
        args={[0.02, 0.85, bookData.thickness]} 
        position={[-0.31, 0, 0]}
        material-color="#be185d"
        material-roughness={0.4}
      />
    </group>
  );
}
