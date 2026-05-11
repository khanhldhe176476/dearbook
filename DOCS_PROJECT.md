# 📚 DearBook - Tài Liệu Dự Án (Project Documentation)

> **DearBook** – Nền tảng thiết kế sách quà tặng cá nhân hóa.  
> **Stack**: React 18 + TypeScript + Vite + Three.js + Radix UI + TailwindCSS  
> **Ngày tạo docs**: 2026-05-11

---

## 📁 Cấu Trúc Thư Mục

```
dearbook/
├── src/
│   ├── App.tsx                    # Root component, routing & state chính
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Global styles (~103KB)
│   ├── components/                # Tất cả components
│   │   ├── ui/                    # 48 UI primitives (Radix-based)
│   │   ├── builder/               # Wizard tạo sách (4 bước)
│   │   ├── editor/                # Editor nâng cao (20 files)
│   │   ├── figma/                 # Assets từ Figma
│   │   └── [73 component files]   # Components chính
│   ├── hooks/                     # 3 custom hooks
│   ├── utils/                     # 3 utility modules
│   ├── types/                     # TypeScript type definitions
│   ├── data/                      # Templates, sample data (8 files)
│   ├── styles/                    # globals.css
│   ├── assets/                    # 5 ảnh PNG từ Figma
│   └── guidelines/                # Guidelines.md
├── package.json
├── vite.config.ts
└── index.html
```

---

## 🏗️ Kiến Trúc Tổng Quan

### Luồng Màn Hình (App Screens)

```
HomePage → LoginScreen → MyBooksLibraryPortfolio → GuidedBookBuilder → OrderFlow
  │                              │                        │
  └─ onGetStarted               │                        ├─ Step1: Chọn chủ đề
                                 ├─ Xem sách mẫu          ├─ Step2: Chọn template  
                                 ├─ FlipBookReader         └─ Step3: Chỉnh sửa trang
                                 ├─ Duplicate/Delete
                                 └─ Edit → Builder
```

### Quản Lý State

- **Routing**: Dùng state `currentScreen` trong `App.tsx` (không dùng React Router)
- **Data Storage**: `localStorage` cho user session và book data
- **Screens**: `'home' | 'login' | 'library' | 'builder' | 'order'`

---

## 📋 Chi Tiết Các Interfaces / Types

### Core Interfaces (App.tsx)

| Interface | Mô tả |
|-----------|--------|
| `User` | `{ email, name, picture? }` |
| `BookData` | Dữ liệu sách: id, theme, templateId, character, cover, pages, status, title |
| `CharacterData` | Nhân vật: skinTone, hairStyle, hairColor, eyeStyle, lipStyle, outfit, accessories |
| `PageData` | Trang sách: id, templatePageId, texts (key-value), images (key-value) |
| `BookPage` | Trang template: id, backgroundColor, backgroundImage, elements[] |
| `PageElement` | Phần tử trang: id, type, content, src, x, y, width, height, font styles... |
| `AppScreen` | `'home' | 'login' | 'library' | 'builder' | 'order'` |

### Editor Types (types/editor.ts)

| Type | Mô tả |
|------|--------|
| `ElementType` | `'text' | 'image' | 'shape' | 'sticker' | 'icon' | 'frame'` |
| `BaseElement` | Thuộc tính chung: id, type, x, y, width, height, rotation, opacity, locked, visible, zIndex |
| `TextElement` | Mở rộng BaseElement: content, fontFamily, fontSize, fontWeight, color, textAlign, lineHeight... |
| `ImageElement` | Mở rộng BaseElement: src, alt, objectFit, filter, borderRadius, border |
| `ShapeElement` | shape, fill, stroke, strokeWidth |
| `StickerElement` | emoji, filter |
| `IconElement` | iconName (Lucide), color, strokeWidth |
| `FrameElement` | frameStyle, color, strokeWidth |
| `EditorPage` | id, elements[], background, width, height |
| `EditorState` | pages, currentPageIndex, selectedElementIds, clipboard, history, zoom, grid settings |
| `EditorAction` | Union type cho tất cả editor actions (ADD, UPDATE, DELETE, SELECT, UNDO, REDO...) |

---

## 🧩 Components Chính

