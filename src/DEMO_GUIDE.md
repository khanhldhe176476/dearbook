# 🚀 Demo & Testing Guide - Bookify

## ✅ Checklist Kiểm Tra Tính Năng

### 1. Authentication Flow ✓
- [x] Landing Page hiển thị đẹp
- [x] Button "Đăng nhập" chuyển đến Login page
- [x] Login page standalone (không có header navigation)
- [x] Đăng nhập thành công → Dashboard
- [x] Đăng xuất → Landing Page

### 2. Dashboard ✓
- [x] Empty state khi chưa có sách
- [x] Nút "Tạo sách đầu tiên" / "Tạo sách mới"
- [x] Search bar tìm kiếm sách
- [x] Hiển thị danh sách sách dạng grid
- [x] Thống kê: Tổng số sách, tổng số trang, số chủ đề
- [x] Actions: Chỉnh sửa, Xem 3D, Sao chép, Xóa

### 3. Create Wizard (4 Steps) ✓

#### Step 1: Chọn Chủ Đề
- [x] 4 chủ đề: Gia đình, Bạn bè, Người yêu, Kỷ niệm
- [x] Mỗi chủ đề có icon, mô tả, và ví dụ nội dung
- [x] Hover effect & click để chọn

#### Step 2: Chọn Template
- [x] Hiển thị 6 templates cho chủ đề đã chọn
- [x] Mỗi template có thumbnail preview
- [x] Badge: Bán chạy / Mới / Phổ biến
- [x] Checkmark khi đã chọn
- [x] Nút "Quay lại" và "Tiếp tục"

#### Step 3: Chọn Số Trang
- [x] Quick select: 10, 20, 30, 40 trang
- [x] Custom input: 10-100 trang
- [x] Giá ước tính: số trang × 5,000đ
- [x] Nút "Quay lại" và "Tiếp tục"

#### Step 4: Xác Nhận
- [x] Input tên sách
- [x] Tóm tắt: Chủ đề, Template, Số trang, Giá
- [x] Preview thumbnail bìa
- [x] Nút "Quay lại" và "Tạo sách ngay"

### 4. Book Editor (3-Column Layout) ✓

#### Cột Trái: Pages Sidebar
- [x] Thumbnail bìa sách (Cover)
- [x] Thumbnails các trang nội dung
- [x] Nút "+" thêm trang mới
- [x] Hover actions: Sao chép, Xóa trang
- [x] Highlight trang đang chọn

#### Cột Giữa: Canvas
**Top Bar:**
- [x] Input tên sách (editable)
- [x] Undo / Redo buttons
- [x] Lưu button
- [x] Xem trước 3D button
- [x] Đặt hàng button

**Toolbar:**
- [x] Thêm Text
- [x] Upload Ảnh
- [x] Thêm Sticker/Icon
- [x] Đổi màu nền (color picker)
- [x] Font size dropdown (khi chọn text)
- [x] Bold / Italic buttons (khi chọn text)
- [x] Text color picker (khi chọn text)

**Canvas Area:**
- [x] Background color/image
- [x] Elements có thể click để chọn
- [x] Drag & drop để di chuyển
- [x] Resize handle (góc phải dưới)
- [x] Ring highlight khi chọn
- [x] Quick actions toolbar (Move up/down, Copy, Delete)
- [x] Text elements: contentEditable (click 2 lần để edit)
- [x] Image elements: hiển thị ảnh
- [x] Sticker elements: hiển thị emoji

#### Cột Phải: Properties Panel
**Khi có element được chọn:**
- [x] Vị trí (X, Y)
- [x] Kích thước (Width, Height)

**Text Properties:**
- [x] Font family dropdown (5 fonts)
- [x] Font size slider (12-72px)
- [x] Text color picker
- [x] Text align buttons (Left, Center, Right)

**Image Properties:**
- [x] Replace image button

**Sticker Properties:**
- [x] Input để nhập emoji
- [x] Grid picker với 12 emojis phổ biến

