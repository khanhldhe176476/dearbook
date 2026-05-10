# 📚 Bookify - Product Page & Design Flow

## 🎯 Tổng quan

Website cho phép người dùng tự thiết kế và đặt mua sách quà tặng cá nhân hóa với quy trình đơn giản, trực quan.

---

## ✨ Tính năng chính

### 1️⃣ **Product Page (Trang sản phẩm)**
- ✅ Hiển thị mockup sách với gallery 5 ảnh
- ✅ Thông tin sản phẩm chi tiết (giá, kích thước, số trang, thời gian)
- ✅ CTA button "BẮT ĐẦU THIẾT KẾ" nổi bật
- ✅ Trust badges (1000+ khách hàng, 4.9/5 rating, 100% handmade)
- ✅ 3 feature cards (Thiết kế độc đáo, Chất lượng cao, Quà tặng ý nghĩa)
- ✅ Ghi chú cho phép trải nghiệm trước khi đặt hàng

### 2️⃣ **Design Flow (Luồng thiết kế 4 bước)**

#### **Bước 1: Chọn chủ đề sách**
- 4 chủ đề: Tình Yêu 💕 | Gia Đình 👨‍👩‍👧 | Sinh Nhật 🎂 | Tình Bạn 🤝
- Mỗi chủ đề có icon, màu sắc và mô tả riêng
- Hover effect với scale & shadow
- Grid layout responsive

#### **Bước 2: Tạo nhân vật (Character Creator)**

**Left Panel - Preview:**
- Preview lớn với decorative sparkles
- Character illustration display
- Real-time info overlay (giới tính, kiểu tóc, màu tóc)
- Gradient background pastel

**Right Panel - Options:**
- ✅ **Giới tính**: Nam 👨 / Nữ 👩 (2 options)
- ✅ **Kiểu tóc**: Ngắn 💇‍♀️ / Dài 👱‍♀️ (2 options)
- ✅ **Màu tóc**: Đen / Nâu / Đỏ / Vàng / Xám (5 options với color swatches)
- ✅ **Màu da**: Sáng / Vừa / Rám / Tối (4 options với color swatches)
- ✅ **Trang phục**: Thoải mái 👕 / Lịch sự 👔 / Lãng mạn 👗 (3 options)

**UX Logic:**
- Click để chọn → border highlight + shadow
- Selected state với checkmark icon
- Button "Tiếp tục" để sang bước 3

#### **Bước 3: Xem trước sách (Book Preview)**

**Open Book Display:**
- Grid 2 columns (left page + right page)
- Left page: Character scene với ảnh minh họa
- Right page: Quote lớn + Character info card
- Book spine shadow ở giữa
- Decorative stars background (opacity 10%)

**Additional Preview:**
- Thumbnail grid 4 pages nhỏ (hover scale effect)
- Info box khuyến khích chỉnh sửa thoải mái

**Action:**
- Button "Đặt hàng ngay" → sang bước 4

#### **Bước 4: Checkout (Xác nhận đặt hàng)**

**Left - Order Form (2 columns):**

1. **Thông tin sách:**
   - Book thumbnail + title
   - Theme, số trang, kích thước
   - Character summary card (với avatar + details)
   - Button "Chỉnh sửa" quay lại bước 2

2. **Thông tin giao hàng:**
   - Họ tên
   - Số điện thoại
   - Địa chỉ (textarea)
   - Ghi chú (optional)

3. **Phương thức thanh toán:**
   - Radio buttons: Chuyển khoản / COD
   - Mô tả ngắn mỗi option

**Right - Order Summary (Sticky sidebar):**
- Giá sách: 570,000₫
- Phí vận chuyển: Miễn phí
- Tổng cộng: 570,000₫
- Button "Đặt hàng ngay" (primary CTA)
- 3 benefits với checkmark icons

**Success State:**
- Animated success screen
- Green checkmark icon (w-24 h-24)
- Confirmation message
- Auto redirect sau 3s

---

## 🎨 Design System

### **Color Palette:**
```
Pink:    #FFD6E7 → #FF6B9D (love theme)
Blue:    #D4F1F4 → #1C8794 (family theme)
Yellow:  #FFF4E6 → #FFB84D (birthday theme)
Green:   #C6F6D5 → #059669 (friendship theme)
Purple:  #E9D5FF → #9333EA (accent)
```

### **Typography:**
```
Serif (Headings):    Playfair Display
Sans-serif (Body):   Poppins
Secondary:           Inter
Handwriting:         Dancing Script
```

### **Border Radius:**
```
Small:  0.5rem (rounded-lg)
Medium: 1rem (rounded-xl)
Large:  1.5rem (rounded-2xl)
XLarge: 2rem (rounded-3xl)
Full:   9999px (rounded-full)
```

### **Shadows:**
```
md:  shadow-md
lg:  shadow-lg
xl:  shadow-xl
2xl: shadow-2xl
```

---

## 📂 Cấu trúc Components

```
/App.tsx
  - Main container
  - State management
  - View routing (product | design)

/components/
  ├── ProductPage.tsx
  │   - Hero section với gallery
  │   - Product info
  │   - Features
  │
  ├── DesignFlow.tsx
  │   - Progress bar (4 steps)
  │   - Step routing
  │   - Back button logic
  │
  ├── Step1ThemeSelector.tsx
  │   - Theme grid (2x2)
  │   - Hover effects
  │   - Theme data
  │
  ├── Step2CharacterCreator.tsx
  │   - Preview panel (left)
  │   - Options panel (right)
  │   - Character state management
  │
  ├── Step3BookPreview.tsx
  │   - Open book display
  │   - Page thumbnails
  │   - Theme content
  │
  └── Step4Checkout.tsx
      - Form inputs
      - Order summary
      - Success modal
```

