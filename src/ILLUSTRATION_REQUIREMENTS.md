# 🎨 YÊU CẦU ILLUSTRATIONS CHO NHÂN VẬT

## 📋 Tổng quan

Website hiện đang sử dụng **CharacterIllustration component** để hiển thị nhân vật với phong cách **2D illustration, semi-realistic, romantic** như reference image đã cung cấp.

**Reference Style:**
![Character Style Reference](figma:asset/7138e6744a2ca0f98e0042a1863471b23f4a8cfc.png)

---

## 🎯 Số lượng cần thiết

### **Tính toán:**
```
Giới tính: 2 (Male, Female)
Kiểu tóc: 2 (Short, Long)
Màu tóc: 5 (Black, Brown, Red, Blonde, Gray)
Trang phục: 3 (Casual, Formal, Romantic)

Total = 2 × 2 × 5 × 3 = 60 illustrations
```

### **Ưu tiên Phase 1 (MVP):**
Để launch nhanh, chỉ cần **12 illustrations** cho các combinations phổ biến nhất:

#### **Female (6 illustrations):**
1. ✅ Female + Long + Brown + Romantic (đã có reference)
2. Female + Long + Black + Casual
3. Female + Long + Blonde + Romantic
4. Female + Short + Brown + Casual
5. Female + Short + Black + Formal
6. Female + Long + Red + Romantic

#### **Male (6 illustrations):**
1. ✅ Male + Short + Brown + Romantic (đã có reference)
2. Male + Short + Black + Casual
3. Male + Short + Brown + Formal
4. Male + Long + Brown + Casual
5. Male + Short + Blonde + Casual
6. Male + Short + Black + Formal

**Note:** Các combinations còn lại sẽ fallback về closest match hoặc default illustration.

---

## 🎨 Style Guidelines

### **Phong cách chung:**
- **Art style:** Semi-realistic 2D digital illustration
- **Mood:** Lãng mạn, ấm áp, cảm xúc
- **Color palette:** Pastel, soft colors
- **Lighting:** Soft, diffused light
- **Quality:** Professional digital art, clean lines

### **Character Details:**

#### **Proportions:**
- Full body character (đầu đến chân)
- Realistic proportions (không chibi)
- Height: ~7-8 heads tall
- Expressive face, friendly expression

#### **Facial Features:**
- Large, expressive eyes (anime-influenced)
- Soft facial features
- Gentle smile or neutral pleasant expression
- Detailed hair rendering
- Natural makeup (for female)

#### **Hair Rendering:**

**Long Hair:**
- Flowing, natural movement
- Detailed strands và highlights
- Soft shadows và depth
- Length: past shoulders, to mid-back

**Short Hair:**
- Clean cut, modern style
- Still detailed với texture
- Length: ear-length to shoulder

**Colors:**
- Black: #1a1a1a (deep black với subtle highlights)
- Brown: #8B4513 (warm chocolate brown)
- Red: #DC143C (vibrant red với burgundy shadows)
- Blonde: #FFD700 (golden blonde)
- Gray: #A9A9A9 (silver-gray, stylish)

#### **Outfits:**

**Romantic:**
- Female: Flowing dress, floral patterns optional, soft fabrics
- Male: Casual shirt (light colors), rolled sleeves, jeans/slacks
- Props: Có thể cầm hoa (like reference)
- Colors: Pastels (pink, lavender, cream, light blue)

**Casual:**
- Female: T-shirt/blouse + jeans/skirt, sneakers
- Male: T-shirt/polo + jeans, sneakers
- Modern, comfortable look
- Colors: Soft blues, whites, light grays

**Formal:**
- Female: Blazer/suit, dress pants/pencil skirt, heels
- Male: Button-down shirt/blazer, dress pants, dress shoes
- Professional, elegant
- Colors: Navy, gray, white, black

### **Poses:**

**Standard Pose (Priority):**
- Standing straight, facing forward
- Slight 3/4 view (like reference)
- Natural, relaxed posture
- Hands: at sides, in pockets, or holding props
- Friendly, approachable body language

**Optional Variations (Phase 2):**
- Couple poses (standing together)
- Action poses (walking, waving)
- Sitting poses

### **Background:**
- **Transparent PNG** (no background)
- OR soft gradient background (can be removed in post)
- Character should be easily extractable

---

## 📐 Technical Specifications

### **File Format:**
- **PNG** with transparency
- High resolution: **2000×3000px minimum**
- 300 DPI for print quality

### **Canvas Setup:**
```
Width: 2000px
Height: 3000px
Aspect Ratio: 2:3 (portrait)
Color Mode: RGB
Bit Depth: 8-bit
```

### **Character Placement:**
- Character centered in frame
- ~200px padding on all sides
- Full body visible (head to feet)
- Face at upper 1/3 of canvas

### **Layers (for source file):**
```
- Background (gradient/solid)
- Props (flowers, accessories)
- Body (outfit)
- Arms/Hands
- Head/Neck
- Hair (front)
- Hair (back) - behind head
- Shadows
- Highlights
```

