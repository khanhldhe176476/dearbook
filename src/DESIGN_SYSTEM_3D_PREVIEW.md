# 🎨 Design System - 3D Book Preview

## 📐 Layout Structure

### Desktop (≥1024px)
- **Layout**: 2-Column Grid (70% Canvas + 30% Controls)
- **Canvas Area**: Left column với aspect ratio 16:10
- **Control Panel**: Right sidebar với 4 nhóm controls rõ ràng
- **Max Width**: 1920px container

### Mobile (<1024px)
- **Layout**: Full-screen với Bottom Sheet controls
- **Canvas Area**: Full viewport height (trừ header + navigation)
- **Controls**: Bottom sheet modal khi tap Menu icon
- **Bottom Navigation**: Always visible với Prev/Next/Order buttons

---

## 🎯 Component Hierarchy

```
Book3DPreview (Desktop)
├── Header
│   ├── Back Button
│   ├── Title + Book Name
│   └── Order CTA
├── Canvas Area (70%)
│   ├── 3D Canvas (Three.js)
│   ├── Page Badge (top-left)
│   ├── Zoom Badge (top-right)
│   ├── Tooltip (bottom-center)
│   └── Progress Bar (bottom)
└── Control Panel (30%)
    ├── Title Card
    ├── Group 1: Navigation
    │   ├── Page Counter
    │   └── Prev/Next Buttons
    ├── Group 2: View Mode
    │   ├── Segmented Control (3 modes)
    │   └── Mode Description
    ├── Group 3: Camera Tools
    │   ├── Zoom Level Display
    │   ├── Zoom In/Out Buttons
    │   ├── Reset View Button
    │   └── Auto-rotate Toggle
    ├── Group 4: Actions
    │   ├── Place Order (Primary)
    │   └── Back to Editor (Secondary)
    └── Delivery Info

Book3DPreviewMobile
├── Header (sticky)
│   ├── Back Icon
│   ├── Title (center)
│   └── Menu Icon
├── Canvas Area (full-screen)
│   ├── 3D Canvas
│   ├── Page Badge
│   ├── Zoom Badge
│   └── Tooltip
├── Bottom Navigation (sticky)
│   ├── Prev Button
│   ├── Order Button (CTA)
│   ├── Next Button
│   └── Progress Bar
└── Bottom Sheet (modal)
    └── (Same controls as Desktop Panel)
```

---

## 🎨 Design Tokens

### Colors (Pastel Palette)
- **Primary**: `from-rose-500 to-pink-600` (Gradient)
- **Secondary**: `from-purple-500 to-blue-600`
- **Success**: `from-green-50 to-emerald-50`
- **Background**: `from-rose-50 via-purple-50 to-blue-50` (Gradient)
- **Surface**: White with shadow
- **Text Primary**: `gray-900`
- **Text Secondary**: `gray-600`

### Typography
- **Font Family**: Poppins (primary), Inter (secondary)
- **Headings**: Bold (600-700)
- **Body**: Regular (400)
- **Labels**: Medium (500-600)

### Spacing
- **Section Gap**: 8 (2rem)
- **Card Padding**: 6 (1.5rem)
- **Button Padding**: px-6 py-3
- **Element Gap**: 3-4 (0.75-1rem)

### Border Radius
- **Cards**: 2xl-3xl (1rem-1.5rem)
- **Buttons**: xl (0.75rem)
- **Inputs**: xl (0.75rem)
- **Badges**: lg-xl

### Shadows
- **Cards**: `shadow-lg` or `shadow-2xl`
- **Buttons (hover)**: `shadow-xl` with color glow
- **Overlays**: `shadow-2xl`

---

## 🔧 Component Classes (Dev Reference)

### Layer Names for Figma Handoff
```
✅ Canvas3D_Area         - Main 3D canvas container
✅ ControlPanel          - Right sidebar wrapper
✅ ModeSwitch            - Segmented control for view modes
✅ PrevButton            - Previous page button
✅ NextButton            - Next page button
✅ ZoomIn                - Zoom in button
✅ ZoomOut               - Zoom out button
✅ ResetView             - Reset camera button
✅ BackToEditor          - Secondary back button
✅ PlaceOrder            - Primary order CTA button
```

---

## 📱 Responsive Behavior

### Breakpoints
- **Desktop**: ≥1024px (lg)
- **Mobile**: <1024px

### Auto-Detection
`Book3DPreviewResponsive` component tự động detect screen size và render:
- Desktop → `Book3DPreview`
- Mobile → `Book3DPreviewMobile`

---

## 🎭 States & Variants

