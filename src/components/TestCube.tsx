import { Box } from '@react-three/drei';

// Simple test component to verify Three.js components work
export function TestCube() {
  return (
    <Box 
      args={[1, 1, 1]} 
      position={[0, 0, 0]}
    >
      <meshStandardMaterial color="hotpink" />
    </Box>
  );
}
