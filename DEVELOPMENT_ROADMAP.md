# 📋 DearBook — Kế Hoạch Phát Triển 3 Tuần

> **Ngày lập**: 2026-06-14  
> **Đội ngũ**: 3 Developers (A: Backend, B: Frontend, C: Full-stack)  
> **Thời gian**: 3 tuần (15 ngày làm việc)  
> **Mục tiêu**: Vá lỗ hổng → Auth thực → Refactor gấp → Deploy MVP an toàn

---

## 📐 Phân Công

| Dev | Vai trò | Trọng tâm |
|-----|---------|-----------|
| **Dev A** | Backend | Security, API, Auth, DB optimization |
| **Dev B** | Frontend | UI refactor, Router, merge components, integrate real API |
| **Dev C** | Full-stack / DevOps | Auth integration, data migration, Docker, CI/CD, deploy |

---

# TUẦN 1: 🔒 Security + Cleanup Khẩn Cấp
**Deadline**: Cuối ngày thứ 5

> Mục tiêu: Không còn lỗ hổng critical, codebase sẵn sàng để thêm tính năng.

## Dev A — Vá Backend Security (5 ngày)

| # | Task | Days | Priority |
|---|------|------|----------|
| A1 | **Fix BookController Auth Bypass** — bỏ `X-User-Id` header, dùng JWT `Authentication` principal. Thêm `.requestMatchers("/api/books/**").authenticated()` vào SecurityConfig | 1 | 🔴 |
| A2 | **Restrict CORS Origins** — thay `*` bằng domain cụ thể qua biến môi trường | 0.5 | 🔴 |
| A3 | **Remove Hardcoded JWT Secrets** — xóa default value, bắt buộc ENV, generate secret 512-bit, thêm startup validator từ chối secret < 256-bit | 0.5 | 🔴 |
| A4 | **Fix AuthService Error Handling** — phân biệt Google OAuth lỗi: token không hợp lệ → 401, network → 503 (không wrap hết vào RuntimeException) | 0.5 | 🟡 |
| A5 | **Fix OrderController getUserIdFromAuth()** — throw UnauthorizedException ngay nếu null thay vì trả về null âm thầm | 0.5 | 🟡 |
| A6 | **Fix ProfileService.findByEmail()** — xóa method full table scan, dùng trực tiếp `profileRepo.findByEmail()` | 0.5 | 🟡 |
| A7 | **Validate bookId trong BookService.updatePage()** — kiểm tra page thuộc đúng book, nếu không → throw 404 | 0.5 | 🟡 |
| A8 | **Add Database Indexes + @Transactional(readOnly=true)** — migration SQL cho các index thiếu, thêm annotation read-only cho tất cả GET methods | 1 | 🟡 |

## Dev B — Dọn Frontend (5 ngày)

| # | Task | Days | Priority |
|---|------|------|----------|
| B1 | **Pin Package Versions** — thay tất cả `"*"` trong package.json bằng version cụ thể, test build | 0.5 | 🟡 |
| B2 | **Xóa Component Rác** — `Test3DButton`, `TestCube`, `Simple3DTest`, `SimpleBook`, `CreateWizard` (nếu không dùng), `DesignFlow` (nếu bị thay thế) | 1 | 🟢 |
| B3 | **Gộp Editor Components (3→1)** — `AdvancedPageEditor` + `AdvancedPageEditorV2` + `ImprovedAdvancedEditor` → 1 editor với props `mode`. Xóa phiên bản cũ. | 2 | 🟡 |
| B4 | **Gộp 3D Preview Components (5→1)** — `Book3DPreview` + `Book3DOverviewPreview` + `Book3DViewer` + `InteractiveBook3D` + `InteractiveBook3DWithCurl` → `Book3DViewer` với prop `mode: 'showcase' | 'flip' | 'read' | 'interactive'` | 1.5 | 🟡 |

## Dev C — Infrastructure (5 ngày)