### View Modes (3 states)
1. **Showcase** 
   - Camera: `x: 1.2, y: 0.8, z: 2.5`, FOV: 50
   - Auto-rotate: ON
   - Description: "Xoay 360° để ngắm toàn bộ cuốn sách"

2. **Flip**
   - Camera: `x: 0, y: 1.2, z: 2.0`, FOV: 45
   - Auto-rotate: OFF
   - Description: "Góc nhìn từ trên để lật trang"

3. **Read**
   - Camera: `x: 0, y: 0, z: 1.6`, FOV: 40
   - Auto-rotate: OFF
   - Description: "Nhìn thẳng để đọc nội dung rõ nhất"

### Zoom Levels (3 levels)
- 100% (default)
- 125%
- 150%

### Page States
- **Loading**: Full-screen spinner với bounce animation
- **Empty**: "Chưa có nội dung" state với icon
- **Error**: "Không thể tải" với Retry + Back buttons
- **Success**: Main UI

---

## 🎬 Interactions & Animations

### Button Hovers
- `hover:scale-105` - Slight scale up
- `active:scale-95` - Press down effect
- `transition-all duration-300` - Smooth transitions

### Mode Switch
- Active mode: `scale-105` with `shadow-lg`
- Inactive: No shadow, gray text
- Transition: `duration-300`

### Canvas Interactions
- **Drag**: Rotate book (OrbitControls)
- **Scroll**: Zoom in/out
- **Touch (Mobile)**: 2-finger pinch to zoom

### Bottom Sheet (Mobile)
- Slide up animation: `animate-slide-up`
- Backdrop: `bg-black/50 backdrop-blur-sm`
- Handle: Centered gray bar

---

## ✨ Premium Details

### Micro-interactions
- Button hover với color glow shadow
- Auto-rotate toggle với smooth transition
- Progress bar với gradient fill animation
- Page number animated change

### Visual Hierarchy
1. **Primary CTA**: Order button (gradient pink-rose)
2. **Canvas**: 70% space, central focus
3. **Navigation**: Prominent in panel
4. **Tools**: Secondary actions below

### Accessibility
- Clear button labels
- Disabled states với opacity + cursor
- Tooltips for guidance
- Keyboard navigation ready

---

## 📦 Assets Required

### Icons (lucide-react)
- `BookOpen` - Book/loading icons
- `Eye` - View mode section
- `ZoomIn`, `ZoomOut` - Camera controls
- `RotateCcw` - Reset view
- `ArrowLeft` - Back navigation
- `ShoppingCart` - Order CTA
- `ChevronLeft`, `ChevronRight` - Page navigation
- `Sparkles` - Decorative
- `Menu`, `X` - Mobile menu toggle

### 3D Model
- Book geometry from `MinimalBook.tsx`
- Lighting: ambient + directional + point
- Shadow: enabled on meshes

---

## 🚀 Implementation Notes

### Performance
- Lazy load Three.js (only load on 3D preview route)
- Canvas DPR: `[1, 2]` for retina
- Suspense fallback với loading spinner
- Error boundary wrapper

### Browser Support
- WebGL required
- Modern browsers (Chrome, Safari, Firefox, Edge)
- Fallback: Error state với message

### Data Flow
```
App.tsx (BookProject data)
  ↓
Book3DPreviewResponsive (detect screen size)
  ↓
Book3DPreview / Book3DPreviewMobile
  ↓
MinimalBook (3D rendering)
```

---

## 📋 Checklist for Dev

- [x] Desktop layout 70-30 implemented
- [x] Mobile version với bottom sheet
- [x] Responsive detection working
- [x] 3 view modes với different cameras
- [x] Zoom levels (100, 125, 150)
- [x] Page navigation (Prev/Next)
- [x] Loading, Empty, Error states
- [x] Auto-rotate toggle
- [x] Progress bar
- [x] Order CTA prominent
- [x] Pastel color scheme
- [x] Premium animations
- [x] Proper layer naming

---

## 🎯 User Flow

1. User clicks "Xem 3D" from Editor
2. Loading state (1.5s with animation)
3. Canvas loads → Default: Showcase mode, auto-rotate ON
4. User can:
   - Drag to rotate manually
   - Click Prev/Next to flip pages
   - Switch view modes (Showcase/Flip/Read)
   - Zoom in/out
   - Reset view anytime
   - Place order (→ Checkout)
   - Go back to Editor

---

**Version**: 1.0  
**Last Updated**: January 2026  
**Designer**: Bookify Team  
**Tech Stack**: React + TypeScript + Three.js (react-three-fiber)
