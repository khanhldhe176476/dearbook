# Debug Guide: 3D Preview Issues

## Những gì đã được fix

### 1. ✅ Error Handling & Error Boundary
- Tạo `Book3DPreviewError` component để catch errors
- Thêm error state và fallback UI trong `Book3DPreview`
- Thêm validation cho book data trong `App.tsx`

### 2. ✅ Debug Logging
Thêm console.log ở nhiều điểm để track flow:
- `App.tsx`: Log khi switch screen, tìm book
- `Book3DPreview`: Log khi mount/unmount
- `Scene`: Log khi render với config
- `MinimalBook`: Log với book data
- `Canvas`: Log onCreated success

### 3. ✅ Improved Loading States
- Cải thiện Suspense fallback với animation
- Loading state với progress indicators
- Error state với actionable buttons

### 4. ✅ Code Improvements
- Removed `frameloop="always"` (có thể gây lỗi)
- Thêm try-catch cho animation frames
- Validate book.pages existence
- Proper cleanup on unmount

## Cách Debug Khi Có Lỗi

### Bước 1: Mở Developer Console
Nhấn `F12` hoặc `Cmd+Option+I` (Mac) để mở console

### Bước 2: Check Logs Theo Thứ Tự

Khi click "Xem 3D", bạn sẽ thấy logs theo thứ tự:

```
📚 Opening 3D Preview from Dashboard
  bookId: "..."
  bookTitle: "..."
  
✅ Rendering 3D preview for book: "..."

🎨 Book3DPreview mounted
  bookId: "..."
  pageCount: X
  
📚 Book3D Data:
  title: "..."
  totalPages: X
  thickness: X
  
✅ 3D Preview ready

🎨 Canvas created successfully

🎬 Scene mounted
  viewMode: "showcase"
  currentPage: 0
  
📖 MinimalBook mounted
  title: "..."
  thickness: X
```

### Bước 3: Xác Định Vấn Đề

#### ❌ Không thấy log "Opening 3D Preview"
**Vấn đề**: Button click handler không hoạt động
**Giải pháp**: Check Dashboard.tsx onPreviewBook prop

#### ❌ Log "No current book for 3D preview"
**Vấn đề**: currentBook là null
**Giải pháp**: Check setCurrentBook được gọi đúng trong App.tsx

#### ❌ Log "Book has no pages"
**Vấn đề**: Book data không có pages array hoặc empty
**Giải pháp**: Check sampleBooks.ts hoặc book creation logic

#### ❌ Không thấy "Canvas created successfully"
**Vấn đề**: Canvas không được mount
**Giải pháp**: 
- Check Three.js có load được không
- Check browser console có lỗi WebGL không
- Try restart dev server

#### ❌ Error: "Multiple instances of Three.js"
**Vấn đề**: Three.js được import nhiều lần
**Giải pháp**: Already fixed với `extend(THREE)` in App.tsx

### Bước 4: Common Errors

#### WebGL Not Supported
```
Error: WebGL not supported
```
**Giải pháp**: Sử dụng browser hiện đại (Chrome, Firefox, Edge)

#### Memory Leak Warning
```
Warning: Can't perform a React state update on an unmounted component
```
**Giải pháp**: Already handled with useEffect cleanup

#### Three.js WEBGL_lose_context Warning
```
THREE.WebGLRenderer: WEBGL_lose_context extension not supported
```
**Giải pháp**: Already suppressed - this is optional and safe to ignore

## Test Checklist

Để verify 3D Preview hoạt động đúng:

### ✅ From Dashboard
1. Click vào button "Xem 3D" trên một book card
2. Kiểm tra console logs
3. Verify loading screen hiển thị
4. Verify 3D book được render
5. Test các controls (rotate, zoom, page navigation)

### ✅ From Editor
1. Trong Book Editor, click "Preview 3D" button
2. Verify cùng flow như trên
3. Click "Quay lại Editor" để back
4. Verify editor state được giữ nguyên

### ✅ Error Scenarios
1. Try với book không có pages (should show error message)
2. Try quick navigation (rapid clicking) - should not crash
3. Try refresh while in 3D view - should redirect properly

## Performance Tips

### Nếu 3D Preview chậm:
1. Reduce `dpr` trong Canvas props từ `[1, 2]` → `[1, 1]`
2. Disable shadows: remove `shadows` prop
3. Reduce auto-rotate speed
4. Lower quality của background images

### Nếu trang bị freeze:
1. Check memory usage trong DevTools
2. Verify không có memory leaks
3. Check animation loops không infinite

## Next Steps If Still Not Working

1. **Clear Browser Cache**
   - Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)

2. **Restart Dev Server**
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```

3. **Check Dependencies**
   ```bash
   npm list three @react-three/fiber @react-three/drei
   ```
   Make sure versions are compatible

4. **Try Simple Test**
   - Import và render `<Simple3DTest />` component
   - Nếu simple cube không render → Three.js setup issue
   - Nếu cube render OK → issue trong BookModel/MinimalBook

## Contact for Help

Nếu vẫn gặp vấn đề sau khi follow guide này:
1. Copy toàn bộ console logs
2. Note lại exact steps để reproduce
3. Attach screenshot of error state
