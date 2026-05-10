# 🚀 Quick Start - New Features

## 5 phút để làm quen với tất cả tính năng mới!

---

## ⚡ Setup (1 phút)

### 1. Cài đặt dependencies
```bash
npm install jspdf date-fns sonner
```

### 2. Khởi động app
```bash
npm run dev
```

### 3. Mở browser
```
http://localhost:5173
```

✅ Done! Bây giờ hãy thử tất cả tính năng mới.

---

## 🎯 Thử 6 Tính Năng Mới (4 phút)

### 1️⃣ Undo/Redo (30 giây)

1. **Login** vào DearBook
2. **Tạo sách mới** hoặc mở sách có sẵn
3. **Vào editor** (chế độ nâng cao)
4. **Thêm text** và chỉnh sửa
5. **Nhấn Ctrl+Z** → Text biến mất (undo)
6. **Nhấn Ctrl+Y** → Text xuất hiện lại (redo)

✅ **Pass**: Text undo/redo thành công!

---

### 2️⃣ Auto-Save (30 giây)

1. Trong editor, **chỉnh sửa text**
2. **Ngừng 2 giây** và quan sát góc trên
3. Thấy "**Đang lưu...**" → "**Đã lưu**"
4. **Đợi 30 giây** không chỉnh sửa
5. Thấy "**Đang lưu...**" lại (auto-save)

✅ **Pass**: Auto-save hoạt động!

---

### 3️⃣ Rich Text (1 phút)

1. **Click vào text element** trong editor
2. **Toolbar xuất hiện** phía trên
3. Thử:
   - **Font**: Chọn "Dancing Script"
   - **Size**: Chọn 32px
   - **Bold**: Click B button
   - **Color**: Click color picker, chọn màu
   - **Align**: Click align center

✅ **Pass**: Text thay đổi theo format!

---

### 4️⃣ Image Upload (1 phút)

1. **Click "Thêm ảnh"** trong toolbar
2. **Kéo thả** ảnh vào vùng upload
   - Hoặc **click để browse** file
3. **Crop modal** xuất hiện:
   - **Kéo** để di chuyển crop area
   - **Zoom** in/out với buttons
   - **Rotate** 90° nếu cần
4. **Click "Hoàn thành"**
5. **Ảnh xuất hiện** trên canvas

✅ **Pass**: Upload & crop thành công!

---

### 5️⃣ Export (1 phút)

1. **Click "Xuất"** button
2. **Export menu** xuất hiện
3. **Thử PDF**:
   - Click "Tải xuống PDF"
   - Đợi progress bar
   - PDF tự động download
4. **Mở PDF** xem kết quả

✅ **Pass**: PDF export thành công!

---

### 6️⃣ Mobile (30 giây)

1. **Mở DevTools** (F12)
2. **Toggle device toolbar** (Ctrl+Shift+M)
3. **Chọn iPhone** hoặc Android
4. **Refresh** page
5. Quan sát:
   - Layout responsive
   - FAB button góc phải
   - Touch-friendly UI

✅ **Pass**: Mobile responsive hoạt động!

---

## 🎓 Thử Thêm (Optional)

### Keyboard Shortcuts

**Trong Editor:**
```
Ctrl+Z      - Undo
Ctrl+Y      - Redo
Ctrl+S      - Force save
Ctrl+D      - Duplicate
Delete      - Delete element
```

**Text Formatting:**
```
Ctrl+B      - Bold
Ctrl+I      - Italic  
Ctrl+U      - Underline
```

---

### Export Options

**Thử tất cả 3 cách export:**

1. **PDF**
   ```
   Click "Xuất" → "Tải xuống PDF"
   → Mở file xem quality
   ```

2. **Images**
   ```
   Click "Xuất" → "Tải xuống ảnh"  
   → Kiểm tra từng file PNG
   ```

3. **Share Link**
   ```
   Click "Xuất" → "Chia sẻ link"
   → Copy link và share
   ```

---

### Mobile Testing

**Thử trên thiết bị thật:**

1. **Get local IP:**
   ```bash
   ipconfig (Windows)
   ifconfig (Mac/Linux)
   ```

2. **Access from phone:**
   ```
   http://[YOUR-IP]:5173
   ```

