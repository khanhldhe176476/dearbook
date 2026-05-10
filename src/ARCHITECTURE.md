# Bookify Architecture - Kiến trúc 2 Layout Riêng biệt

## Tổng quan

Bookify được thiết kế với **2 layout hoàn toàn riêng biệt** để đảm bảo authentication flow nghiêm ngặt:

1. **Auth Layout** - Cho trang Login/Register (standalone, không có navigation)
2. **App Layout** - Cho các trang sau khi đăng nhập (có header navigation đầy đủ)

---

## 🔐 Authentication Flow

```
Landing Page → Login (standalone) → Dashboard → Wizard → Editor → Preview 3D → Checkout → Payment Success → Dashboard
```

### Quy tắc nghiêm ngặt:

✅ **ĐƯỢC PHÉP:**
- Landing page có navigation menu cơ bản (Templates, Pricing, FAQ)
- Landing page có nút "Đăng nhập" và "Tạo sách ngay"
- Login page là trang standalone 100% (chỉ có form login)

❌ **KHÔNG ĐƯỢC PHÉP:**
- Login page có navigation menu
- Login page có header chung với các trang authenticated
- Guest user nhìn thấy Dashboard, Editor, Template Library
- Bất kỳ chức năng nào hiển thị khi chưa đăng nhập

---

## 📁 Cấu trúc Layout

### 1. Auth Layout (LoginRegister.tsx)

**Trang áp dụng:** Login, Register

**Đặc điểm:**
- Trang hoàn toàn độc lập (standalone)
- KHÔNG có header navigation
- KHÔNG có sidebar
- KHÔNG có dashboard components
- CHỈ có form đăng nhập/đăng ký

**Các thành phần được phép:**
- Logo Bookify
- Tiêu đề đăng nhập
- Email + Password inputs
- Button "Đăng nhập"
- Button "Tiếp tục với Google"
- Link "Quên mật khẩu?"
- Link chuyển đổi "Đăng ký" / "Đăng nhập"
- Footer Terms/Privacy

**Code:**
```tsx
// components/LoginRegister.tsx
// Không có props onBack, không có navigation menu
export function LoginRegister({ onLogin }: LoginRegisterProps) {
  // Pure login form - standalone page
}
```

---

### 2. App Layout (AppLayout.tsx)

**Trang áp dụng:** Dashboard, CreateWizard, Editor, Preview3D, Checkout, PaymentSuccess

**Đặc điểm:**
- Có header navigation đầy đủ
- Có user menu (avatar, tên, email)
- Có nút "Đăng xuất"
- Có nút "Quay về Dashboard" (trừ trang Dashboard)
- Wrap tất cả nội dung của trang authenticated

**Header Navigation bao gồm:**
- Logo Bookify (click để về Dashboard)
- Nút "Dashboard" (nếu không ở trang Dashboard)
- User menu dropdown với:
  - Avatar
  - Tên & Email
  - Nút "Đăng xuất"

**Code:**
```tsx
// components/AppLayout.tsx
<AppLayout
  user={user}
  onLogout={handleLogout}
  onBackToDashboard={handleBackToDashboard}
  showBackButton={currentScreen !== 'dashboard'}
>
  {children}
</AppLayout>
```

---

## 🎯 Screen States

### Public Screens (Không cần authentication)

1. **Landing Page**
   - Navigation: Templates, Pricing, FAQ
   - Actions: "Đăng nhập", "Tạo sách ngay"
   - Click "Tạo sách ngay" → redirect to Login

2. **Login Page** 
   - Layout: Auth Layout (standalone)
   - No navigation, no header
   - Pure login form only

### Protected Screens (Cần authentication)

Tất cả các trang sau được wrap trong **AppLayout**:

1. **Dashboard**
   - Full header với user menu
   - Search bar
   - Book grid
   - Stats

2. **Create Wizard**
   - Header với "Quay về Dashboard"
   - Theme selection
   - Template selection
   - Page count selection

3. **Editor**
   - Header với "Quay về Dashboard"
   - 3-column layout (sidebar, canvas, properties)
   - Save & Preview buttons

4. **3D Preview**
   - Header với "Quay về Dashboard"
   - 3D book viewer
   - Order button

5. **Checkout**
   - Header với "Quay về Dashboard"
   - Shipping info
   - Payment options

6. **Payment Success**
   - Header với "Quay về Dashboard"
   - Success message
   - "Quay về Dashboard" button

