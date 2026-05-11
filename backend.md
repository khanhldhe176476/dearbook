# 🗺️ DearBook - Lộ Trình Phát Triển Backend (Backend Developer Roadmap)

Chào mừng bạn tham gia vào dự án DearBook với vai trò Backend Developer! Dựa trên phân tích kiến trúc hiện tại từ file `DOCS_PROJECT.md`, hệ thống đang hoạt động hoàn toàn ở phía Frontend với dữ liệu được lưu trữ tạm thời qua `localStorage` và nhiều tính năng chỉ đang là mock (giả lập). 

Để biến DearBook thành một ứng dụng web hoàn chỉnh, có khả năng mở rộng và sẵn sàng cho môi trường production, dưới đây là lộ trình chi tiết dành cho bạn:

---

## 🎯 Giai Đoạn 1: Lựa Chọn Tech Stack & Thiết Kế Cơ Sở Dữ Liệu (Tuần 1-2)

Mục tiêu đầu tiên là xác định công nghệ và xây dựng nền móng dữ liệu (Database Schema) để thay thế hoàn toàn cấu trúc JSON hiện tại trong `localStorage`.

### 1.1 Lựa chọn Tech Stack
- **Ngôn ngữ / Framework**: Node.js với Express hoặc NestJS (NestJS khuyến nghị để dự án dễ scale, code chặt chẽ bằng TypeScript).
- **Cơ sở dữ liệu**: PostgreSQL (rất phù hợp với cấu trúc dữ liệu quan hệ của Users, Books, Orders). Có thể dùng Prisma hoặc TypeORM làm ORM.
- **Cloud Storage**: AWS S3 hoặc Cloudinary để lưu trữ hình ảnh (assets) của người dùng.
- *(Tùy chọn nhanh)*: Sử dụng BaaS (Backend-as-a-Service) như **Supabase** hoặc **Firebase** nếu muốn triển khai cực nhanh các tính năng Auth và CRUD cơ bản.

### 1.2 Thiết Kế Database (Entity-Relationship)
Dựa trên các interface hiện có (`User`, `BookData`, `PageData`), bạn cần thiết kế các tables chính:
- **Users**: `id`, `email`, `password_hash`, `name`, `avatar_url`, `created_at`.
- **Books**: `id`, `user_id` (FK), `title`, `theme`, `template_id`, `status` (draft/completed), `cover_type`, `created_at`, `updated_at`.
- **Pages**: `id`, `book_id` (FK), `page_number`, `background_color`, `background_image_url`.
- **Elements** (Nội dung từng trang): `id`, `page_id` (FK), `type` (text/image/shape/...), `properties` (lưu JSON các thuộc tính như x, y, width, style).
- **Assets / Images**: Quản lý ảnh do user upload (`id`, `user_id`, `image_url`, `size_kb`, `created_at`).
- **Orders**: `id`, `user_id` (FK), `book_id` (FK), `shipping_info` (JSON), `total_price`, `payment_status`, `payment_method`.

---

## 🔐 Giai Đoạn 2: Xác Thực & Quản Lý Người Dùng (Tuần 3)

Thay thế cơ chế "mock login" hiện tại bằng hệ thống Authentication bảo mật.

### 2.1 Xây dựng API Authentication
- Xây dựng API `/auth/register` và `/auth/login`.
- Triển khai **JWT (JSON Web Token)** để bảo mật các phiên đăng nhập.
- Cấu hình Refresh Token để giữ user đăng nhập trong thời gian dài.

### 2.2 Tích hợp Social Login (Ưu tiên)
- Tích hợp OAuth 2.0: Đăng nhập bằng Google (rất quan trọng cho các ứng dụng B2C như DearBook).

### 2.3 Quản lý Profile
- API `/users/profile` để Get/Update thông tin user (tên, avatar).

---

## 📦 Giai Đoạn 3: Quản Lý Sách & Cloud Storage (Tuần 4-5)

Đây là giai đoạn cốt lõi: Chuyển dịch toàn bộ logic lưu trữ từ trình duyệt của người dùng lên Server.