| # | Task | Days | Priority |
|---|------|------|----------|
| C1 | **Docker Healthchecks** — thêm healthcheck cho FE (curl /health) và BE (curl /actuator/health), xóa run-all.bat cũ | 0.5 | 🟢 |
| C2 | **Tách Template Data khỏi JS Bundle** — `templates.ts` (81KB), `templateBooks.ts` (62KB) → JSON files + API endpoint `/api/v1/public/templates` + IndexedDB cache | 1.5 | 🟡 |
| C3 | **API Client Module** — tạo `apiClient.ts` với Axios + JWT interceptor + auto refresh + global error handler (401→login, 500→toast) | 1.5 | 🟡 |
| C4 | **Consistent API Path Prefixes** — đồng bộ tất cả API về `/api/v1/`, cập nhật SecurityConfig + FE proxy | 1 | 🟢 |
| C5 | **Rate Limiting cho Public Endpoints** — auth endpoints 5 req/phút/IP, public endpoints 60 req/phút/IP (Bucket4j) | 0.5 | 🟢 |

---

# TUẦN 2: 🏗️ Auth + Router + Tích Hợp
**Deadline**: Cuối ngày thứ 10

> Mục tiêu: Auth thực, React Router, dữ liệu lưu trên backend thay vì localStorage.

## Dev A — Auth + API Nền Tảng (5 ngày)

| # | Task | Days | Priority |
|---|------|------|----------|
| A9 | **Supabase Auth Integration (Backend)** — verify Supabase JWT thay vì JWT tự tạo, sync với `AuthService`, giữ nguyên cấu trúc `UserPrincipal` | 2 | 🔴 |
| A10 | **API Response Standards** — tạo `ApiResponse<T>` wrapper: `{ success, data, error: { code, message }, meta: { page, total } }`. Cập nhật tất cả controllers. | 1 | 🟡 |
| A11 | **Pagination + Input Validation** — thêm `Pageable` cho danh sách sách, templates, đơn hàng. `@Valid` + Bean Validation cho tất cả DTOs. | 1 | 🟡 |
| A12 | **CRUD Books API Hoàn Chỉnh** — `POST/GET/PUT/DELETE /api/v1/books`, authorization (chỉ chủ sở hữu), batch update pages | 1 | 🔴 |

## Dev B — Router + Refactor UI (5 ngày)

| # | Task | Days | Priority |
|---|------|------|----------|
| B5 | **React Router v6 Migration** — cài `react-router-dom`, route structure: `/`→HomePage, `/login`→LoginScreen, `/library`→Library, `/builder/:bookId?`→Builder, `/order/:bookId`→Order, `/preview/:bookId`→Reader. Layout components: `<PublicLayout>`, `<AppLayout>` | 2 | 🔴 |
| B6 | **Protected Routes + Auth Guard** — `<ProtectedRoute>` redirect về login nếu chưa auth, deep link support | 1 | 🟡 |
| B7 | **Gộp Checkout Components (2→1)** — `CheckoutModal` + `OrderFlow` → `CheckoutFlow` duy nhất | 1 | 🟢 |
| B8 | **Auto-Save Cải Tiến** — debounce 2s + save định kỳ 30s, sync indicator UI (đã lưu/đang lưu/lỗi) | 1 | 🟡 |

## Dev C — Data Migration + Auth (5 ngày)

| # | Task | Days | Priority |
|---|------|------|----------|
| C6 | **Supabase Auth Integration (Frontend)** — thay mock login bằng `supabase.auth.signInWithPassword()` / `signInWithOAuth()`. Tạo `AuthProvider.tsx` + `useAuth.ts` hook. Session manager + auto refresh token. | 2.5 | 🔴 |
| C7 | **Migration localStorage → IndexedDB + API** — tạo `storageService.ts` abstraction layer, `syncEngine.ts` offline queue. `useAutoSave` gọi API thay vì localStorage. Giữ localStorage cho auth token. | 2 | 🟡 |
| C8 | **Environment Config** — tách biệt 3 môi trường (dev/staging/prod), GitHub Secrets, `.env.example` đầy đủ | 0.5 | 🟡 |

---

# TUẦN 3: 🧪 Testing + Integration + Deploy
**Deadline**: Cuối ngày thứ 15

