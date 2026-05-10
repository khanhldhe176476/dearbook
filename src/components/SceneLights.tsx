// Scene lighting setup for 3D Book Preview
export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <pointLight position={[-5, 3, 5]} intensity={0.4} />
    </>
  );
}
