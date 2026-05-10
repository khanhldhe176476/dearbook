# 📚 3D Book Viewer - Demo Instructions

## 🎯 Quick Start

### Option 1: Test từ Dashboard (Nhanh nhất!)

```
1. Login vào DearBook
2. Nhìn góc dưới bên phải màn hình
3. Thấy button "Test 3D Book" màu xanh dương
4. Click → 3D book viewer mở ngay!
```

**Screenshot locations:**
- Bottom right corner
- Blue gradient button
- Icon: 📦 (Box)

---

### Option 2: Test từ Book Editor

```
1. Vào Library → Click "Tạo sách mới"
2. Chọn theme: Love
3. Chọn template: "Romantic Love Story - 10 Pages" (NEW badge)
4. Step 3: Customize character (hoặc skip)
5. Step 4: Page Editor
6. Nhìn góc trên bên phải
7. Click button "Xem 3D" (màu xanh dương, bên cạnh "Đặt hàng")
8. 3D book viewer mở!
```

---

### Option 3: Standalone HTML Demo

```
1. Mở file: /test-3d.html
2. Trong browser (Chrome/Firefox/Safari)
3. Pure CSS 3D demo
4. No dependencies needed
```

---

## 🎮 Cách điều khiển

### 1. **Xoay sách (Rotate)**
```
• Click chuột trái + kéo
• Kéo ngang → xoay trái/phải (Y axis)
• Kéo dọc → xoay lên/xuống (X axis)
• Giới hạn: -60° đến 60° (Y), -30° đến 10° (X)
```

### 2. **Lật trang (Flip Pages)**
```
• Click mũi tên trái (←) → lùi 1 trang
• Click mũi tên phải (→) → tiến 1 trang
• Animation: 600ms smooth flip
• Disabled khi đang lật
```

### 3. **Zoom**
```
• Click button (+) → phóng to
• Click button (-) → thu nhỏ
• Range: 0.5x - 1.2x
• Default: 0.85x (toàn bộ sách visible)
```

### 4. **Reset View**
```
• Click button ⟳ (reset icon)
• Về góc nhìn mặc định:
  - Zoom: 0.85x
  - Rotate Y: -25°
  - Rotate X: -10°
```

### 5. **Đóng 3D Viewer**
```
• Click X (góc trên phải)
• Hoặc ESC key (if implemented)
```

---

## 🎨 Giao diện 3D Viewer