### 1. App.tsx – Root Component
**Functions:**
| Function | Mô tả |
|----------|--------|
| `handleLogin(email, password, name?, picture?)` | Đăng nhập, lưu user vào localStorage, chuyển sang library |
| `handleLogout()` | Xóa session, về login |
| `handleCreateNewBook()` | Reset currentBook, chuyển sang builder |
| `handleEditBook(book)` | Set currentBook, chuyển sang builder |
| `handleSaveBook(book)` | Lưu/cập nhật sách vào localStorage |
| `handleBackToLibrary()` | Reset book, về library |
| `handleProceedToOrder(book)` | Set book, chuyển sang order |
| `handleOrderComplete()` | Reset, về library |

### 2. HomePage.tsx – Trang Chủ
- **BookPhotoCarousel**: Component carousel ảnh tự động xoay vòng
  - `go(next, direction)` – Chuyển ảnh với animation
  - `goNext() / goPrev()` – Chuyển ảnh tiến/lùi
  - `resetTimer()` – Reset bộ đếm auto-play
- Hiển thị sản phẩm (Tier 3, Love book), giá, thông số

### 3. LoginScreen.tsx – Đăng Nhập/Đăng Ký
- Form đăng nhập/đăng ký (toggle)
- **Demo Mode**: Nhập bất kỳ email/password nào để vào
- `handleSubmit()` – Validate và gọi `onLogin`

### 4. MyBooksLibraryPortfolio.tsx – Thư Viện Sách
**Functions:**
| Function | Mô tả |
|----------|--------|
| `loadBooks()` | Load từ localStorage, migrate books thiếu theme |
| `handleDuplicate(book)` | Nhân bản sách, thêm toast + highlight |
| `handleDeleteClick(bookId, title)` | Mở dialog xác nhận xóa |
| `handleDeleteConfirm()` | Xóa sách khỏi localStorage |
| **Filter & Sort** | Lọc theo theme, tìm kiếm, sắp xếp (recent/oldest/name/theme) |
| **ViewMode** | `'grid' | 'masonry' | 'list'` |
| **BookCard** | Sub-component hiển thị thẻ sách với hover actions |

**Tính năng:**
- Hiển thị sách mẫu (templateBooks) để tham khảo
- FlipBookReader modal để xem sách 3D
- DeleteConfirmDialog cho xác nhận xóa
- Thống kê sách theo chủ đề

### 5. GuidedBookBuilder.tsx – Wizard Tạo Sách (3 Bước)
**Functions:**
| Function | Mô tả |
|----------|--------|
| `handleStepComplete(data)` | Cập nhật bookData, auto-save, chuyển bước |
| `handleGoToStep(step)` | Chuyển đến bước cụ thể (chỉ cho phép quay lại) |
| `canGoToStep(step)` | Kiểm tra điều kiện để đi đến bước |
| `handleFinish()` | Hoàn thành sách, chuyển sang order |

**Sub-components (builder/):**
| Component | File | Mô tả |
|-----------|------|--------|
| `Step1ThemeSelection` | Step1ThemeSelection.tsx | Chọn chủ đề: love, family, birthday, friendship |
| `Step2TemplateSelection` | Step2TemplateSelection.tsx | Chọn template thiết kế |
| `Step3CharacterCustomization` | Step3CharacterCustomization.tsx | Tùy chỉnh nhân vật |
| `Step4PageEditorAdvanced` | Step4PageEditorAdvanced.tsx | Editor chỉnh sửa trang nâng cao |
| `Book3DPreviewPanel` | Book3DPreviewPanel.tsx | Panel xem trước 3D (desktop) |

### 6. FlipBookReader.tsx – Đọc Sách Lật Trang (~1825 dòng)
**Đây là component lớn nhất, có nhiều chức năng:**

| Function | Mô tả |
|----------|--------|
| `convertPageToRender(pageData)` | Chuyển PageData thành BookPage với elements |
| `getSpreadPages()` | Lấy cặp trang trái/phải cho spread hiện tại |
| `isBookPageFormat(page)` | Kiểm tra format trang |
| `togglePlay()` | Bật/tắt nhạc nền |
| `toggleMute()` | Bật/tắt tắt tiếng |
| `handleVolumeChange(e)` | Điều chỉnh âm lượng |
| `handleMouseDown/Move/Up` | Xử lý page curl (kéo góc trang để lật) |
| `isNearCorner()` | Kiểm tra chuột gần góc trang |

**Tính năng:**
- Lật trang với hiệu ứng page curl (kéo góc)
- Nhạc nền tự động theo theme (Web Audio API)
- Zoom in/out
- Tạo bìa trước/sau tự động theo theme
- Responsive

### 7. OrderFlow.tsx – Luồng Đặt Hàng
**3 bước:** Giao hàng → Thanh toán → Xác nhận

