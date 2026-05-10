# 🎨 HƯỚNG DẪN THIẾT KẾ NHÂN VẬT - BOOKIFY

## 📋 TỔNG QUAN

Tài liệu này mô tả chi tiết cách thiết kế và chuẩn bị asset cho tính năng "Thiết kế nhân vật" trong Bookify.

---

## 🎯 MỤC TIÊU

Cho phép người dùng tạo nhân vật minh họa tùy chỉnh để đặt vào bìa sách với:
- Chọn giới tính (Nam/Nữ)
- Chọn kiểu tóc (6+ options mỗi giới tính)
- Chọn trang phục (6+ options mỗi giới tính)
- Preview real-time
- Áp dụng trực tiếp vào bìa sách

---

## 🎨 YÊU CẦU PHONG CÁCH MINH HỌA

### **1. Phong Cách Tổng Thể**
- ✨ **Lãng mạn, nhẹ nhàng** - Giống tranh bìa sách tiểu thuyết lãng mạn
- 🎨 **Bán hiện thực (semi-illustration)** - Không quá cartoon, không quá realistic
- 🌸 **Màu sắc pastel** - Hồng nhạt, tím nhạt, xanh mint, kem, đào
- ☀️ **Ánh sáng mềm** - Soft lighting, không có bóng cứng
- 🎭 **Phong cách đồng nhất** - Tất cả nhân vật và trang phục phải cùng style

### **2. Chi Tiết Minh Họa**
- **Khuôn mặt**: Nét mềm mại, friendly, approachable
- **Tóc**: Mềm mại, có chuyển động tự nhiên, pastel colors
- **Trang phục**: Hiện đại nhưng timeless, màu pastel, simple patterns
- **Background**: Transparent (PNG với alpha channel)

### **3. Tham Khảo**
Các phong cách artwork tương tự:
- Book cover illustrations của Harlequin/Romance novels
- Webtoon romantic genre characters
- Korean manhwa art style (softer version)
- Pastel aesthetic Instagram art

---

## 📐 HỆ THỐNG LAYER

### **Concept: Ghép Layer Như Giấy Trong**

Nhân vật được chia thành 3 layer riêng biệt:

```
┌─────────────────────┐
│   LAYER 3: OUTFIT   │ (Top layer)
│   (Trang phục)      │
├─────────────────────┤
│   LAYER 2: HAIR     │ (Middle layer)
│   (Tóc)             │
├─────────────────────┤
│   LAYER 1: BASE     │ (Bottom layer)
│   (Khuôn mặt/Đầu)   │
└─────────────────────┘
```

### **Layer 1: BASE (Khuôn mặt/Đầu)**

**Nội dung:**
- Khuôn mặt hoàn chỉnh
- Cổ
- Vai (phần trên)
- Không bao gồm tóc, trang phục

**Yêu cầu:**
- File PNG trong suốt
- Kích thước chuẩn: **800px x 1200px**
- Position anchor: Center top
- 2 biến thể: `base-female.png`, `base-male.png`

**Đặc điểm:**
- Làn da pastel tone (peach, cream)
- Expression: Nhẹ nhàng, mỉm cười nhẹ
- Eyes: Friendly, expressive
- Không có bóng tối cứng

**Files cần thiết:**
```
/assets/characters/
├── female/
│   └── base/
│       └── base-female.png
└── male/
    └── base/
        └── base-male.png
```

---

### **Layer 2: HAIR (Tóc)**

**Nội dung:**
- Tóc hoàn chỉnh (all around)
- Có thể che phần mặt (tùy kiểu tóc)
- Màu tóc pastel

**Yêu cầu:**
- File PNG trong suốt
- Kích thước: **800px x 1200px** (GIỐNG BASE)
- Position: Khớp chính xác với base layer
- Mỗi giới tính: 6+ variations

**Kiểu tóc Female (6 options):**
1. **Long Wavy (Tóc dài xoăn)**
   - File: `long-wavy.png`
   - Màu: Pastel brown/blonde
   - Style: Romantic waves, flowing

2. **Short Bob (Tóc ngắn bob)**
   - File: `short-bob.png`
   - Màu: Pastel pink/brown
   - Style: Clean cut, chin-length

