# 🎨 DearBook - Hệ thống thiết kế sách cá nhân hoá hoàn chỉnh

## 📋 Tổng quan

**DearBook** là nền tảng thiết kế và đặt in sách quà tặng cá nhân hoá với:
- ✅ Google OAuth authentication
- ✅ Advanced book editor với drag & drop
- ✅ Portfolio-style library với masonry grid
- ✅ 4 themes (Love, Family, Birthday, Friendship)
- ✅ 100+ assets (stickers, icons, shapes, frames)
- ✅ Responsive design
- ✅ Auto-save với localStorage

---

## 🎯 User Flow

```
Login (Google OAuth)
    ↓
My Books Library (Portfolio View)
    ↓
Create New Book
    ↓
Step 1: Theme Selection (Love/Family/Birthday/Friendship)
    ↓
Step 2: Template Selection (Pre-designed templates)
    ↓
Step 3: Character Customization (Optional)
    ↓
Step 4: Page Editor
    ├─ Simple Mode: Quick text editing
    └─ Advanced Mode: Professional editor
         ├─ Asset Library (Text, Stickers, Icons, Shapes, Frames, Images)
         ├─ Layer Management (Reorder, Lock, Hide, Duplicate, Delete)
         ├─ Properties Panel (Style, Position, Effects)
         └─ Toolbar (Undo/Redo, Align, Zoom, Save)
    ↓
Preview & Order
    ↓
Checkout & Payment
    ↓
Success!
```

---

## 🏗️ Kiến trúc hệ thống

### **Frontend Stack**
- **React** 18+ with TypeScript
- **Tailwind CSS** v4.0
- **Vite** for build
- **Google OAuth** (@react-oauth/google)
- **Lucide React** for icons
- **LocalStorage** for data persistence

### **Components Structure**

```
/components/
├── App.tsx                          # Main app entry point
├── LoginScreen.tsx                  # Google OAuth login
├── MyBooksLibraryPortfolio.tsx     # Portfolio-style book library
├── GuidedBookBuilder.tsx            # 4-step guided builder
│
├── /builder/                        # Builder steps
│   ├── Step1ThemeSelection.tsx
│   ├── Step2TemplateSelection.tsx
│   ├── Step3CharacterCustomization.tsx
│   ├── Step4PageEditorAdvanced.tsx  # Dual-mode editor wrapper
│   └── Book3DPreviewPanel.tsx
│
├── /editor/                         # Advanced Editor
│   ├── AdvancedPageEditor.tsx       # Main canvas editor
│   ├── AssetLibrary.tsx             # Asset picker
│   ├── LayerPanel.tsx               # Layer management
│   ├── PropertiesPanelAdvanced.tsx  # Properties editor
│   └── EditorToolbar.tsx            # Toolbar
│
├── /ui/                             # Shadcn/ui components
│   └── [40+ reusable components]
│
└── OrderFlow.tsx                    # Checkout flow
```

### **Data Structure**

```typescript
// User
interface User {
  email: string;
  name: string;
}

// Book
interface BookData {
  id: string;
  theme: 'love' | 'family' | 'birthday' | 'friendship';
  templateId: string;
  character?: CharacterData;
  pages: PageData[];
  status: 'draft' | 'completed';
  createdAt: string;
  updatedAt: string;
  title?: string;
}

// Page
interface PageData {
  id: string;
  templatePageId: string;
  texts: { [key: string]: string };
  images: { [key: string]: string };
}

// Advanced Editor Element
type PageElement = 
  | TextElement 
  | ImageElement 
  | ShapeElement 
  | StickerElement 
  | IconElement 
  | FrameElement;
```

---

## 🎨 Design System

### **Colors**
- **Primary**: Rose (500) to Amber (500) gradient
- **Themes**:
  - Love: Rose/Pink gradient
  - Family: Blue/Cyan gradient
  - Birthday: Purple/Pink gradient
  - Friendship: Amber/Orange gradient
- **Background**: Soft gradients (Orange-50 → Rose-50 → Amber-50)