| Function | Mô tả |
|----------|--------|
| `handleShippingSubmit(e)` | Validate form giao hàng |
| `handlePaymentSubmit()` | Mock xử lý thanh toán |
| `handleComplete()` | Hoàn thành đơn hàng |
| **Tính giá** | basePrice + pagePrice + shippingFee |

### 8. CharacterDesigner.tsx – Thiết Kế Nhân Vật
| Function | Mô tả |
|----------|--------|
| `updateCharacter(updates)` | Cập nhật thuộc tính nhân vật |
| `toggleAccessory(id)` | Toggle phụ kiện (chọn nhiều) |
| `handleApply()` | Áp dụng nhân vật vào sách |

**Tùy chỉnh:** Màu da (6), Kiểu tóc (6), Màu tóc (10), Kiểu mắt (3), Kiểu môi (3), Trang phục (4), Phụ kiện (5)

### 9. Book3DPreview.tsx – Xem Sách 3D
| Function | Mô tả |
|----------|--------|
| `handlePrevPage / handleNextPage` | Chuyển trang |
| `handleReset()` | Reset về trạng thái ban đầu |
| `handleZoomIn / handleZoomOut` | Zoom (100/125/150%) |
| `handleRetry()` | Thử lại khi lỗi |

**View Modes:** Showcase (xoay 360°), Flip (góc trên), Read (nhìn thẳng)
**Dùng:** @react-three/fiber, @react-three/drei, Three.js

### 10. ExportDownloadMenu.tsx – Xuất & Chia Sẻ
| Function | Mô tả |
|----------|--------|
| `handleExportPDF()` | Xuất PDF bằng jsPDF |
| `handleExportImages()` | Xuất từng trang thành PNG |
| `handleShare()` | Copy link chia sẻ |

### 11. Checkout.tsx – Thanh Toán Chi Tiết
| Function | Mô tả |
|----------|--------|
| `handleApplyCoupon()` | Áp mã giảm giá (demo: "bookify10" = -10%) |
| `handleSubmit()` | Validate và hoàn tất |
| **Tùy chọn** | Kích thước (A5/A4), Bìa (mềm/cứng), Gói quà |

---

## 🪝 Custom Hooks

### 1. useAutoSave.ts
```typescript
useAutoSave<T>({ data, onSave, interval?, enabled?, debounceTime? }): {
  saveStatus: 'idle' | 'saving' | 'saved' | 'error',
  lastSavedAt: Date | null,
  forceSave: () => void,
  isSaving: boolean
}
```
- **Auto-save định kỳ** (mặc định 30 giây)
- **Debounce** khi data thay đổi (mặc định 2 giây)
- **So sánh deep** (JSON.stringify) để tránh save dư
- **beforeunload** warning khi có thay đổi chưa lưu

### 2. useUndoRedo.ts
```typescript
useUndoRedo<T>({ initialState, maxHistory?, onStateChange? }): {
  state, setState, undo, redo, canUndo, canRedo,
  clearHistory, historyLength, currentIndex
}
```
- **Lịch sử tối đa** 50 bước (configurable)
- **Keyboard shortcuts**: Ctrl+Z (undo), Ctrl+Shift+Z / Ctrl+Y (redo)
- **Xóa forward history** khi thay đổi mới

### 3. useMediaQuery.ts
```typescript
useMediaQuery(query: string): boolean
useIsMobile(): boolean        // max-width: 768px
useIsTablet(): boolean        // 769px - 1024px
useIsDesktop(): boolean       // min-width: 1025px
useIsTouchDevice(): boolean   // Kiểm tra touch support
```

---

## 🔧 Utilities

### 1. imageHelpers.ts – Xử Lý Ảnh

| Function | Mô tả |
|----------|--------|
| `loadImage(src)` | Load ảnh từ URL hoặc localStorage key |
| `getImageDataURL(src)` | Lấy data URL từ nguồn bất kỳ |
| `imageToDataURL(img, format?, quality?)` | Chuyển HTMLImageElement → data URL |
| `resizeImage(src, maxW, maxH, quality?)` | Resize giữ tỷ lệ |
| `compressImage(src, maxSizeKB?, quality?)` | Nén ảnh tự động giảm quality |
| `getDataURLSizeKB(dataUrl)` | Tính kích thước KB |
| `fileToDataURL(file)` | File → data URL |
| `validateImageFile(file, options?)` | Validate format + size (max 10MB) |
| `createThumbnail(src, size?, quality?)` | Tạo thumbnail |
| `getImageDimensions(src)` | Lấy kích thước ảnh |
| `storeImage(dataUrl)` | Lưu vào localStorage với key unique |
| `removeImage(key)` | Xóa ảnh khỏi localStorage |
| `getAllStoredImages()` | Lấy tất cả ảnh đã lưu |
| `cleanupUnusedImages(usedKeys)` | Dọn ảnh không dùng |
| `getTotalImageSize()` | Tổng dung lượng ảnh (MB) |
| `applyImageFilter(src, filter, amount?)` | Áp filter: grayscale, sepia, brightness, contrast |
| `flipImage(src, direction)` | Lật ảnh ngang/dọc |