3. **Ponytail (Tóc đuôi ngựa)**
   - File: `ponytail.png`
   - Màu: Pastel brown
   - Style: High ponytail, playful

4. **Bun (Tóc búi)**
   - File: `bun.png`
   - Màu: Pastel brown
   - Style: Elegant top bun

5. **Lob (Tóc lob)**
   - File: `lob.png`
   - Màu: Pastel blonde
   - Style: Shoulder-length, modern

6. **Curly Short (Tóc xoăn ngắn)**
   - File: `curly-short.png`
   - Màu: Pastel brown
   - Style: Cute curls, volume

**Kiểu tóc Male (6 options):**
1. **Undercut**
   - File: `undercut.png`
   - Style: Modern, short sides

2. **Slicked Back (Tóc vuốt ngược)**
   - File: `slicked-back.png`
   - Style: Classic, neat

3. **Side Part (Tóc rẽ ngôi)**
   - File: `side-part.png`
   - Style: Professional, clean

4. **Mohawk**
   - File: `mohawk.png`
   - Style: Edgy but soft

5. **Fade (Tóc cạo 2 bên)**
   - File: `fade.png`
   - Style: Trendy, athletic

6. **Curly (Tóc xoăn tự nhiên)**
   - File: `curly.png`
   - Style: Natural, textured

**Files cần thiết:**
```
/assets/characters/
├── female/
│   └── hair/
│       ├── long-wavy.png
│       ├── short-bob.png
│       ├── ponytail.png
│       ├── bun.png
│       ├── lob.png
│       └── curly-short.png
└── male/
    └── hair/
        ├── undercut.png
        ├── slicked-back.png
        ├── side-part.png
        ├── mohawk.png
        ├── fade.png
        └── curly.png
```

---

### **Layer 3: OUTFIT (Trang phục)**

**Nội dung:**
- Áo/váy từ vai đến dưới khung hình
- Có thể che phần cổ/vai của base
- Style hiện đại, lãng mạn

**Yêu cầu:**
- File PNG trong suốt
- Kích thước: **800px x 1200px** (GIỐNG BASE)
- Position: Khớp chính xác với base layer
- Mỗi giới tính: 6+ variations

**Trang phục Female (6 options):**
1. **Floral Dress (Váy hoa nhẹ nhàng)**
   - File: `floral-dress.png`
   - Màu: Pastel pink với hoa nhỏ
   - Style: Romantic, flowing

2. **White Shirt (Áo sơ mi trắng)**
   - File: `white-shirt.png`
   - Màu: Off-white cream
   - Style: Clean, elegant

3. **Vintage Dress (Váy vintage)**
   - File: `vintage-dress.png`
   - Màu: Pastel blue/pink
   - Style: Retro, sweet

4. **Pastel Sweater (Áo len pastel)**
   - File: `pastel-sweater.png`
   - Màu: Mint/lavender
   - Style: Cozy, soft

5. **Maxi Dress (Váy maxi)**
   - File: `maxi-dress.png`
   - Màu: Pastel purple
   - Style: Elegant, flowing

6. **Cardigan (Áo cardigan)**
   - File: `cardigan.png`
   - Màu: Cream/pink
   - Style: Casual, warm

**Trang phục Male (6 options):**
1. **Blue Shirt (Áo sơ mi xanh)**
   - File: `blue-shirt.png`
   - Màu: Pastel blue
   - Style: Professional

2. **V-neck Sweater (Áo len V-neck)**
   - File: `vneck-sweater.png`
   - Màu: Beige/cream
   - Style: Casual elegant

3. **White Tee (Áo thun trắng)**
   - File: `white-tee.png`
   - Màu: Off-white
   - Style: Casual, simple

4. **Hoodie**
   - File: `hoodie.png`
   - Màu: Pastel gray/blue
   - Style: Casual, young

5. **Polo Shirt (Áo polo)**
   - File: `polo.png`
   - Màu: Pastel green/blue
   - Style: Smart casual

6. **Blazer**
   - File: `blazer.png`
   - Màu: Light gray/beige
   - Style: Formal, elegant