```
┌─────────────────────────────────────────────────────────┐
│  👁️ Our Love Story          Status: Page 1-2        ❌  │ ← Top Bar
├─────────────────────────────────────────────────────────┤
│                                                         │
│                                                         │
│                    📖 3D BOOK                           │
│                  ┌─────────────┐                        │
│                  │    COVER    │                        │
│                  │   & PAGES   │                        │
│                  │   (Rotate   │                        │
│                  │   & Flip)   │                        │
│                  └─────────────┘                        │
│                                                         │
│  💡 Controls                              ┌──┐          │
│  • Drag to rotate                         │ + │  ← Zoom │
│  • Arrows to flip                         ├──┤          │
│  • Zoom on right                          │ - │          │
│                                           ├──┤          │
│                                           │ ⟳ │  ← Reset│
│                                           └──┘          │
│         ┌──────────────────────┐                        │
│         │  ◀   1 / 5    ▶     │  ← Navigation          │
│         └──────────────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Features trong Demo

### Visual Effects:
- ✅ Realistic 3D book perspective
- ✅ Dynamic spine thickness
- ✅ Center shadow between pages
- ✅ Soft page shadows
- ✅ Gradient dark background
- ✅ Frosted glass UI controls

### Interactions:
- ✅ Smooth drag-to-rotate
- ✅ Cursor changes (grab ↔ grabbing)
- ✅ Disabled state when flipping
- ✅ Smooth zoom transitions
- ✅ Page flip animation with curve

### Content Rendering:
- ✅ Text with custom fonts
- ✅ Images with fit options
- ✅ Background images
- ✅ Shapes and colors
- ✅ Multi-element pages

---

## 📖 Sample Book Content

### Cover:
```
Title: "Our Love Story"
Subtitle: "A beautiful journey together"
Background: Pink gradient + couple image
```

### Page 1-2:
```
Left: "Chapter 1" with romantic background
Right: Love quote in pink italic font
```

### Page 3-4:
```
Left: City night lights scene
Right: Text about journey together
```

---

## 🔧 Technical Info

### Browser Support:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Performance:
- 60 FPS animations
- Hardware-accelerated transforms
- No external 3D libraries (pure CSS)
- Lightweight bundle

### Dimensions:
```
Book width: 700px
Book height: 900px
Page width: 350px each
Spine: 30-60px (dynamic)
Viewport perspective: 2500px
```

---

## 🎯 What to Look For

### ✅ Good Signs:
1. Book appears **fully visible** on load (not zoomed in)
2. Can see **entire book** from slight angle
3. Dragging is **smooth** (not laggy)
4. Page flip **completes cleanly** (no artifacts)
5. Text is **readable** on pages
6. Images **load properly**
7. Spine shows **book title**
8. Controls **don't block** the book

### ❌ Bad Signs:
1. Book too zoomed in (can't see whole book)
2. Pages overlapping weirdly
3. Animation stutter
4. Cursor stuck in grabbing mode
5. Broken images
6. Text unreadable
7. Controls blocking view

---

## 🐛 Common Issues & Fixes

### Issue: Button không hiện
**Fix:** Đảm bảo đã login và ở màn hình Dashboard/Step 4

### Issue: 3D viewer mở nhưng trắng xóa
**Fix:** Check console for errors, verify book data structure

### Issue: Không xoay được
**Fix:** Đảm bảo drag trên book, không phải UI controls

### Issue: Lật trang bị lag
**Fix:** Close other tabs, check GPU acceleration trong browser

### Issue: Ảnh không load
**Fix:** Verify image URLs, check CORS policy

---

## 📱 Mobile Support (Future)

Currently optimized for desktop. Mobile features planned:
- Touch gestures (swipe to flip)
- Pinch to zoom
- Auto-rotate on device orientation
- Simplified controls

---

## 🎥 Demo Scenarios

### Scenario A: Quick Preview
```
1. Dashboard → Test 3D Book button
2. Drag to rotate left/right
3. Click → to flip forward
4. Click X to close
Duration: 30 seconds
```

### Scenario B: Full Experience
```
1. Create new Love book
2. Choose Romantic template (10 pages)
3. Edit some text/images
4. Click "Xem 3D"
5. Explore all pages
6. Test all controls
Duration: 3-5 minutes
```

### Scenario C: Standalone Demo
```
1. Open test-3d.html
2. Test drag rotation
3. Test page flipping
4. Observe animations
Duration: 1-2 minutes
```

---

## ✅ Final Checklist

Xác nhận các tính năng sau:

- [ ] Button "Test 3D Book" visible ở Dashboard
- [ ] Button "Xem 3D" visible ở Step 4
- [ ] Click button → 3D viewer mở
- [ ] Book hiển thị toàn bộ (not too zoomed)
- [ ] Drag để xoay works
- [ ] Arrow buttons lật trang works
- [ ] Zoom +/- works
- [ ] Reset button works
- [ ] X button đóng viewer
- [ ] Animations smooth (no lag)
- [ ] Text readable
- [ ] Images load
- [ ] No console errors

---

## 🚀 Ready to Test!

Tất cả đã sẵn sàng. Hãy test và cho feedback! 🎉

**Expected result:**  
Một 3D book viewer realistic, smooth, beautiful mà người dùng có thể xoay, lật trang, và zoom như đang cầm cuốn sách thật! 📖✨