> Mục tiêu: Flow hoàn chỉnh FE-BE, test bảo mật, deploy staging.

## Dev A — Testing + Order Flow (5 ngày)

| # | Task | Days | Priority |
|---|------|------|----------|
| A13 | **Unit Tests cho Services** — `OrderService`, `BookService`, `AuthService`, `PricingService` (JUnit 5 + Mockito, target >80% coverage) | 2.5 | 🔴 |
| A14 | **Order API Hoàn Thiện** — validation đầy đủ, state machine, lưu shipping info, admin order management (list/detail/update status/delete) | 1.5 | 🔴 |
| A15 | **Fix N+1 Queries** — `OrderService.mapToAdminOrderResponse()` dùng JPQL fetch join thay vì gọi riêng lẻ shipping/payment/pages | 1 | 🟡 |

## Dev B — Integration + UI Polish (5 ngày)

| # | Task | Days | Priority |
|---|------|------|----------|
| B9 | **Kết Nối Frontend với Backend API** — Library, Builder, Order flow gọi API thực, bỏ toàn bộ mock data | 2 | 🔴 |
| B10 | **Image Upload Flow** — tích hợp S3 Presigned URL API: (1) gọi presigned-url → (2) upload trực tiếp → (3) confirm. Progress bar + retry. | 1.5 | 🟡 |
| B11 | **Error Boundary + Offline Fallback** — React Error Boundary cho từng section, thông báo "Bạn đang offline" + retry button | 1 | 🟡 |
| B12 | **Cross-Browser Test Nhanh** — Chrome/Firefox/Safari/Edge + mobile responsive check, fix các lỗi hiển thị | 0.5 | 🟡 |

## Dev C — CI/CD + Deploy (5 ngày)

| # | Task | Days | Priority |
|---|------|------|----------|
| C9 | **CI/CD Pipeline (GitHub Actions)** — PR check: build + test + lint. Main: build + push Docker image. Auto-deploy staging. | 2 | 🔴 |
| C10 | **Security Hardening** — HTTPS enforcement, security headers (HSTS, CSP, X-Frame-Options), file upload validation (size + type whitelist), dependency scan (`npm audit`, OWASP plugin) | 1.5 | 🔴 |
| C11 | **Production Deploy Staging** — Docker Compose production, domain + SSL, health check monitoring, DB backup cron | 1 | 🔴 |
| C12 | **User Acceptance Test** — test toàn bộ flow: đăng ký → tạo sách → chỉnh sửa → đặt hàng → admin xem đơn. Ghi nhận bug, tạo backlog cho tuần sau. | 0.5 | 🟡 |

---

# 📊 TỔNG HỢP

## Dev A — 15 ngày

```
T1: A1 ██ A2 █ A3 █ A4 █ A5 █ A6 █ A7 █ A8 ████████████████████████
T2: A9 ████████████ A10 ██████ A11 ██████ A12 ████████████████████████
T3: A13 ████████████████ A14 ██████████ A15 ████████████████████████████
```

| # | Task | Days | Tuần |
|---|------|------|------|
| A1 | Fix BookController Auth Bypass | 1 | 1 |
| A2 | Restrict CORS Origins | 0.5 | 1 |
| A3 | Remove Hardcoded JWT Secrets | 0.5 | 1 |
| A4 | Fix AuthService Error Handling | 0.5 | 1 |
| A5 | Fix getUserIdFromAuth() silent null | 0.5 | 1 |
| A6 | Fix ProfileService.findByEmail() | 0.5 | 1 |
| A7 | Validate bookId in updatePage() | 0.5 | 1 |
| A8 | DB Indexes + @Transactional(readOnly) | 1 | 1 |
| A9 | Supabase Auth Integration (BE) | 2 | 2 |
| A10 | API Response Standards | 1 | 2 |
| A11 | Pagination + Input Validation | 1 | 2 |
| A12 | CRUD Books API Hoàn Chỉnh | 1 | 2 |
| A13 | Unit Tests cho Services | 2.5 | 3 |
| A14 | Order API Hoàn Thiện | 1.5 | 3 |
| A15 | Fix N+1 Queries | 1 | 3 |