3. **Test touch:**
   - Drag elements
   - Pinch zoom  
   - Swipe pages
   - Tap buttons

---

## 📝 Checklist Nhanh

Copy checklist này để test:

```
✅ Features Working:
[ ] Undo/Redo (Ctrl+Z/Y)
[ ] Auto-save (every 30s)
[ ] Save indicator visible
[ ] Rich text toolbar appears
[ ] Font family change works
[ ] Font size change works
[ ] Bold/Italic/Underline work
[ ] Text alignment works
[ ] Color picker works
[ ] Image upload drag&drop
[ ] Image upload click-to-browse
[ ] Image crop modal
[ ] Crop/rotate/zoom work
[ ] Export PDF downloads
[ ] PDF quality good
[ ] Export images downloads
[ ] Share link copies
[ ] Mobile responsive layout
[ ] Mobile FAB toolbar
[ ] Touch gestures work

✅ Performance:
[ ] Page flips smooth (500ms)
[ ] No lag during typing
[ ] Auto-save doesn't block UI
[ ] Export completes quickly
[ ] Mobile feels responsive

✅ UX:
[ ] Save status clear
[ ] Toasts show for actions
[ ] Loading states visible
[ ] Error messages helpful
[ ] Keyboard shortcuts work
```

---

## 🆘 Troubleshooting

### Issue: Undo/Redo không hoạt động
**Fix:**
- Kiểm tra đã import `useUndoRedo` hook
- Kiểm tra keyboard focus trong editor
- Thử click vào canvas trước khi nhấn Ctrl+Z

### Issue: Auto-save không chạy
**Fix:**
- Kiểm tra `useAutoSave` hook được mount
- Kiểm tra console có errors
- Verify interval = 30000 (30s)

### Issue: Image upload không hoạt động
**Fix:**
- Kiểm tra file format (PNG/JPG/WEBP/GIF)
- Kiểm tra size < 10MB
- Clear localStorage nếu đầy

### Issue: Export PDF lỗi
**Fix:**
- Kiểm tra `jspdf` đã cài
- Kiểm tra có internet (để load fonts)
- Thử export ít pages hơn

### Issue: Mobile không responsive
**Fix:**
- Clear cache và reload
- Kiểm tra viewport meta tag
- Test trên browser mobile devtools trước

---

## 💡 Pro Tips

### 1. Tăng tốc workflow
```
- Dùng Ctrl+D để duplicate nhanh
- Dùng Ctrl+S thường xuyên
- Dùng grid để align chính xác
- Zoom in để edit chi tiết
```

### 2. Tối ưu quality
```
- Dùng ảnh HD (>1000px)
- Export PDF cho in ấn
- Export PNG cho digital
- Test preview trước khi export
```

### 3. Mobile workflow
```
- Thiết kế trên desktop
- Preview trên mobile
- Test touch gestures
- Verify layout responsive
```

### 4. Debugging
```
- Mở console (F12)
- Check errors màu đỏ
- Test trên incognito
- Clear cache nếu cần
```

---

## 🎉 Done!

**Congratulations!** Bạn đã làm quen với tất cả 6 tính năng mới.

### Next Steps:

1. **Thử thiết kế sách thật**
2. **Test tất cả features**
3. **Report bugs** (nếu có)
4. **Share feedback**
5. **Enjoy DearBook!** 🎨

---

## 📚 Tài Liệu Đầy Đủ

**Muốn tìm hiểu sâu hơn?**

- 📖 [Enhanced Features Guide](./ENHANCED_FEATURES_GUIDE.md) - Chi tiết technical
- 📱 [Tính Năng Mới 2026](./TINH_NANG_MOI_2026.md) - Hướng dẫn user
- ✅ [Verification Checklist](./FEATURE_VERIFICATION_CHECKLIST.md) - Testing full
- 📊 [Update Summary](./UPDATE_SUMMARY_2026.md) - Tổng quan update

---

## 🙋 Need Help?

**Stuck? Have questions?**

- 📧 Email: support@dearbook.com
- 💬 Chat: Live chat on website  
- 📖 Docs: Read full guides above
- 🐛 Bugs: Report via GitHub

---

**Happy Creating! ✨**

Made with ❤️ by DearBook Team
