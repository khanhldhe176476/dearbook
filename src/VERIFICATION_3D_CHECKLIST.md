# ✅ 3D Preview Verification Checklist

## Pre-Test Setup
- [ ] Code đã build không có errors
- [ ] Browser console mở sẵn (F12)
- [ ] Internet connection ổn định

## Test Flow

### 1. Login
- [ ] Mở app → Hiển thị trang Login
- [ ] Nhập email: `test@bookify.com`
- [ ] Nhập password: `123456`
- [ ] Click Login
- [ ] Redirect về Dashboard thành công

### 2. Dashboard
- [ ] Thấy 4 sample books:
  - [ ] "Món Quà Dành Cho Gia Đình" (Gia đình)
  - [ ] "Chuyến Đi Cùng Bạn" (Bạn bè)
  - [ ] "Our Love Story" (Người yêu)
  - [ ] "Ký Ức Tươi Đẹp" (Kỷ niệm)
- [ ] Mỗi book card hiển thị:
  - [ ] Thumbnail (background image)
  - [ ] Theme badge
  - [ ] Created date
  - [ ] Action buttons (Edit, Preview, Copy, Delete)

### 3. Open 3D Preview
- [ ] Click icon "Eye" (Preview) trên book đầu tiên
- [ ] Page load và hiển thị 3D Preview screen
- [ ] Không có errors trong console

### 4. 3D Canvas Check

#### Visual Check:
- [ ] Cuốn sách 3D hiển thị rõ ràng
- [ ] Bìa sách có hình ảnh (không trắng)
- [ ] Gáy sách có text title
- [ ] Lighting trông natural
- [ ] Shadows hiển thị đúng

#### Console Logs:
Check console có các logs sau:
```
- [ ] 📚 Book3D Data: {...}
- [ ] 📖 BookModel mounted with data: {...}
- [ ] 📄 Loading texture for page 1: https://...
- [ ] ✅ Page 1 texture loaded successfully
- [ ] (Repeat cho pages 2, 3, 4)
```

### 5. Interactions

#### Rotation:
- [ ] Drag chuột để xoay sách → works
- [ ] Auto-rotate đang bật (sách tự xoay)
- [ ] Toggle auto-rotate off → sách dừng xoay
- [ ] Toggle auto-rotate on → sách tiếp tục xoay

#### Zoom:
- [ ] Click "Zoom In" → sách phóng to
- [ ] Click "Zoom Out" → sách thu nhỏ
- [ ] Scroll wheel → zoom works
- [ ] Zoom badge hiển thị % đúng

#### View Modes:
- [ ] Click "Showcase" → góc nhìn 3/4
- [ ] Click "Flip" → góc nhìn top-down
- [ ] Click "Read" → góc nhìn front
- [ ] Camera transition mượt mà

### 6. Page Flipping

#### First Page:
- [ ] Current page = "Bìa" (cover)
- [ ] Click "Trang sau" button
- [ ] Animation lật trang mượt mà (2-3 giây)
- [ ] Trang 1 hiển thị với background image
- [ ] Text trên trang 1 hiển thị (nếu có)
- [ ] Current page = "1 / 4"

#### Subsequent Pages:
- [ ] Click "Trang sau" → Trang 2
- [ ] Background image khác với trang 1
- [ ] Click "Trang sau" → Trang 3
- [ ] Click "Trang sau" → Trang 4
- [ ] Button "Trang sau" disabled ở trang cuối

#### Navigate Back:
- [ ] Click "Trang trước" từ trang 4
- [ ] Animation lật ngược
- [ ] Back to trang 3, 2, 1
- [ ] Button "Trang trước" disabled ở bìa

### 7. Progress & Info

#### Left Sidebar:
- [ ] Book title hiển thị đúng
- [ ] "Số trang" = 4
- [ ] "Trang hiện tại" cập nhật khi lật
- [ ] Progress bar cập nhật (0% → 25% → 50% → 75% → 100%)

#### Camera Tools:
- [ ] Zoom slider works
- [ ] Reset View button → về initial position
- [ ] Auto-rotate toggle works

### 8. Other Books

Test với các books khác:
- [ ] "Chuyến Đi Cùng Bạn" (Friends)
  - [ ] Cover image khác
  - [ ] 4 pages với images khác nhau
- [ ] "Our Love Story" (Love)
  - [ ] Theme color khác (pink)
  - [ ] Content khác
- [ ] "Ký Ức Tươi Đẹp" (Memories)
  - [ ] Theme color khác (purple)
  - [ ] Content khác

### 9. Performance Check
- [ ] Page flipping mượt mà (không lag)
- [ ] Texture loading < 3 giây
- [ ] No memory leaks (check Memory tab)
- [ ] FPS ổn định (check Performance)
- [ ] No console errors

### 10. Edge Cases

#### Network:
- [ ] Disable internet → textures fail gracefully
- [ ] Re-enable → textures load lại
- [ ] Slow 3G → loading indicators work

#### Browser:
- [ ] Resize window → canvas resizes properly
- [ ] Zoom browser (Ctrl+/-) → maintains quality
- [ ] Fullscreen (F11) → works

#### Navigation:
- [ ] Click "Quay lại Editor" → back to Editor (if came from editor)
- [ ] Click "Quay lại Editor" → back to Dashboard (if came from dashboard)
- [ ] Click "Đặt hàng ngay" → go to Checkout

## Success Criteria

✅ **PASS if:**
- All visual checks pass
- All console logs present
- All interactions work
- All 4 books display correctly
- No errors in console
- Performance acceptable

❌ **FAIL if:**
- White/blank book
- No textures loading
- Console errors
- Lag/freezing
- Missing pages
- Broken animations

## Known Issues (Document if found)

| Issue | Description | Severity | Workaround |
|-------|-------------|----------|------------|
| | | | |

## Test Results

**Date:** _______________  
**Tester:** _______________  
**Browser:** _______________  
**Result:** ☐ PASS  ☐ FAIL

**Notes:**
```
(Ghi chú thêm nếu có)
```

## Sign-off

- [ ] All critical features working
- [ ] No blocking bugs
- [ ] Performance acceptable
- [ ] Ready for production

**Approved by:** _______________  
**Date:** _______________