### 3.1 Xử Lý Lưu Trữ Hình Ảnh (Cloud Storage)
- **Vấn đề hiện tại**: Ảnh đang bị chuyển thành Base64 và nhồi vào `localStorage` gây phình dung lượng nhanh chóng và có giới hạn (~5MB).
- **Giải pháp backend**: 
  - Tạo API Upload ảnh: `/api/assets/upload`
  - Tích hợp Multer (Node.js) nhận file, nén lại nếu cần, sau đó đẩy lên **AWS S3 / Cloudinary**.
  - Trả về CDN URL cho Frontend sử dụng (thay thế các hàm trong `imageHelpers.ts`).

### 3.2 Xây dựng API Quản Lý Sách (Book CRUD)
- `GET /books`: Lấy danh sách sách của user (hỗ trợ pagination, filter, sort để thay thế hàm `loadBooks`).
- `POST /books`: Tạo sách mới (lưu template, theme mặc định).
- `GET /books/:id`: Lấy toàn bộ chi tiết một cuốn sách (thông tin, pages, elements) để load vào Editor.
- `PUT /books/:id`: Cập nhật sách. Cần lưu ý tối ưu API này, có thể dùng PATCH để chỉ cập nhật những trang/element bị thay đổi thay vì gửi toàn bộ cục data JSON lớn mỗi khi Auto-Save.
- `DELETE /books/:id`: Xóa sách (thực hiện soft-delete).
- `POST /books/:id/duplicate`: Nhấn bản sách.

---

## 💳 Giai Đoạn 4: Xử Lý Luồng Đặt Hàng & Thanh Toán (Tuần 6)

Phần Checkout/OrderFlow hiện tại đang là Mock. Cần xây dựng logic xử lý tiền thật.

### 4.1 API Giỏ hàng & Đơn hàng
- `POST /orders`: Tạo đơn hàng mới từ một BookID, nhận thông tin giao hàng từ Frontend, tính toán tổng tiền trên backend (base price + page price + shipping) để tránh bị sửa đổi từ phía client.

### 4.2 Tích hợp Cổng Thanh Toán (Payment Gateways)
- **Thị trường Việt Nam**: Tích hợp VNPay, MoMo, hoặc ZaloPay API.
- Xây dựng Webhook/IPN URL (`/api/payments/webhook`) để nhận callback từ cổng thanh toán, tự động cập nhật `payment_status` sang "paid" và gửi email xác nhận.
- Cấu hình mã giảm giá (Coupons/Vouchers logic).

---

## 🚀 Giai Đoạn 5: Tính Năng Mở Rộng & Tối Ưu Hóa (Tuần 7-8)

Sau khi hệ thống cơ bản chạy ổn định, tiếp tục phát triển các tính năng nâng cao được đề xuất trong docs.

### 5.1 Real-time Collaboration (Cùng chỉnh sửa)
- Triển khai **WebSocket (Socket.io)**.
- Xây dựng phòng (rooms) theo `book_id`.
- Broadcast các sự kiện (move element, edit text) cho những user đang xem chung cuốn sách.

### 5.2 Xử Lý Background Jobs
- **Render PDF phía Server**: Hiện tại PDF xuất qua thư viện `jsPDF` ở Frontend khá nặng máy client. Nếu muốn bản in chất lượng cao (print-ready, CMYK), cần gửi dữ liệu sách lên Backend, dùng Puppeteer hoặc các thư viện PDF engine để render và trả về link download.
- Sử dụng Message Queue (như RabbitMQ hoặc Redis BullMQ) để xử lý các tác vụ render nặng này trong background.

### 5.3 Tối Ưu API (Performance)
- Triển khai Redis Caching cho các API như `/books/templates`, `/assets` (những tài nguyên ít thay đổi).
- Cấu hình Rate Limiting để bảo vệ API chống spam/DDoS.

---

## 🛠️ Tóm Tắt Các Bước Hành Động Dành Cho Bạn Hôm Nay:

1. Thiết lập **Repository Backend riêng** (ví dụ: `dearbook-api`).
2. Khởi tạo project Node.js (Express/NestJS) + TypeScript.
3. Cài đặt PostgreSQL, thiết kế sơ đồ ERD dựa trên `App.BookData` và `types/editor.ts`.
4. Làm việc với Frontend dev để thống nhất lại cấu trúc JSON Request/Response (API Contract).
5. Bắt đầu code module Auth đầu tiên!

Chúc bạn thành công với việc "Backend-hóa" DearBook! 🚀