### 2. pdfExport.ts – Xuất PDF & Chia Sẻ

| Function | Mô tả |
|----------|--------|
| `exportBookAsPDF(book, pages, options?)` | Xuất sách thành PDF (jsPDF) |
| `exportPageAsImage(page, width?, height?)` | Xuất 1 trang thành ảnh PNG |
| `generateShareableLink(bookId)` | Tạo URL chia sẻ |
| `copyShareableLink(bookId)` | Copy link vào clipboard |
| `downloadBlob(blob, filename)` | Tải file xuống |
| `wrapText(ctx, text, maxWidth)` | Helper ngắt dòng text |

### 3. audioGenerator.ts – Nhạc Nền (Web Audio API)

| Method | Mô tả |
|--------|--------|
| `constructor()` | Khởi tạo AudioContext + GainNode |
| `start(config)` | Phát nhạc theo theme |
| `stop()` | Dừng phát |
| `setVolume(volume)` | Điều chỉnh âm lượng |
| `pause() / resume()` | Tạm dừng / tiếp tục |
| `destroy()` | Giải phóng tài nguyên |

**Theme configs:** love (C4-E4-G4-C5 sine), family (D4-F4-A4-D5), birthday (triangle), friendship (triangle)

---

## 🗃️ Data Files

| File | Mô tả |
|------|--------|
| `templates.ts` | ~81KB – Hệ thống template chính |
| `templateBooks.ts` | ~62KB – Sách mẫu hoàn chỉnh |
| `pageTemplates.ts` | ~18KB – Template trang |
| `romanticLoveTemplate.ts` | ~20KB – Template tình yêu chi tiết |
| `coverTemplates.ts` | ~18KB – Template bìa sách |
| `sampleBooks.ts` | ~22KB – Sách mẫu demo |
| `editorAssets.ts` | ~13KB – Assets cho editor |
| `backgroundMusic.ts` | ~4KB – Config nhạc nền |

---

## 🧱 Editor Components (editor/)

| Component | Mô tả |
|-----------|--------|
| `AdvancedPageEditor` | Editor trang nâng cao |
| `AdvancedPageEditorV2` | Phiên bản cải tiến |
| `ImprovedAdvancedEditor` | Editor tổng hợp cải tiến nhất |
| `EditorCanvas` | Canvas chính để render elements |
| `EditorToolbar` | Thanh công cụ cơ bản |
| `EditorToolbarCompact` | Toolbar thu gọn |
| `ImprovedEditorToolbar` | Toolbar cải tiến |
| `EditorSidebar` | Sidebar trái (layers, assets) |
| `EditorProperties` | Panel thuộc tính phần tử |
| `ImprovedPropertiesPanel` | Panel thuộc tính cải tiến |
| `PropertiesPanelAdvanced` | Panel thuộc tính nâng cao (~30KB) |
| `AssetLibrary` | Thư viện assets (stickers, icons...) |
| `LayerPanel` | Quản lý layers |
| `CoverTemplateSelector` | Chọn template bìa |
| `CoverGuide` | Hướng dẫn thiết kế bìa |
| `ImageUploader` | Upload ảnh |
| `ImageCropModal` | Crop ảnh |
| `RichTextToolbar` | Toolbar rich text |
| `FloatingActionMenu` | Menu nổi |

---

## 🎨 UI Components (ui/) – 48 Radix-based Primitives

accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toggle-group, toggle, tooltip, use-mobile, utils

---

## ⚠️ Vấn Đề Hiện Tại & Điểm Cần Lưu Ý

### 1. 🔴 Không Có Backend
- Toàn bộ data lưu trong `localStorage` → mất khi xóa trình duyệt
- Login chỉ là mock (nhập gì cũng vào được)
- Thanh toán là mock (không xử lý thật)
- Không có database

