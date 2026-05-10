# 📘 3D Book Preview Components

## Overview
Hệ thống components để hiển thị preview 3D của cuốn sách, tự động responsive giữa Desktop và Mobile.

---

## 🗂️ File Structure

```
/components/
├── Book3DPreviewResponsive.tsx  ← Entry point (Auto-detect Desktop/Mobile)
├── Book3DPreview.tsx            ← Desktop version (2-column layout)
├── Book3DPreviewMobile.tsx      ← Mobile version (Bottom sheet)
├── Book3DPreviewError.tsx       ← Error boundary wrapper
└── MinimalBook.tsx              ← 3D book model (Three.js)
```

---

## 🚀 Usage

### In App.tsx
```tsx
import { lazy } from 'react';

// Lazy load để optimize performance
const Book3DPreview = lazy(() => import('./components/Book3DPreviewResponsive'));

// Usage
<Suspense fallback={<Loading3D />}>
  <Book3DPreview 
    book={selectedBook} 
    onBack={() => setScreen('editor')}
    onOrder={() => setScreen('checkout')}
  />
</Suspense>
```

---

## 📱 Responsive Behavior

### Desktop (≥1024px)
- Component: `Book3DPreview`
- Layout: 70% Canvas + 30% Sidebar Controls
- Controls: Visible on right sidebar

### Mobile (<1024px)
- Component: `Book3DPreviewMobile`
- Layout: Full-screen canvas
- Controls: Bottom sheet modal (tap Menu icon)

---

## 🎨 Features

### Desktop
✅ 2-column layout (70-30)  
✅ Fixed sidebar controls  
✅ All controls visible  
✅ Hover interactions  

### Mobile
✅ Full-screen canvas  
✅ Bottom sheet modal  
✅ Touch-optimized controls  
✅ Always-visible navigation bar  

### Common Features
✅ 3 view modes (Showcase, Flip, Read)  
✅ 3 zoom levels (100%, 125%, 150%)  
✅ Page navigation (Prev/Next)  
✅ Auto-rotate toggle  
✅ Reset view  
✅ Loading, Empty, Error states  
✅ Progress bar  

---

## 🎯 Props Interface

```typescript
interface Book3DPreviewProps {
  book: BookProject;        // Book data với pages, title, etc.
  onBack: () => void;       // Callback khi click "Quay lại"
  onOrder: () => void;      // Callback khi click "Đặt hàng"
}
```

---

## 🎬 View Modes

### 1. Showcase (Default)
- **Camera**: Góc 3/4, artistic view
- **Auto-rotate**: ON
- **Use case**: Showcase book như product display

### 2. Flip
- **Camera**: Top-down view
- **Auto-rotate**: OFF
- **Use case**: Lật trang, xem layout

### 3. Read
- **Camera**: Front view, close-up
- **Auto-rotate**: OFF
- **Use case**: Đọc nội dung text/ảnh rõ ràng

---

## 🎨 States

### Loading
- Full-screen spinner
- Bounce animation với BookOpen icon
- Text: "Đang tạo bản xem trước 3D..."

### Empty
- Icon: FileQuestion
- Message: "Chưa có nội dung"
- Action: "Quay lại Editor" button

### Error
- Icon: AlertCircle
- Message: "Không thể tải Preview 3D"
- Actions: "Thử lại" + "Quay lại Editor"

### Success
- Main UI với canvas + controls

---

## 🔧 Customization

### Camera Positions
Edit trong component:
```typescript
const cameraConfigs = {
  showcase: {
    position: { x: 1.2, y: 0.8, z: 2.5 },
    target: { x: 0, y: 0, z: 0 },
    fov: 50
  },
  // ... other modes
};
```

### Zoom Levels
```typescript
type ZoomLevel = 100 | 125 | 150;
```

### Colors
Sử dụng Tailwind classes với pastel palette:
- `from-rose-500 to-pink-600` (Primary)
- `from-purple-500 to-blue-600` (Secondary)

---

## 🎯 Dev Tips

### Performance
- ✅ Components đã được lazy loaded
- ✅ Canvas DPR tối ưu `[1, 2]`
- ✅ Suspense fallback có sẵn
- ✅ Error boundary wrapper

### Debug
```typescript
// Bật debug mode trong component
const [debugMode, setDebugMode] = useState(false);

// Console logs tự động track:
// - Component mount/unmount
// - Camera changes
// - Page changes
// - View mode switches
```

### Extending
Để thêm view mode mới:
1. Add vào type: `type ViewMode = 'showcase' | 'flip' | 'read' | 'YOUR_MODE';`
2. Add camera config trong `cameraConfigs`
3. Add button trong segmented control
4. Add description text

---

## 🐛 Troubleshooting

### Canvas không hiển thị
- ✅ Check WebGL support trong browser
- ✅ Check console for Three.js errors
- ✅ Verify book data không null/undefined

### Performance issues
- ✅ Reduce DPR: `dpr={[1, 1]}`
- ✅ Disable shadows: remove `shadows` prop
- ✅ Lower poly count trong MinimalBook

### Mobile bottom sheet không mở
- ✅ Check z-index conflicts
- ✅ Verify `showControls` state
- ✅ Check backdrop click handler

---

## 📦 Dependencies

```json
{
  "@react-three/fiber": "^8.x",
  "@react-three/drei": "^9.x",
  "three": "^0.160.x",
  "lucide-react": "latest",
  "react": "^18.x",
  "typescript": "^5.x"
}
```

---

## 🎨 Design System Reference

See: `/DESIGN_SYSTEM_3D_PREVIEW.md` for:
- Complete layout specs
- Color tokens
- Typography scale
- Component hierarchy
- Interaction patterns
- Animation guidelines

---

**Questions?** Check the main design system doc or console logs for debugging info.