### **Typography**
- **Primary**: Poppins (Body), Inter (UI)
- **Display**: Playfair Display, Dancing Script
- **Special**: Cormorant, Fredoka, Nunito

### **Spacing**
- Base unit: 4px (Tailwind default)
- Container: max-w-7xl
- Padding: Responsive (px-4 sm:px-6 lg:px-8)

### **Components**
- Rounded corners: rounded-xl, rounded-2xl, rounded-3xl
- Shadows: shadow-md, shadow-lg, shadow-2xl
- Transitions: transition-all duration-300
- Backdrop blur: backdrop-blur-sm, backdrop-blur-lg

---

## 🔐 Authentication

**Google OAuth Integration**
- Library: `@react-oauth/google`
- Client ID: Stored in `VITE_GOOGLE_CLIENT_ID`
- Session: Saved to `localStorage.dearbook_user`
- Auto-login: Check saved session on app load

---

## 💾 Data Persistence

**LocalStorage Keys:**
- `dearbook_user`: User session
- `dearbook_books`: Array of BookData
- Auto-save: Debounced 300ms

**Data Flow:**
1. User creates/edits book
2. Changes auto-save to state
3. State syncs to localStorage
4. On page load, restore from localStorage

---

## 🎨 Advanced Editor Features

### **Asset Library**
- **Stickers**: 50+ emojis categorized (Hearts, Celebration, Nature, People, Objects)
- **Icons**: 50+ Lucide icons (Basic, Arrows, Decorative)
- **Shapes**: 6 shapes (Circle, Square, Heart, Star, Rectangle, Triangle)
- **Frames**: 5 frame styles (Simple, Double, Rounded, Dashed, Decorative)
- **Images**: Upload or Unsplash integration

### **Editing Capabilities**
- ✅ Drag & drop elements
- ✅ Multi-select (Shift+Click)
- ✅ Layer reordering
- ✅ Lock/Unlock elements
- ✅ Hide/Show elements
- ✅ Duplicate elements
- ✅ Delete elements
- ✅ Undo/Redo (Ctrl+Z/Y)
- ✅ Alignment tools
- ✅ Zoom controls
- ✅ Grid overlay
- ✅ Real-time properties editing

### **Element Properties**
- **Position**: X, Y, Width, Height, Rotation
- **Appearance**: Opacity, Colors, Fonts, Sizes
- **Text**: Font family, size, weight, style, alignment, effects
- **Image**: Object-fit, border-radius, filters
- **Shape**: Fill, stroke, stroke-width

---

## 📱 Responsive Design

### **Breakpoints**
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (sm-lg)
- Desktop: > 1024px (lg+)

### **Mobile Optimizations**
- Collapsible panels
- Touch-friendly buttons (min 44px)
- Simplified toolbar on small screens
- Responsive grid (1 col → 2 col → 3 col)
- Sticky headers

---

## 🚀 Performance

### **Optimization Techniques**
- Debounced auto-save (300ms)
- Lazy load images
- Memoized components
- Efficient re-renders (React.memo where needed)
- LocalStorage caching

### **Best Practices**
- < 20 elements per page
- Optimize images before upload
- Use icons instead of images when possible
- Limit history to 50 states

---

## 🎯 User Experience

### **Onboarding**
1. Google login (1-click)
2. Welcome screen with CTA
3. Template selection with preview
4. Guided 4-step builder
5. Optional advanced editor

### **Feedback**
- Visual selection indicators
- Hover states on all interactive elements
- Loading states for async operations
- Success/Error messages
- Auto-save indicators

### **Accessibility**
- Keyboard shortcuts
- Focus indicators
- Alt text for images
- ARIA labels where needed
- Sufficient color contrast

---

## 📊 Features Comparison

