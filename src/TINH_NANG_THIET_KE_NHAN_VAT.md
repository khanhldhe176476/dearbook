# 🎨 TÍNH NĂNG THIẾT KẾ NHÂN VẬT

## 📌 TỔNG QUAN NHANH

Tính năng cho phép người dùng tạo nhân vật minh họa tùy chỉnh để đặt vào bìa sách.

---

## 🎯 TÍNH NĂNG

### **User có thể:**
✅ Chọn giới tính (Nam/Nữ)  
✅ Chọn 1 trong 6+ kiểu tóc  
✅ Chọn 1 trong 6+ trang phục  
✅ Xem preview real-time  
✅ Áp dụng nhân vật vào bìa sách  

---

## 🎨 PHONG CÁCH

- **Minh họa**: Bán hiện thực, lãng mạn, giống tranh bìa sách
- **Màu sắc**: Pastel (hồng, tím, xanh mint, kem)
- **Ánh sáng**: Mềm mại, không bóng cứng
- **Style**: Đồng nhất cho tất cả assets

---

## 🏗️ HỆ THỐNG LAYER

Nhân vật = **3 layers riêng biệt** ghép lên nhau:

```
┌──────────────┐
│ OUTFIT       │ ← Layer 3 (Top)
├──────────────┤
│ HAIR         │ ← Layer 2 (Middle)
├──────────────┤
│ BASE (Face)  │ ← Layer 1 (Bottom)
└──────────────┘
```

### **Kích thước chung:**
- Canvas: **800px × 1200px** (2:3 ratio)
- Format: **PNG transparent**
- DPI: **300**
- Tất cả layers phải **align perfect** khi overlap

---

## 📦 ASSET CẦN THIẾT

### **Tổng cộng: 26 files PNG**

#### **Female (14 files):**
- 1 base
- 6 hairstyles
- 6 outfits

#### **Male (12 files):**
- 1 base
- 6 hairstyles
- 6 outfits

---

## 📁 CẤU TRÚC FILES

```
/public/assets/characters/
│
├── female/
│   ├── base/
│   │   └── base-female.png
│   ├── hair/
│   │   ├── long-wavy.png
│   │   ├── short-bob.png
│   │   ├── ponytail.png
│   │   ├── bun.png
│   │   ├── lob.png
│   │   └── curly-short.png
│   └── outfit/
│       ├── floral-dress.png
│       ├── white-shirt.png
│       ├── vintage-dress.png
│       ├── pastel-sweater.png
│       ├── maxi-dress.png
│       └── cardigan.png
│
└── male/
    ├── base/
    │   └── base-male.png
    ├── hair/
    │   ├── undercut.png
    │   ├── slicked-back.png
    │   ├── side-part.png
    │   ├── mohawk.png
    │   ├── fade.png
    │   └── curly.png
    └── outfit/
        ├── blue-shirt.png
        ├── vneck-sweater.png
        ├── white-tee.png
        ├── hoodie.png
        ├── polo.png
        └── blazer.png
```

---

## 🎨 DANH SÁCH ASSETS

### **👩 FEMALE**

**Base:**
- Khuôn mặt + cổ + vai (không tóc, không quần áo)

**Hair (6 options):**
1. Tóc dài xoăn (Long Wavy) - Romantic
2. Tóc ngắn bob (Short Bob) - Modern
3. Tóc đuôi ngựa (Ponytail) - Playful
4. Tóc búi (Bun) - Elegant
5. Tóc lob (Lob) - Trendy
6. Tóc xoăn ngắn (Curly Short) - Cute

**Outfit (6 options):**
1. Váy hoa nhẹ nhàng (Floral Dress)
2. Áo sơ mi trắng (White Shirt)
3. Váy vintage (Vintage Dress)
4. Áo len pastel (Pastel Sweater)
5. Váy maxi (Maxi Dress)
6. Áo cardigan (Cardigan)

---

### **👨 MALE**

**Base:**
- Khuôn mặt + cổ + vai (không tóc, không quần áo)

**Hair (6 options):**
1. Tóc undercut (Undercut) - Modern
2. Tóc vuốt ngược (Slicked Back) - Classic
3. Tóc rẽ ngôi (Side Part) - Professional
4. Tóc mohawk (Mohawk) - Edgy
5. Tóc cạo 2 bên (Fade) - Athletic
6. Tóc xoăn tự nhiên (Curly) - Natural