### **Export Settings:**
- Format: PNG-24
- Transparency: Yes
- Compression: High quality (not too compressed)
- File size: 500KB - 2MB per file

---

## 🎯 Priority Checklist

### **Phase 1: MVP (12 files)**
- [ ] 1. Female-Long-Brown-Romantic ✅ (reference đã có)
- [ ] 2. Female-Long-Black-Casual
- [ ] 3. Female-Long-Blonde-Romantic
- [ ] 4. Female-Short-Brown-Casual
- [ ] 5. Female-Short-Black-Formal
- [ ] 6. Female-Long-Red-Romantic
- [ ] 7. Male-Short-Brown-Romantic ✅ (reference đã có)
- [ ] 8. Male-Short-Black-Casual
- [ ] 9. Male-Short-Brown-Formal
- [ ] 10. Male-Long-Brown-Casual
- [ ] 11. Male-Short-Blonde-Casual
- [ ] 12. Male-Short-Black-Formal

### **Phase 2: Extended (48 files)**
- Tất cả combinations còn lại

---

## 📁 File Naming Convention

```
character_[gender]_[hairStyle]_[hairColor]_[outfit].png

Examples:
- character_female_long_brown_romantic.png
- character_male_short_black_casual.png
- character_female_short_blonde_formal.png
```

---

## 🎨 Reference Images

### **Style References:**
1. ✅ Couple romantic illustration (provided)
   - File: `figma:asset/7138e6744a2ca0f98e0042a1863471b23f4a8cfc.png`
   - Style: Semi-realistic, soft colors, romantic mood

2. Existing book illustrations:
   - `figma:asset/e3aac7f894c0f163e73430cd24e482c359d5353f.png`
   - `figma:asset/e3dc89887407aae40ed4987d3011cdc80ce07e59.png`

### **Inspiration Keywords:**
- "Korean webtoon art style"
- "Romantic illustration couple"
- "Pastel color illustration"
- "Semi-realistic character art"
- "Digital portrait illustration"

---

## 💡 Tips for Designer

### **Do's:**
✅ Maintain consistent style across all characters
✅ Use soft, romantic lighting
✅ Add subtle details (fabric texture, hair strands)
✅ Keep expressions warm and friendly
✅ Use pastel color palette
✅ Add soft shadows for depth
✅ Make characters look like they belong in a storybook

### **Don'ts:**
❌ Don't make it too cartoony/chibi
❌ Don't use harsh lines or colors
❌ Don't add too many accessories (keep it clean)
❌ Don't make expressions too exaggerated
❌ Don't use dark/moody colors
❌ Don't make poses too dynamic (keep it gentle)

---

## 🔄 Integration Process

### **After receiving illustrations:**

1. **Save files to project:**
   ```
   /public/characters/
   ├── character_female_long_brown_romantic.png
   ├── character_male_short_black_casual.png
   └── ...
   ```

2. **Update CharacterIllustration.tsx:**
   ```typescript
   const characterLibrary = {
     female: {
       long: {
         brown: {
           romantic: '/characters/character_female_long_brown_romantic.png'
         }
       }
     }
   }
   ```

3. **Test in all contexts:**
   - [ ] Step 2: Character Creator preview
   - [ ] Step 3: Book preview (large)
   - [ ] Step 3: Info card (small)
   - [ ] Step 4: Checkout summary

4. **Optimize if needed:**
   - Compress with TinyPNG/ImageOptim
   - Verify transparency
   - Check file sizes

---

## 📊 Current Status

### **Available:**
✅ 1 couple illustration (can extract 2 characters)
✅ 3 book page illustrations (can be used as fallback)

### **Needed:**
⚠️ 10-58 more illustrations (depending on phase)

### **Temporary Solution:**
- Using existing illustrations as placeholders
- All combinations fallback to available images
- Fully functional but limited variety

---

## 🎯 Deliverables Summary

### **For Designer:**

**Minimum (Phase 1):**
- 12 PNG files
- Transparent backgrounds
- 2000×3000px
- Consistent style
- Deadline: TBD

**Full Set (Phase 2):**
- 60 PNG files
- Same specs as Phase 1
- Deadline: TBD

**Bonus (Optional):**
- Source files (PSD/AI)
- Couple poses (2 characters together)
- Multiple expressions per character
- Seasonal variations

---

## 💰 Budget Estimate

**Phase 1 (12 illustrations):**
- Simple style: $10-20 per character = $120-240
- Professional quality: $30-50 per character = $360-600

**Phase 2 (60 illustrations):**
- With Phase 1 style established: $15-30 per = $900-1,800

**Alternative:**
- AI generation với Midjourney/Stable Diffusion + manual touch-up
- Stock illustration libraries (ước modified)

---

## 📞 Questions for Designer

1. Estimate time per character illustration?
2. Can you provide 2-3 sample variations first?
3. Preferred file sharing method?
4. Source files included in delivery?
5. Revision policy?

---

**🎨 Khi có đủ illustrations, website sẽ có character customization hoàn chỉnh và chuyên nghiệp!**