**Files cần thiết:**
```
/assets/characters/
├── female/
│   └── outfit/
│       ├── floral-dress.png
│       ├── white-shirt.png
│       ├── vintage-dress.png
│       ├── pastel-sweater.png
│       ├── maxi-dress.png
│       └── cardigan.png
└── male/
    └── outfit/
        ├── blue-shirt.png
        ├── vneck-sweater.png
        ├── white-tee.png
        ├── hoodie.png
        ├── polo.png
        └── blazer.png
```

---

## 📏 THÔNG SỐ KỸ THUẬT

### **1. Kích Thước Canvas**
```
Width:  800px
Height: 1200px
Ratio:  2:3 (portrait)
Format: PNG với alpha channel
DPI:    300 (for print quality)
```

### **2. Position & Alignment**
- **Anchor Point**: Top center của canvas
- **Face Position**: Đầu nằm ở 1/4 trên của canvas
- **Shoulder Line**: Tại ~400px từ top
- **All layers MUST align perfectly** khi overlap

### **3. Naming Convention**
```
{gender}-{type}-{variant}.png

Examples:
- female-base.png
- female-hair-long-wavy.png
- female-outfit-floral-dress.png
- male-base.png
- male-hair-undercut.png
- male-outfit-blue-shirt.png
```

### **4. Color Palette**

**Skin Tones:**
```
Light:  #FFE4D6
Medium: #F5D5C3
Warm:   #E8C4B0
```

**Hair Colors:**
```
Pastel Brown:  #C9A892
Pastel Blonde: #F2E8CF
Pastel Pink:   #FFD6E8
Pastel Purple: #E0D0FF
Light Auburn:  #D9B5A0
```

**Outfit Colors:**
```
Pastel Pink:   #FFD6E7
Pastel Blue:   #D4F1F4
Pastel Mint:   #C6F6D5
Pastel Lavender: #E9D5FF
Cream:         #FFF4E6
Soft Gray:     #F3F4F6
```

---

## 🎨 QUY TRÌNH THIẾT KẾ

### **Step 1: Sketch Base Character**
1. Vẽ phác thảo khuôn mặt + vai cổ
2. Expression: mỉm cười nhẹ, friendly
3. Không vẽ tóc, không vẽ quần áo
4. Export as `base-{gender}.png`

### **Step 2: Design Hair Variations**
1. Tạo file mới với canvas **800x1200px**
2. Import base để reference position
3. Vẽ tóc che lên base (có thể che mặt tùy style)
4. **Tắt/Xóa base layer** trước khi export
5. Export ONLY hair layer as PNG transparent
6. Repeat cho 6+ hairstyles

### **Step 3: Design Outfit Variations**
1. Tạo file mới với canvas **800x1200px**
2. Import base + hair để reference
3. Vẽ outfit che từ vai xuống
4. **Tắt/Xóa base & hair layers** trước khi export
5. Export ONLY outfit layer as PNG transparent
6. Repeat cho 6+ outfits

### **Step 4: Test Compositing**
1. Tạo file test
2. Import base → hair → outfit theo thứ tự layers
3. Kiểm tra alignment có khớp không
4. Kiểm tra không có gap/overlap lạ
5. Điều chỉnh nếu cần

---

## 🛠️ TOOLS ĐỀ XUẤT

### **Illustration Software:**
- **Adobe Illustrator** - Vector, dễ export layers
- **Procreate** (iPad) - Natural drawing, layer management
- **Clip Studio Paint** - Manga/illustration focused
- **Adobe Photoshop** - Raster, full control
- **Figma** - Vector, collaborative

### **Export Settings:**
```
Format:     PNG-24
Color Mode: RGB
Background: Transparent
Quality:    100%
Size:       800 x 1200 px
DPI:        300
```

---

## 📦 CẤU TRÚC THƯ MỤC HOÀN CHỈNH

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

**Total Files Needed:**
- 2 base (female + male)
- 12 hair (6 female + 6 male)
- 12 outfit (6 female + 6 male)
- **= 26 PNG files tổng cộng**

---

## 💻 IMPLEMENTATION (Code Side)

### **Layer Compositing Logic:**