---

## 🔄 Navigation Logic

### App.tsx - Main Routing

```tsx
const renderScreen = () => {
  // Public screens
  if (currentScreen === 'landing') {
    return <LandingPage onLogin={...} onGetStarted={...} />;
  }

  if (currentScreen === 'login') {
    return <LoginRegister onLogin={handleLogin} />;
  }

  // Protected screens - require authentication
  if (!user) {
    return null; // Block access if not authenticated
  }

  // Wrap all authenticated screens with AppLayout
  const content = (() => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard ... />;
      case 'create-wizard':
        return <CreateWizard ... />;
      case 'editor':
        return <BookEditor ... />;
      // ... other protected screens
    }
  })();

  return (
    <AppLayout
      user={user}
      onLogout={handleLogout}
      onBackToDashboard={handleBackToDashboard}
      showBackButton={currentScreen !== 'dashboard'}
    >
      {content}
    </AppLayout>
  );
};
```

---

## 🎨 UI/UX Principles

### Auth Layout
- **Background:** Gradient pastel (pink-100, purple-100, blue-100)
- **Form card:** White, rounded-3xl, shadow-2xl
- **Logo:** Gradient icon + Bookify text
- **Spacing:** Generous padding and margins
- **Mobile:** Center aligned, full-width form

### App Layout
- **Header:** White background, sticky top, shadow-sm
- **Logo:** Clickable, returns to Dashboard
- **User menu:** Avatar + name/email + dropdown
- **Content area:** Gradient background, container-custom
- **Mobile:** Responsive, hamburger menu if needed

---

## 🚀 Benefits of This Architecture

1. **Clear Separation of Concerns**
   - Public vs Authenticated screens are clearly separated
   - No confusion about what users can access

2. **Security**
   - Protected screens require authentication
   - No accidental exposure of features

3. **Consistent UX**
   - All authenticated pages have same header
   - Login is clearly a standalone experience

4. **Easy Maintenance**
   - Change AppLayout → affects all authenticated pages
   - Auth pages are independent

5. **Better Performance**
   - Only load AppLayout components when authenticated
   - Lazy loading potential for protected features

---

## 📝 Component Hierarchy

```
App.tsx
├── Landing Page (Public)
│   └── Own header with simple navigation
│
├── Login Page (Public - Auth Layout)
│   └── Standalone form, no shared header
│
└── Authenticated Pages (Protected - App Layout)
    ├── AppLayout (Wrapper)
    │   ├── Header
    │   │   ├── Logo
    │   │   ├── Back to Dashboard button
    │   │   └── User Menu
    │   └── Main Content Area
    │
    ├── Dashboard
    ├── Create Wizard
    ├── Editor
    ├── 3D Preview
    ├── Checkout
    └── Payment Success
```

---

## 🔧 Development Guidelines

### When adding a new protected page:

1. Create the page component (e.g., `NewPage.tsx`)
2. Import it in `App.tsx`
3. Add it to the `renderScreen()` switch case
4. It will automatically be wrapped in AppLayout
5. Header navigation appears automatically

### When adding a new public page:

1. Create the page component
2. Add it to `renderScreen()` before the `if (!user)` check
3. Design its own navigation/header as needed
4. No AppLayout wrapper

---

## 📊 File Structure

```
/components
  ├── AppLayout.tsx          # Header wrapper for authenticated pages
  ├── LoginRegister.tsx      # Standalone auth page (no header)
  ├── Dashboard.tsx          # Protected - no own header
  ├── CreateWizard.tsx       # Protected - no own header
  ├── BookEditor.tsx         # Protected - no own header
  ├── Book3DPreview.tsx      # Protected - no own header
  ├── Checkout.tsx           # Protected - no own header
  ├── PaymentSuccess.tsx     # Protected - no own header
  └── LandingPage.tsx        # Public - own header

/App.tsx                     # Main routing logic
```

---

## ✅ Verification Checklist

- [ ] Login page is completely standalone (no header/navigation)
- [ ] All authenticated pages have AppLayout wrapper
- [ ] Header shows user info only when authenticated
- [ ] "Back to Dashboard" button appears on non-Dashboard pages
- [ ] Logout button works and returns to Landing
- [ ] Clicking logo returns to Dashboard (when authenticated)
- [ ] Guest users cannot access protected screens
- [ ] Flow: Landing → Login → Dashboard → Features