### 2. 🟡 Code Trùng Lặp
- Nhiều phiên bản editor: `AdvancedPageEditor`, `AdvancedPageEditorV2`, `ImprovedAdvancedEditor`
- Nhiều component 3D: `Book3DPreview`, `Book3DOverviewPreview`, `Book3DViewer`, `InteractiveBook3D`, `InteractiveBook3DWithCurl`
- Nhiều component checkout: `Checkout`, `CheckoutModal`, `OrderFlow`
- Có components không được import: `Dashboard`, `LandingPage`, `DesignFlow`...

### 3. 🟡 Không Có Router
- Routing bằng state trong App.tsx, không dùng React Router
- Không hỗ trợ URL trực tiếp, browser back button

### 4. 🟡 Thiếu Testing
- Không có unit test, integration test
- Chỉ có test HTML thủ công (test-3d.html, test-flipbook.html)

### 5. 🟡 Responsive Chưa Hoàn Thiện
- Một số component 3D chưa responsive tốt trên mobile
- Editor phức tạp khó dùng trên màn nhỏ

---

## 🚀 Gợi Ý Mở Rộng & Hoàn Thiện

### Ưu Tiên Cao (Nên Làm Trước)

#### 1. Thêm Backend & Database
- **Supabase** hoặc **Firebase** cho auth + database + storage
- Chuyển localStorage → cloud storage
- Real authentication (Google OAuth đã có component sẵn)
- Lưu ảnh lên cloud thay vì localStorage (giới hạn ~5MB)

#### 2. Thêm React Router
```
/ → HomePage
/login → LoginScreen
/library → MyBooksLibrary
/builder/:id → GuidedBookBuilder
/order/:id → OrderFlow
/preview/:id → FlipBookReader (public)
```

#### 3. Dọn Dẹp Code Trùng
- Gộp các editor versions → 1 editor chính
- Gộp các 3D preview → 1 component configurable
- Xóa components không dùng

#### 4. Tích Hợp Thanh Toán Thật
- VNPay, MoMo, ZaloPay
- Stripe cho quốc tế

### Ưu Tiên Trung Bình

#### 5. Cải Thiện Editor
- **Drag & drop** elements mượt hơn
- **Multi-select** elements
- **Copy/paste** giữa các trang
- **Templates marketplace** – cho phép user chia sẻ template
- **AI text suggestions** – gợi ý nội dung theo theme

#### 6. Tối Ưu Performance
- **Image lazy loading** cho thư viện sách
- **Virtual scrolling** cho danh sách sách lớn
- **Code splitting** cho 3D components (đã có lazy load nhưng cần tối ưu)
- **Service Worker** cho offline support

#### 7. Collaboration Features
- Chia sẻ sách để cùng chỉnh sửa (real-time)
- Comment trên từng trang
- Version history

#### 8. Export Nâng Cao
- Xuất file print-ready (CMYK, bleed marks)
- Tích hợp nhà in (API đặt in)
- Xuất video flipbook (WebM/MP4)

### Ưu Tiên Thấp (Nice to Have)

#### 9. AI Features
- AI generate nội dung sách từ prompt
- AI gợi ý layout
- AI enhance ảnh (upscale, remove background)
- AI tạo illustration cho nhân vật

#### 10. Social Features
- Gallery công khai sách đã tạo
- Like, share, comment
- Follow creators
- Affiliate program

#### 11. Mobile App
- React Native hoặc PWA
- Camera integration (chụp ảnh trực tiếp)
- Push notifications (đơn hàng)

#### 12. Analytics & Admin
- Dashboard admin quản lý đơn hàng
- Thống kê user, sách, doanh thu
- Content moderation

---

## 📊 Thống Kê Dự Án

| Metric | Giá trị |
|--------|---------|
| Tổng components | ~100+ files |
| UI primitives | 48 (Radix-based) |
| Custom hooks | 3 |
| Utility modules | 3 |
| Data/template files | 8 |
| Tổng dung lượng src/ | ~1.5MB+ |
| Dependencies | 30+ packages |
| Themes | 4 (love, family, birthday, friendship) |

---

## 🔑 Các Biến Quan Trọng

| Key | Vị trí | Mô tả |
|-----|--------|--------|
| `dearbook_user` | localStorage | JSON user data |
| `dearbook_books` | localStorage | JSON array sách |
| `dearbook_image_*` | localStorage | Ảnh dạng data URL |

---

*Tài liệu này được tạo tự động dựa trên phân tích mã nguồn. Cập nhật khi có thay đổi lớn.*
