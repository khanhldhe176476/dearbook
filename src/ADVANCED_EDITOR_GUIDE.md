# 📚 DearBook Advanced Editor Guide

## 🎨 Tổng quan

DearBook hiện đã được nâng cấp với **Advanced Book Editor** - công cụ thiết kế sách chuyên nghiệp với khả năng tùy biến cao!

---

## ✨ Tính năng mới

### 1. **Dual-Mode Editor**
- **Simple Mode** (Chế độ đơn giản): Chỉnh sửa nhanh văn bản theo template
- **Advanced Mode** (Chế độ nâng cao): Editor chuyên nghiệp với đầy đủ tính năng thiết kế

### 2. **Advanced Page Editor**

#### **Asset Library** (Thư viện tài nguyên)
- 📝 **Text**: Thêm văn bản với nhiều font chữ
- 🎭 **Stickers**: 50+ emoji/sticker theo chủ đề (trái tim, lễ hội, thiên nhiên, v.v.)
- 🎨 **Icons**: 50+ icon từ Lucide React
- ⬛ **Shapes**: Hình tròn, vuông, trái tim, ngôi sao, v.v.
- 🖼️ **Frames**: Khung viền trang trí
- 📷 **Images**: Upload ảnh hoặc chọn từ Unsplash

#### **Layer Management** (Quản lý lớp)
- Hiển thị tất cả elements theo thứ tự z-index
- Toggle visibility (ẩn/hiện)
- Lock/unlock elements
- Duplicate elements
- Delete elements
- Reorder layers (di chuyển lên/xuống)

#### **Properties Panel** (Bảng thuộc tính)
3 tabs chính:

**Style Tab:**
- **Text**: Font, size, weight, color, alignment, effects
- **Image**: URL, object-fit, border-radius, filters
- **Shape**: Fill color, stroke, stroke width
- **Icon**: Color, stroke width

**Position Tab:**
- X, Y coordinates
- Width, Height
- Rotation (0-360°)

**Effects Tab:**
- Opacity (0-100%)

#### **Editor Toolbar** (Thanh công cụ)
- ↶ Undo / Redo ↷
- 💾 Save
- Alignment tools (left, center, right, top, middle, bottom)
- Duplicate & Delete
- Grid toggle
- Zoom controls (in, out, fit)

#### **Canvas Features**
- 400x600px page size
- Drag & drop elements
- Click to select, Shift+Click for multi-select
- Real-time preview
- Optional grid overlay
- Multi-page navigation

### 3. **Portfolio-Style Library**

#### **View Modes**
- 🎯 **Masonry Grid**: Pinterest-style layout
- 📊 **Grid**: Uniform grid layout
- 📝 **List**: List view (coming soon)

#### **Filters & Sorting**
- 🔍 Search by title
- 🎨 Filter by theme (Love, Family, Birthday, Friendship)
- 📅 Sort: Recent, Oldest, Name A-Z, Theme

#### **Beautiful Book Cards**
- Gradient background theo theme
- Theme emoji & name
- Page count
- Last updated date
- Hover actions: Edit, Duplicate, Delete
- Status badge (Draft/Completed)

#### **Statistics**
- Book count per theme
- Quick theme overview

---

## 🎯 Cách sử dụng

### **Tạo sách mới**

1. **Login** vào DearBook
2. Click **"Tạo cuốn sách mới"**
3. Chọn **chủ đề** (Love/Family/Birthday/Friendship)
4. Chọn **template** có sẵn
5. Tùy chỉnh **nhân vật** (tùy chọn)
6. **Chỉnh sửa nội dung**:
   - Simple Mode: Form đơn giản
   - Advanced Mode: Editor chuyên nghiệp

### **Sử dụng Advanced Editor**

#### **Thêm Elements**
1. Click tab bên trái (Stickers/Icons/Shapes/Frames/Images)
2. Click vào item muốn thêm
3. Element xuất hiện trên canvas

#### **Chỉnh sửa Elements**
1. **Select**: Click vào element
2. **Move**: Drag element
3. **Resize**: (Coming soon - use Properties panel)
4. **Rotate**: Dùng slider trong Properties panel
5. **Style**: Điều chỉnh trong Properties panel