**Layer Actions:**
- [x] Move up button
- [x] Move down button

**Khi chưa chọn element:**
- [x] Empty state: "Chọn một phần tử để chỉnh sửa"

### 5. Book 3D Preview ✓
- [x] Lazy loading (chỉ load Three.js khi cần)
- [x] Loading screen với animation
- [x] 3D book model với bìa trước, sau, gáy
- [x] Drag to rotate
- [x] Scroll to zoom
- [x] Nút lật trang (Previous, Next)
- [x] Auto-flip animation
- [x] Hiển thị số trang hiện tại
- [x] Nút "Quay lại Editor"
- [x] Nút "Đặt hàng ngay"
- [x] Cleanup khi unmount (tránh multiple Three.js instances)

### 6. Checkout ✓
- [x] Form nhập thông tin khách hàng
- [x] Chọn phương thức thanh toán
- [x] Tóm tắt đơn hàng
- [x] Nút "Quay lại" và "Thanh toán"

### 7. Payment Success ✓
- [x] Success animation/message
- [x] Tóm tắt đơn hàng
- [x] Nút "Về Dashboard"

### 8. Data Persistence ✓
- [x] User data lưu trong localStorage
- [x] Books data lưu trong localStorage
- [x] Auto-restore khi refresh page
- [x] Auto-save trong Editor (mỗi 30s)

---

## 🎯 Test Scenarios

### Scenario 1: First Time User
1. Load trang → Landing Page
2. Click "Đăng nhập"
3. Đăng nhập (hoặc đăng ký)
4. → Dashboard (empty state)
5. Click "Tạo sách đầu tiên"
6. Chọn chủ đề "Gia đình"
7. Chọn template "Lời cảm ơn gia đình"
8. Chọn 20 trang
9. Đặt tên "Tặng Ba Mẹ"
10. → Editor
11. Thử drag text, resize, change color
12. Thêm ảnh, sticker
13. Thêm trang mới
14. Click "Xem trước 3D"
15. → 3D Preview
16. Xoay sách, lật trang
17. Click "Đặt hàng ngay"
18. → Checkout
19. Nhập thông tin
20. Thanh toán
21. → Payment Success
22. Click "Về Dashboard"
23. → Dashboard (có 1 sách)

### Scenario 2: Returning User
1. Refresh page → Auto login
2. → Dashboard (hiển thị sách đã tạo)
3. Search sách
4. Click "Chỉnh sửa" trên 1 sách
5. → Editor với dữ liệu đã lưu
6. Edit nội dung
7. Lưu
8. Quay lại Dashboard
9. Tạo sách mới (chủ đề khác)
10. Duplicate sách
11. Delete sách
12. Đăng xuất

### Scenario 3: Editor Deep Dive
1. Vào Editor
2. Test mọi loại element:
   - Text: Add, edit, resize, move, change font/color/size/align
   - Image: Add, replace, resize, move
   - Sticker: Add, change emoji, resize, move
3. Test layer management:
   - Move element up/down
   - Duplicate element
   - Delete element
4. Test page management:
   - Add page
   - Duplicate page
   - Delete page (không được xóa nếu chỉ còn 1 trang)
5. Test undo/redo
6. Test background color
7. Chuyển giữa các trang
8. Auto-save (đợi 30s)

### Scenario 4: 3D Preview
1. Vào 3D Preview
2. Drag chuột → Xoay sách
3. Scroll → Zoom in/out
4. Click "Trang sau" nhiều lần
5. Click "Trang trước"
6. Để auto-flip chạy
7. Click "Quay lại Editor"
8. Quay lại 3D (không có multiple Three.js warning)

---

## 📊 Data Structure

### User Object
```json
{
  "id": "1234567890",
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "avatar": "https://i.pravatar.cc/150?u=user@example.com"
}
```

