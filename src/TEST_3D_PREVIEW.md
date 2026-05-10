# Testing 3D Preview với Sample Books

## Các thay đổi đã thực hiện

### 1. Tạo Sample Books với đầy đủ nội dung
- File: `/data/sampleBooks.ts`
- 4 cuốn sách mẫu: Family, Friends, Love, Memories
- Mỗi cuốn có 4 pages với:
  - backgroundImage từ Unsplash
  - Text elements với styling
  - Sticker elements

### 2. Cập nhật BookModel.tsx
- Thêm texture loading cho từng page
- Render backgroundImage lên material-4 (front face)
- Chỉ hiển thị text nếu không có texture
- Thêm console logs để debug

### 3. Cập nhật App.tsx
- Auto-load sampleBooks nếu localStorage trống
- Import từ `/data/sampleBooks.ts`

### 4. Cập nhật Book3DPreview.tsx
- Cải thiện thickness calculation
- Thêm console logs để debug bookData
- Map backgroundImage từ page.backgroundImage

## Cách test

### Bước 1: Login
1. Mở app → sẽ hiển thị trang Login
2. Nhập email/password bất kỳ và login
3. Sẽ redirect về Dashboard

### Bước 2: Xem Sample Books
1. Trong Dashboard, bạn sẽ thấy 4 cuốn sách mẫu:
   - 📚 Món Quà Dành Cho Gia Đình (Family)
   - 🎉 Chuyến Đi Cùng Bạn (Friends)
   - 💕 Our Love Story (Love)
   - 📸 Ký Ức Tươi Đẹp (Memories)

### Bước 3: Xem 3D Preview
1. Click vào icon "Eye" (Preview) trên bất kỳ cuốn sách nào
2. Sẽ mở trang 3D Preview
3. Kiểm tra:
   - ✅ Cuốn sách 3D hiển thị với bìa có hình ảnh
   - ✅ Click "Trang sau" để lật trang
   - ✅ Mỗi trang có backgroundImage riêng
   - ✅ Text hiển thị trên các trang không có ảnh
   - ✅ Auto-rotate hoạt động (nếu bật)
   - ✅ Có thể drag để xoay sách
   - ✅ Zoom in/out hoạt động

### Bước 4: Kiểm tra Console Logs
Mở Developer Console (F12) để xem các logs:

```
📚 Book3D Data: {
  title: "...",
  totalPages: 4,
  thickness: 0.032,
  pagesWithImages: 3,
  coverImage: "Yes"
}

📖 BookModel mounted with data: {
  title: "...",
  pagesCount: 4,
  thickness: 0.032,
  currentPage: 0
}

📄 Loading texture for page 1: https://images.unsplash.com/...
✅ Page 1 texture loaded successfully
📄 Loading texture for page 2: https://images.unsplash.com/...
✅ Page 2 texture loaded successfully
...
```

## Expected Results

### ✅ Success Criteria
1. Cuốn sách 3D render thành công với bìa và gáy
2. Mỗi trang hiển thị hình ảnh background (nếu có)
3. Animation lật trang mượt mà
4. Lighting và shadows hiển thị đúng
5. Có thể interact: drag, zoom, lật trang

### ❌ Known Issues (nếu có)
- Texture loading có thể mất vài giây với connection chậm
- Một số trang có thể không có image (sẽ hiển thị màu nền và text)

## Cấu trúc dữ liệu

### BookData Interface
```typescript
interface BookData {
  title: string;
  coverFront: string;        // URL hoặc ''
  coverBack: string;         // color hex
  spineText: string;
  pages: Array<{
    id: string;
    imageUrl: string;        // URL hoặc ''
    text: string;            // text content
    pageNumber: number;
  }>;
  thickness: number;         // 0.05 - 0.15
}
```

### Sample Book Example
```typescript
{
  id: 'sample-family-1',
  title: 'Món Quà Dành Cho Gia Đình',
  theme: 'family',
  pageCount: 4,
  coverPage: {
    backgroundImage: 'https://images.unsplash.com/...',
    elements: [...]
  },
  pages: [
    {
      id: 'page-1',
      backgroundImage: 'https://images.unsplash.com/...',
      elements: [text, sticker, ...]
    },
    ...
  ]
}
```

## Troubleshooting

### Sách không hiển thị
- Check console logs xem có error không
- Verify bookData trong console
- Check network tab xem images có load không

### Textures không hiển thị
- Check CORS headers của Unsplash
- Verify imageUrl có đúng format không
- Check texture loading logs

### Performance issues
- Giảm số lượng pages
- Optimize image sizes
- Disable shadows nếu cần

## Next Steps

Sau khi verify 3D preview hoạt động:
1. ✅ Tạo thêm sample books với nhiều pages hơn
2. ✅ Thêm loading states cho textures
3. ✅ Optimize texture caching
4. ✅ Cải thiện lighting và materials
5. ✅ Thêm page turning sound effects (optional)