#### **Layer Management**
1. Xem tất cả layers ở panel bên phải (trên)
2. Click layer để select
3. Hover để hiện actions:
   - 👁️ Hide/Show
   - 🔒 Lock/Unlock
   - 📋 Duplicate
   - 🗑️ Delete
   - ⬆️⬇️ Reorder

#### **Keyboard Shortcuts**
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y`: Redo
- `Ctrl/Cmd + S`: Save
- `Ctrl/Cmd + D`: Duplicate selected
- `Delete/Backspace`: Delete selected
- `Shift + Click`: Multi-select

---

## 🎨 Thiết kế System

### **Color Palettes**
8 bộ màu được định nghĩa sẵn:
- Romance (Hồng pastel)
- Family (Xanh dương)
- Celebration (Tím)
- Friendship (Cam vàng)
- Pastel (Đa sắc nhẹ)
- Earth Tones (Nâu đất)
- Elegant (Đen trắng)
- Vibrant (Sắc nét)

### **Font Pairings**
5 cặp font được suggest:
- **Classic**: Playfair Display + Poppins
- **Modern**: Inter + Inter
- **Romantic**: Dancing Script + Poppins
- **Elegant**: Cormorant + Lato
- **Playful**: Fredoka + Nunito

### **Text Effects**
- None
- Shadow (Bóng đổ)
- Outline (Viền)
- Glow (Phát sáng)
- Gradient (Màu chuyển)

---

## 📁 Cấu trúc File

```
/components/editor/
├── AdvancedPageEditor.tsx       # Main editor component
├── AssetLibrary.tsx             # Asset picker (stickers, icons, shapes, etc.)
├── LayerPanel.tsx               # Layer management panel
├── PropertiesPanelAdvanced.tsx  # Element properties editor
├── EditorToolbar.tsx            # Top toolbar (undo, redo, align, etc.)

/components/builder/
├── Step4PageEditorAdvanced.tsx  # Wrapper with Simple/Advanced mode toggle

/data/
├── editorAssets.ts              # Asset definitions (stickers, icons, colors, etc.)

/types/
├── editor.ts                    # TypeScript types for editor

/components/
├── MyBooksLibraryPortfolio.tsx  # New portfolio-style library view
```

---

## 🚀 Tính năng sắp tới

- [ ] Resize handles on canvas
- [ ] Copy/Paste elements
- [ ] Text editing directly on canvas
- [ ] Background patterns & gradients
- [ ] Image cropping & filters advanced
- [ ] Animation preview
- [ ] Export to PDF/PNG
- [ ] Collaborative editing
- [ ] Template marketplace
- [ ] AI-powered suggestions

---

## 🎯 Best Practices

### **Thiết kế sách đẹp**

1. **Chọn color palette phù hợp** với chủ đề
2. **Sử dụng font pairing** để tạo hierarchy
3. **Cân đối elements**: Không quá đông hoặc quá trống
4. **White space**: Để không gian trống hợp lý
5. **Alignment**: Căn chỉnh elements gọn gàng
6. **Consistency**: Giữ style nhất quán giữa các trang

### **Performance Tips**

1. Giới hạn số lượng elements trên mỗi trang (< 20)
2. Optimize ảnh trước khi upload
3. Sử dụng icons thay vì ảnh khi có thể
4. Save thường xuyên (Ctrl+S)

---

## 💡 Tips & Tricks

1. **Shift + Click**: Select nhiều elements cùng lúc
2. **Grid**: Bật grid để căn chỉnh chính xác
3. **Lock**: Khóa background elements để tránh di chuyển nhầm
4. **Duplicate**: Nhanh chóng tạo elements giống nhau
5. **Layer order**: Sắp xếp layers để elements hiển thị đúng thứ tự
6. **Color picker**: Click vào màu có sẵn thay vì gõ hex code
7. **Simple → Advanced**: Bắt đầu với Simple mode rồi chuyển sang Advanced để tinh chỉnh

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Check console (F12) để xem errors
2. Try refresh page
3. Clear localStorage: `localStorage.clear()`
4. Check QUICKSTART.md và README.md

---

**Enjoy creating beautiful personalized books! 📚✨**
