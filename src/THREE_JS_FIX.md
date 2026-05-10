# 🔧 Fix Warning: "Multiple instances of Three.js"

## ⚠️ Vấn đề

Khi sử dụng `@react-three/fiber`, bạn có thể gặp warning:
```
WARNING: Multiple instances of Three.js being imported.
```

## 🎯 Nguyên nhân

1. **Import trực tiếp từ 'three'**: KHÔNG BAO GIỜ làm điều này
2. **Multiple Canvas instances**: Render nhiều Canvas cùng lúc
3. **React Strict Mode**: Development mode render 2 lần
4. **Package conflicts**: @react-spring/three conflict với @react-three/fiber
5. **WebGL context không được cleanup**: Memory leak

## ✅ Giải pháp đã áp dụng

### 1. KHÔNG import trực tiếp từ 'three'

```typescript
// ❌ SAI - Gây ra Multiple instances warning
import { Mesh, BoxGeometry, MeshStandardMaterial } from 'three';

// ✅ ĐÚNG - Chỉ import từ @react-three packages
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Environment, PerspectiveCamera } from '@react-three/drei';
```

### 2. Tạo ThreeCanvas Wrapper Component

File: `/components/ThreeCanvas.tsx`

```typescript
import { Canvas } from '@react-three/fiber';
import { ReactNode, useEffect, useRef, memo } from 'react';

function ThreeCanvasComponent({ children, ...props }: ThreeCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const unmountedRef = useRef(false);

  useEffect(() => {
    unmountedRef.current = false;

    return () => {
      unmountedRef.current = true;

      // Cleanup WebGL context
      setTimeout(() => {
        if (canvasRef.current && unmountedRef.current) {
          const canvas = canvasRef.current.querySelector('canvas');
          if (canvas) {
            const gl = canvas.getContext('webgl2') || 
                       canvas.getContext('webgl');
            
            if (gl) {
              const loseContext = gl.getExtension('WEBGL_lose_context');
              if (loseContext) {
                loseContext.loseContext(); // ✅ Dispose context
              }
            }
          }
        }
      }, 100);
    };
  }, []);

  return (
    <div ref={canvasRef} style={{ width: '100%', height: '100%' }}>
      <Canvas {...props}>
        {children}
      </Canvas>
    </div>
  );
}

export const ThreeCanvas = memo(ThreeCanvasComponent);
```

### 3. Sử dụng ThreeCanvas thay vì Canvas

```typescript
// ❌ Trước đây
import { Canvas } from '@react-three/fiber';

<Canvas>
  <mesh>...</mesh>
</Canvas>

// ✅ Bây giờ
import { ThreeCanvas } from './components/ThreeCanvas';

<ThreeCanvas 
  key={`unique-key-${id}`}  // ✅ Unique key
  shadows
  dpr={[1, 2]}
  frameloop="always"
  gl={{ 
    preserveDrawingBuffer: true,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    stencil: false,  // ✅ Optimize
    depth: true
  }}
  onCreated={(state) => {
    state.gl.setClearColor('#111827', 1);
    state.gl.toneMappingExposure = 1;
  }}
>
  <mesh>...</mesh>
</ThreeCanvas>
```

### 4. Loại bỏ @react-spring/three

```bash
# ❌ KHÔNG cài package này
npm uninstall @react-spring/three

# ✅ Chỉ dùng
npm install @react-three/fiber @react-three/drei
```

### 5. Optimizations

#### WebGL Config:
```typescript
gl={{ 
  preserveDrawingBuffer: true,  // Screenshot support
  antialias: true,              // Smooth edges
  alpha: false,                 // No transparency (faster)
  powerPreference: 'high-performance',  // Use GPU
  stencil: false,               // Không cần stencil buffer
  depth: true                   // Enable depth buffer
}}
```

#### Performance:
```typescript
dpr={[1, 2]}  // Pixel ratio (min 1, max 2)
frameloop="always"  // Continuous rendering cho animation
```

#### Unique Keys:
```typescript
// ✅ Mỗi Canvas cần unique key
<ThreeCanvas key={`book-canvas-${book.id}`}>
```

## 📋 Checklist

- [x] KHÔNG import từ 'three' package
- [x] Chỉ import từ '@react-three/fiber' và '@react-three/drei'
- [x] Loại bỏ '@react-spring/three'
- [x] Tạo ThreeCanvas wrapper với cleanup
- [x] Dispose WebGL context on unmount
- [x] Memoize component
- [x] Unique Canvas keys
- [x] Optimize GL config
- [x] Proper tone mapping

## 🎯 Kết quả

✅ Không còn "Multiple instances" warning
✅ WebGL context được cleanup properly
✅ Performance tối ưu
✅ Không memory leak
✅ Smooth 3D rendering

## 🚫 Những điều TUYỆT ĐỐI KHÔNG làm

1. ❌ `import { Vector3 } from 'three'`
2. ❌ `import * as THREE from 'three'`
3. ❌ Install `@react-spring/three`
4. ❌ Multiple Canvas without unique keys
5. ❌ Không cleanup WebGL context

## 📚 Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [WebGL Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)

---

**Lưu ý**: Warning này thường chỉ xuất hiện trong development mode và không ảnh hưởng production build. Tuy nhiên, việc fix đúng cách sẽ cải thiện performance và tránh memory leaks.