| Feature | Simple Mode | Advanced Mode |
|---------|-------------|---------------|
| Text editing | ✅ Form-based | ✅ Canvas + Properties |
| Images | ❌ | ✅ Upload + Unsplash |
| Stickers | ❌ | ✅ 50+ emojis |
| Icons | ❌ | ✅ 50+ Lucide icons |
| Shapes | ❌ | ✅ 6 shapes |
| Frames | ❌ | ✅ 5 frame styles |
| Drag & Drop | ❌ | ✅ |
| Layer Management | ❌ | ✅ |
| Undo/Redo | ❌ | ✅ |
| Alignment Tools | ❌ | ✅ |
| Color Palettes | ❌ | ✅ 8 palettes |
| Font Pairings | ❌ | ✅ 5 pairings |
| Text Effects | ❌ | ✅ 5 effects |

---

## 🛠️ Development

### **Setup**
```bash
npm install
npm run dev
```

### **Build**
```bash
npm run build
npm run preview
```

### **Environment Variables**
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### **File Organization**
- `/components` - React components
- `/data` - Static data (templates, assets)
- `/types` - TypeScript type definitions
- `/styles` - Global CSS (Tailwind config)

---

## 📚 Documentation

- `QUICKSTART.md` - Quick start guide
- `ADVANCED_EDITOR_GUIDE.md` - Advanced editor guide
- `GOOGLE_OAUTH_SETUP.md` - OAuth setup
- `REBRANDING_SUMMARY.md` - Rebranding changes
- `TOM_TAT_HE_THONG.md` - Vietnamese system overview

---

## 🎉 Key Achievements

✅ **Complete authentication** with Google OAuth
✅ **Professional editor** with 100+ assets
✅ **Portfolio-style library** with filters & sorting
✅ **Dual-mode editor** (Simple + Advanced)
✅ **Layer management** system
✅ **Properties panel** with full customization
✅ **Keyboard shortcuts** for productivity
✅ **Auto-save** functionality
✅ **Responsive design** for all devices
✅ **Beautiful UI** with Tailwind CSS
✅ **Type-safe** with TypeScript

---

## 🔮 Future Enhancements

### **Phase 1: Editor Improvements**
- [ ] Canvas resize handles
- [ ] Direct text editing on canvas
- [ ] Copy/Paste elements
- [ ] Group/Ungroup elements
- [ ] Advanced image cropping

### **Phase 2: Content**
- [ ] More templates (20+ per theme)
- [ ] Custom fonts upload
- [ ] Stock photos integration
- [ ] Background patterns library
- [ ] Illustration library

### **Phase 3: Collaboration**
- [ ] Real-time editing (Supabase)
- [ ] Share preview links
- [ ] Export to PDF/PNG
- [ ] Print-ready export
- [ ] QR code generation

### **Phase 4: AI Features**
- [ ] AI-powered text suggestions
- [ ] Auto-layout optimization
- [ ] Color palette generation
- [ ] Content recommendations

### **Phase 5: Marketplace**
- [ ] Template marketplace
- [ ] Designer profiles
- [ ] Review system
- [ ] Premium templates

---

## 💼 Business Model

### **Free Tier**
- Unlimited books creation
- All templates
- Basic editor
- LocalStorage save
- Watermarked preview

### **Premium** ($9.99/book)
- Remove watermark
- High-res export
- Advanced editor
- Priority support
- Cloud save (Supabase)

### **Pro** ($29/month)
- Unlimited premium books
- Early access to new features
- Custom branding
- API access
- Priority support

---

## 📈 Metrics to Track

- User registrations
- Books created
- Conversion rate (draft → order)
- Most popular themes
- Average time to complete
- Editor mode usage (Simple vs Advanced)
- Asset usage statistics
- User retention

---

## 🎯 Success Criteria

✅ **Technical**
- Page load < 2s
- Editor FPS > 30
- Zero critical bugs
- 100% type coverage

✅ **UX**
- < 5 min to create first book
- > 80% completion rate
- < 5% error rate
- > 4.5★ user rating

✅ **Business**
- > 1000 users in 3 months
- > 10% conversion rate
- < $5 CAC
- > $20 LTV

---

**Built with ❤️ using React + TypeScript + Tailwind CSS**

🚀 **Ready for production!**