---

## 🔄 User Flow

```
1. User lands on ProductPage
   ↓
2. Clicks "BẮT ĐẦU THIẾT KẾ"
   ↓
3. Chọn theme (Love/Family/Birthday/Friendship)
   ↓ (Progress: 1/4)
4. Tạo nhân vật:
   - Gender → Hair style → Hair color → Skin tone → Outfit
   ↓ (Progress: 2/4)
5. Xem preview sách với nhân vật
   ↓ (Progress: 3/4)
6. Điền form checkout + Chọn payment
   ↓ (Progress: 4/4)
7. Click "Đặt hàng ngay"
   ↓
8. Success screen → Auto complete
```

---

## 💾 Data Structure

```typescript
interface CharacterDesign {
  gender: 'male' | 'female';
  hairStyle: 'short' | 'long';
  hairColor: 'black' | 'brown' | 'red' | 'blonde' | 'gray';
  skinTone: 'light' | 'medium' | 'tan' | 'dark';
  outfit: 'casual' | 'formal' | 'romantic';
}

interface BookOrder {
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  character: CharacterDesign;
  bookTitle: string;
  pages: number;
  price: number;
}
```

---

## 🎯 UX Logic

### **Navigation:**
✅ Có thể quay lại bất kỳ bước nào  
✅ Progress bar hiển thị vị trí hiện tại  
✅ Back button ở mỗi step  
✅ Button "Trở lại trang sản phẩm" ở step 1  

### **Validation:**
✅ Phải chọn theme mới sang bước 2  
✅ Phải chọn đủ character options (default đã có)  
✅ Preview luôn reflect dữ liệu user đã chọn  

### **Responsive:**
✅ Grid → Stack trên mobile  
✅ Sidebar sticky trên desktop  
✅ Touch-friendly buttons (min height)  

---

## 📸 Assets Sử dụng

### **Figma Assets (Provided):**
```
figma:asset/e3dc89887407aae40ed4987d3011cdc80ce07e59.png (Book page 1)
figma:asset/75f25ac90081e751c1ea46d382338eda718c305b.png (Product mockup)
figma:asset/109af72571f832d0b2cbf0614e675b734602f9d1.png (Product page)
figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png (Character)
figma:asset/6251f78ccca4af275f512353d2f3b01052f7f0e0.png (Book preview)
```

### **Unsplash (Supplementary):**
- Theme thumbnails
- Background images

---

## ✨ Animations & Transitions

### **Hover Effects:**
```css
- Scale 1.02 on cards
- Scale 1.05 on buttons
- Scale 1.10 on color swatches
- Shadow increase
- Translate arrows
```

### **Page Transitions:**
```css
- Fade in: 500ms
- Slide up: 300ms
- Scale: 200ms
```

### **Success Screen:**
```css
- Fade in: 500ms
- Scale checkmark from 0.8 to 1
- Auto redirect: 3000ms delay
```

---

## 🚀 Features Highlight

### **Product Page:**
- 📸 Beautiful product gallery với 5 images
- 💰 Clear pricing (570,000₫)
- ⭐ Trust indicators (1000+ customers, 4.9/5)
- 📦 Product specs (size, pages, material, time)
- 💡 Note khuyến khích try-before-buy

### **Character Creator:**
- 🎨 Visual color pickers
- 👤 Real-time preview
- ✅ Selection highlights rõ ràng
- 💡 Helpful tooltips
- 🎯 Intuitive options (emoji + text)

### **Book Preview:**
- 📖 Realistic open book layout
- ✨ Decorative elements (stars, gradients)
- 📷 Multiple page previews
- 💬 Personalized quotes theo theme
- 🎨 Character appears trong scenes

### **Checkout:**
- 📋 Clear order summary
- ✏️ Easy edit access
- 💳 Multiple payment options
- ✅ Benefits list
- 🎉 Delightful success animation

---

## 🎨 Style Guidelines

### **Phong cách:**
- Cảm xúc, lãng mạn, kể chuyện
- Minh họa 2D, texture giấy
- Màu pastel (xanh tím vàng nhạt)
- Tối giản, tập trung trải nghiệm

### **Typography:**
- Serif nhẹ cho tiêu đề (Playfair Display)
- Sans-serif dễ đọc cho nội dung (Poppins)
- Handwriting cho accent (Dancing Script)

### **UI Elements:**
- Button bo tròn (rounded-full)
- Cards với shadow mềm
- Gradient backgrounds
- Iconography consistent (lucide-react)

---

## 📱 Responsive Breakpoints

```css
Mobile:  < 768px  (1 column)
Tablet:  768-1024px  (flexible)
Desktop: > 1024px  (2-3 columns)
```

---

## 🎯 Success Criteria

✅ User có thể dễ dàng hiểu flow  
✅ Mỗi bước rõ ràng, không overwhelm  
✅ Preview sách hấp dẫn, professional  
✅ Character creator fun, creative  
✅ Checkout đơn giản, tin cậy  
✅ Mobile-friendly  
✅ Animations mượt mà, subtle  
✅ Brand identity consistent (pastel, romantic)  

---

## 📝 Notes

- Tất cả images từ Figma assets đã được sử dụng
- Mock data cho character options (cần design assets thật)
- Form validation chưa implement (focus on UI/UX)
- Backend integration ready (BookOrder interface)
- Analytics tracking points sẵn sàng

---

**🎉 Website hoàn chỉnh, sẵn sàng demo và user testing!**
