# Cài đặt Dependencies cho Bookify

## Packages cần thiết cho 3D Preview

Chạy lệnh sau để cài đặt các dependencies:

```bash
npm install three @react-three/fiber @react-three/drei
```

hoặc với yarn:

```bash
yarn add three @react-three/fiber @react-three/drei
```

## Chi tiết packages:

### 1. **three** (v0.160.0+)
- Core library Three.js cho WebGL/3D rendering
- Cung cấp các object 3D, materials, lights, cameras

### 2. **@react-three/fiber** (v8.15.0+)
- React renderer cho Three.js
- Cho phép viết Three.js code theo React component pattern
- Quản lý scene, camera, renderer tự động

### 3. **@react-three/drei** (v9.96.0+)
- Helper components cho React Three Fiber
- Cung cấp: OrbitControls, Text, Environment, Camera, v.v.
- Giúp code ngắn gọn và dễ đọc hơn

**LƯU Ý**: Không cần cài đặt @react-spring/three nữa vì chúng ta sử dụng native React Three Fiber animations với useFrame.

## Cách sử dụng trong project:

### Import đúng cách:

```typescript
// ✅ ĐÚNG - Chỉ import từ @react-three
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment } from '@react-three/drei';

// ❌ SAI - KHÔNG import trực tiếp từ 'three'
// import { Mesh, BoxGeometry } from 'three';
```

### Component Structure:

```typescript
function MyComponent() {
  return (
    <Canvas>
      <ambientLight />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
      <OrbitControls />
    </Canvas>
  );
}
```

## Lưu ý quan trọng:

1. **Tránh Multiple Instances**: 
   - Chỉ import từ `@react-three/fiber` và `@react-three/drei`
   - KHÔNG import trực tiếp từ package `three`
   - KHÔNG sử dụng `@react-spring/three`

2. **Animation**: 
   - Sử dụng `useFrame` hook từ `@react-three/fiber`
   - Hoặc useState + useEffect cho state-based animations

3. **Textures**:
   - Sử dụng màu sắc và gradients thay vì texture loading
   - Nếu cần textures, dùng `useTexture` từ `@react-three/drei` (nhưng tránh với data URLs)

## Performance Tips:

1. **Suspense Boundary**: Luôn wrap Canvas trong Suspense
   ```typescript
   <Suspense fallback={<Loader />}>
     <Canvas>
       {/* 3D content */}
     </Canvas>
   </Suspense>
   ```

2. **Optimize Geometry**: Sử dụng primitive geometries
3. **Limit Page Count**: Tối ưu cho 10-50 pages
4. **Use Environment**: Dùng `<Environment preset="studio" />` thay vì nhiều lights

## Troubleshooting:

### Lỗi: "Module not found: @react-three/fiber"
```bash
npm install @react-three/fiber
```

### Lỗi: "Cannot find module 'three'"
```bash
npm install three
```

### Warning: "Multiple instances of Three.js"
- Kiểm tra không có import trực tiếp từ 'three'
- Xóa @react-spring/three nếu có
- Chỉ sử dụng @react-three/fiber và @react-three/drei