```typescript
// Pseudo-code for rendering character
function renderCharacter(characterData: CharacterData) {
  const canvas = createCanvas(800, 1200);
  const ctx = canvas.getContext('2d');
  
  // Layer 1: Base
  const baseImage = loadImage(characterData.layers.base);
  ctx.drawImage(baseImage, 0, 0);
  
  // Layer 2: Hair
  const hairImage = loadImage(characterData.layers.hair);
  ctx.drawImage(hairImage, 0, 0);
  
  // Layer 3: Outfit
  const outfitImage = loadImage(characterData.layers.outfit);
  ctx.drawImage(outfitImage, 0, 0);
  
  return canvas.toDataURL();
}
```

### **Data Structure:**

```typescript
interface CharacterData {
  gender: 'male' | 'female';
  hairStyle: string;  // ID: 'long-wavy', 'undercut', etc.
  outfit: string;     // ID: 'floral-dress', 'blue-shirt', etc.
  layers: {
    base: string;     // Path: '/assets/characters/female/base/base-female.png'
    hair: string;     // Path: '/assets/characters/female/hair/long-wavy.png'
    outfit: string;   // Path: '/assets/characters/female/outfit/floral-dress.png'
  };
}
```

---

## ✅ CHECKLIST HOÀN THÀNH

### **Thiết kế:**
- [ ] 1 Base female với expression nhẹ nhàng
- [ ] 1 Base male với expression nhẹ nhàng
- [ ] 6 Hair variations female (pastel colors)
- [ ] 6 Hair variations male (clean styles)
- [ ] 6 Outfit variations female (romantic, pastel)
- [ ] 6 Outfit variations male (modern, clean)

### **Kỹ thuật:**
- [ ] Tất cả files đúng kích thước 800x1200px
- [ ] Tất cả files PNG transparent
- [ ] Layers align perfectly khi overlap
- [ ] Naming convention consistent
- [ ] Folder structure đúng
- [ ] Đã test composite 2-3 combinations

### **Chất lượng:**
- [ ] Phong cách đồng nhất giữa tất cả assets
- [ ] Màu sắc pastel, soft lighting
- [ ] Không có edge/artifact lạ
- [ ] Resolution đủ cao (300 DPI)
- [ ] File size tối ưu (< 500KB/file)

---

## 🎯 SỬ DỤNG TRONG APP

### **User Flow:**
1. User click nút "Thiết kế nhân vật" (icon User)
2. Modal mở ra với preview lớn + options panel
3. User chọn giới tính → Base + default hair + outfit load
4. User click tab "Kiểu tóc" → chọn 1 trong 6 options
5. Preview update real-time (composite layers)
6. User click tab "Trang phục" → chọn 1 trong 6 options
7. Preview update real-time
8. User click "Áp dụng vào bìa sách"
9. Nhân vật composite được add vào cover page như 1 image element
10. User có thể drag/resize như image bình thường

### **Technical Implementation:**
- Composite 3 layers thành 1 image khi "Áp dụng"
- Hoặc lưu character data để có thể edit lại sau
- Image element có thể drag, resize, delete như bình thường

---

## 🔮 FUTURE ENHANCEMENTS

### **Phase 2 Features:**
- [ ] Thêm options cho màu da (3-5 tones)
- [ ] Thêm accessories (glasses, hats, jewelry)
- [ ] Thêm pose variations (standing, sitting, etc.)
- [ ] Thêm couple mode (2 characters side-by-side)
- [ ] Export character riêng (không cần book)

### **Phase 3 Features:**
- [ ] AI-generated variations
- [ ] Custom color picker cho hair/outfit
- [ ] Facial expression options
- [ ] Background scenes
- [ ] Animation preview

---

## 📞 SUPPORT

Nếu cần hỗ trợ thiết kế hoặc có câu hỏi về specs, vui lòng tham khảo:
- Design System: `/styles/globals.css`
- Color Palette: Pastel theme trong design system
- UI Component: `/components/CharacterDesigner.tsx`

---

**🎨 Chúc bạn thiết kế thành công! Hãy tạo ra những nhân vật đẹp và lãng mạn cho người dùng Bookify! 💕**