**Outfit (6 options):**
1. Áo sơ mi xanh (Blue Shirt)
2. Áo len V-neck (V-neck Sweater)
3. Áo thun trắng (White Tee)
4. Áo hoodie (Hoodie)
5. Áo polo (Polo)
6. Áo blazer (Blazer)

---

## 🖌️ SPECS NHANH

### **File Format:**
```
- Type: PNG-24
- Background: Transparent
- Size: 800 x 1200 px
- DPI: 300
- Color: RGB
```

### **Màu sắc:**
```
Skin:   #FFE4D6, #F5D5C3, #E8C4B0
Hair:   #C9A892, #F2E8CF, #FFD6E8, #E0D0FF
Outfit: #FFD6E7, #D4F1F4, #C6F6D5, #E9D5FF
```

---

## 💻 CODE ĐÃ IMPLEMENT

### **Components:**
- ✅ `/components/CharacterDesigner.tsx` - Modal UI
- ✅ Integrated vào `/components/BookEditor.tsx`
- ✅ Nút "Thiết kế nhân vật" trong editor toolbar
- ✅ Real-time preview
- ✅ Apply to cover page

### **Features hoạt động:**
- ✅ Gender toggle (Nam/Nữ)
- ✅ Tab switching (Kiểu tóc / Trang phục)
- ✅ Thumbnail grid (2 columns)
- ✅ Selection highlight
- ✅ Preview lớn ở giữa
- ✅ Button "Áp dụng vào bìa sách"
- ✅ Add character vào cover page như image element
- ✅ Character data được lưu để edit lại sau

---

## 🎯 USER FLOW

1. **Mở Editor** → Click nút "Thiết kế nhân vật" (icon User)
2. **Modal mở** → Default: Female, first hair, first outfit
3. **Chọn giới tính** → Toggle Nam/Nữ
4. **Tab "Kiểu tóc"** → Click chọn 1 trong 6
5. **Tab "Trang phục"** → Click chọn 1 trong 6
6. **Preview update** → Xem real-time
7. **Click "Áp dụng"** → Nhân vật thêm vào bìa sách
8. **Drag/Resize** → Như image element bình thường

---

## 📋 HIỆN TRẠNG

### **✅ Đã hoàn thành (Code):**
- UI/UX design hoàn chỉnh
- Component structure
- State management
- Integration vào Editor
- Apply to book functionality

### **❌ Chưa có (Cần designer):**
- **26 PNG files** - Asset minh họa thực tế
- Hiện đang dùng **mock images từ Unsplash**

---

## 🚀 NEXT STEPS

### **Để feature hoạt động 100%:**

1. **Designer thiết kế assets:**
   - Đọc file `/HUONG_DAN_THIET_KE_NHAN_VAT.md`
   - Thiết kế 26 PNG files theo specs
   - Export đúng format & naming

2. **Developer update paths:**
   - Replace mock data trong `CharacterDesigner.tsx`
   - Update paths tới assets thật
   - Test compositing layers

3. **QA Testing:**
   - Test tất cả combinations
   - Verify alignment
   - Check performance

---

## 📚 TÀI LIỆU THAM KHẢO

- **Hướng dẫn chi tiết**: `/HUONG_DAN_THIET_KE_NHAN_VAT.md`
- **Component code**: `/components/CharacterDesigner.tsx`
- **Integration**: `/components/BookEditor.tsx`
- **Design system**: `/styles/globals.css`

---

## 🎨 MẪU THIẾT KẾ

### **Inspiration References:**
- Romance novel cover art
- Webtoon characters (Korean manhwa style)
- Pastel aesthetic Instagram art
- Book illustration (semi-realistic)

### **Style Guide:**
- **NOT**: Cartoon, chibi, anime
- **NOT**: Hyper-realistic, 3D render
- **YES**: Semi-illustration, dreamy, romantic
- **YES**: Soft edges, pastel colors, gentle lighting

---

## ✨ DEMO HIỆN TẠI

**Chức năng demo với mock images:**
- Có thể mở modal Character Designer
- Có thể toggle giới tính
- Có thể chọn hair/outfit (mock thumbnails)
- Preview hiển thị mock image
- Có thể apply vào cover page

**Để thấy design đầy đủ:**
1. Vào BookEditor
2. Click icon User (pastel pink/purple)
3. Modal mở ra với full UI

---

**🎯 Kết luận: UI/UX + Code đã hoàn thành 100%. Chỉ cần assets minh họa để feature hoạt động thực tế!**
