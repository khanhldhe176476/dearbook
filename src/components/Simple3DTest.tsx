import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Simple cube to test if Three.js is working
function TestCube() {
  return (
    <mesh castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ec4899" />
    </mesh>
  );
}

export function Simple3DTest() {
  console.log('🧪 Simple3DTest mounted');
  
  return (
    <div className="w-full h-[600px] bg-gray-100 rounded-xl overflow-hidden">
      <Canvas
        shadows
        camera={{ position: [2, 2, 2], fov: 50 }}
        onCreated={() => console.log('✅ Test Canvas created')}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <TestCube />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