### BookProject Object
```json
{
  "id": "1234567890",
  "title": "Tặng Ba Mẹ",
  "theme": "family",
  "templateId": "family-1",
  "pageCount": 20,
  "coverPage": { BookPage },
  "pages": [ BookPage, BookPage, ... ],
  "createdAt": "2026-01-22T...",
  "updatedAt": "2026-01-22T..."
}
```

### BookPage Object
```json
{
  "id": "page-1",
  "backgroundColor": "#fff8f0",
  "backgroundImage": "https://...",
  "elements": [ BookElement, BookElement, ... ]
}
```

### BookElement Object
```json
{
  "id": "element-1",
  "type": "text | image | sticker",
  "content": "Nội dung text / URL ảnh / Emoji",
  "x": 100,
  "y": 100,
  "width": 300,
  "height": 50,
  "fontSize": 18,
  "fontFamily": "Poppins",
  "color": "#000000",
  "fontWeight": "normal | bold",
  "fontStyle": "normal | italic",
  "textAlign": "left | center | right"
}
```

---

## 🎨 Templates Available

### Gia Đình (6 templates)
1. Lời cảm ơn gia đình ⭐ Bestseller
2. Bữa cơm gia đình
3. Mẹ và con 🆕 New
4. Kỳ nghỉ gia đình
5. Ông bà và cháu
6. Tuổi thơ hồng

### Bạn Bè (6 templates)
1. Chuyến đi cùng bạn
2. Cười cùng bạn ⭐ Bestseller
3. Tình bạn mãi mãi 🆕 New
4. Du lịch cùng hội
5. Sinh nhật bạn thân
6. Những ngày học

### Người Yêu (6 templates)
1. Câu chuyện tình yêu ⭐ Bestseller
2. Đám cưới ngọt ngào
3. Hẹn hò lãng mạn 🆕 New
4. Hoàng hôn bên nhau
5. Thư tình
6. Kỷ niệm 1 năm

### Kỷ Niệm (6 templates)
1. Kỷ niệm đáng nhớ ⭐ Bestseller
2. Album ảnh cũ
3. Cuốn nhật ký
4. Timeline cuộc đời
5. Những chuyến đi
6. Năm tháng đẹp

**Tổng cộng: 24 templates**

---

## 🐛 Known Issues & Fixes

### ✅ FIXED: Multiple Three.js Instances
- **Issue**: Warning "Multiple instances of Three.js being imported"
- **Fix**: Lazy loading Book3DPreview component
- **Result**: Chỉ load Three.js khi user vào 3D Preview

### ✅ FIXED: Layout Separation
- **Issue**: Login page có header navigation
- **Fix**: Tạo 2 layouts riêng (AuthLayout vs AppLayout)
- **Result**: Login page standalone 100%

---

## 💡 Quick Tips

### Testing trong Dev Mode:
1. **Xóa localStorage** để test first-time user:
   ```js
   localStorage.clear()
   ```

2. **Mock user** để test nhanh:
   ```js
   localStorage.setItem('bookify_user', JSON.stringify({
     id: '123',
     name: 'Test User',
     email: 'test@test.com',
     avatar: 'https://i.pravatar.cc/150'
   }))
   ```

3. **Test auto-save**: Đợi 30s hoặc sửa code giảm thời gian

---

## 🎉 Summary

### ✅ Đã Hoàn Thành:
- [x] Full authentication flow
- [x] Dashboard với CRUD operations
- [x] 4-step Wizard với 24 templates
- [x] Full-featured Editor (3-column layout)
- [x] 3D Preview với Three.js
- [x] Checkout & Payment flow
- [x] Data persistence
- [x] Responsive design
- [x] Premium UI/UX với pastel colors

### 🎨 Design System:
- Colors: Pink, Purple, Blue pastels
- Fonts: Poppins (primary), Playfair Display, Dancing Script
- Components: Cards, buttons, inputs với border-radius mềm
- Spacing: Generous white space
- Animations: Smooth transitions

### 🚀 Ready to Use!
Hệ thống đã sẵn sàng cho user test và sử dụng!