## Dev B — 15 ngày

```
T1: B1 ███ B2 ██████ B3 ████████████ B4 ███████████████████████████████
T2: B5 ████████████ B6 ██████ B7 ██████ B8 ███████████████████████████████
T3: B9 ████████████ B10 █████████ B11 ██████ B12 ███
```

| # | Task | Days | Tuần |
|---|------|------|------|
| B1 | Pin Package Versions | 0.5 | 1 |
| B2 | Xóa Component Rác | 1 | 1 |
| B3 | Gộp Editor Components (3→1) | 2 | 1 |
| B4 | Gộp 3D Preview Components (5→1) | 1.5 | 1 |
| B5 | React Router v6 Migration | 2 | 2 |
| B6 | Protected Routes + Auth Guard | 1 | 2 |
| B7 | Gộp Checkout Components (2→1) | 1 | 2 |
| B8 | Auto-Save Cải Tiến | 1 | 2 |
| B9 | Kết Nối FE với Backend API | 2 | 3 |
| B10 | Image Upload Flow (S3) | 1.5 | 3 |
| B11 | Error Boundary + Offline Fallback | 1 | 3 |
| B12 | Cross-Browser Test Nhanh | 0.5 | 3 |

## Dev C — 15 ngày

```
T1: C1 ███ C2 █████████ C3 █████████ C4 ██████ C5 ███
T2: C6 ████████████████ C7 ████████████ C8 ███
T3: C9 ████████████ C10 █████████ C11 ██████ C12 ███
```

| # | Task | Days | Tuần |
|---|------|------|------|
| C1 | Docker Healthchecks | 0.5 | 1 |
| C2 | Tách Template Data khỏi JS Bundle | 1.5 | 1 |
| C3 | API Client Module (Axios + JWT) | 1.5 | 1 |
| C4 | Consistent API Path Prefixes | 1 | 1 |
| C5 | Rate Limiting Public Endpoints | 0.5 | 1 |
| C6 | Supabase Auth Integration (FE) | 2.5 | 2 |
| C7 | Migration localStorage → IndexedDB + API | 2 | 2 |
| C8 | Environment Config (dev/staging/prod) | 0.5 | 2 |
| C9 | CI/CD Pipeline (GitHub Actions) | 2 | 3 |
| C10 | Security Hardening | 1.5 | 3 |
| C11 | Production Staging Deploy | 1 | 3 |
| C12 | User Acceptance Test | 0.5 | 3 |

---

# 🏷️ CHECKPOINTS CUỐI MỖI TUẦN

| Tuần | Checkpoint | Tiêu chí đạt |
|------|-----------|--------------|
| **1** | 🔒 Security Clear | 0 lỗ hổng critical, CORS restricted, JWT secrets từ ENV, API consistent `/api/v1/`, component rác đã xóa, editor + 3D đã gộp |
| **2** | 🔑 Auth + Router Ready | Đăng nhập/đăng ký thực qua Supabase, React Router hoạt động, protected routes, localStorage đã migrate sang API, template data tách khỏi bundle |
| **3** | 🚀 Staging Live | Flow hoàn chỉnh FE-BE, test coverage >80% BE services, CI/CD chạy, staging deploy thành công, security headers active |

---

# ⚠️ RỦI RO & GIẢI PHÁP

| Rủi ro | Giải pháp |
|--------|-----------|
| Supabase Auth migration phức tạp hơn dự kiến | Giữ JWT custom làm fallback tuần 2, chuyển Supabase tuần 3 |
| Merge components gây regression | Merge từng cặp, test ngay, giữ code cũ với `@deprecated` comment |
| Không kịp test hết cuối tuần 3 | Ưu tiên test security + order flow, còn lại → backlog tuần 4 |
| Thiếu người | Task của Dev B và Dev C có thể swap, mỗi task đều có doc trong code |

---

*Plan này ưu tiên **an toàn trước, tính năng sau**. Sau 3 tuần sẽ có MVP sạch, auth thực, deploy được. Các tính năng còn lại (payment thật, admin nâng cao, PWA, AI...) → backlog cho phase 2.*
