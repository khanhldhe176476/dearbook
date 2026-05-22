-- =====================================================
-- XÓA CÁC MẪU SÁCH (TEMPLATES) RÁC TRONG DATABASE
-- =====================================================

-- 1. Xóa tất cả các trang của mẫu sách (bảng template_pages)
DELETE FROM public.template_pages;

-- 2. Xóa tất cả các mẫu sách (bảng book_templates)
DELETE FROM public.book_templates;

-- Lưu ý: Nếu bạn gặp lỗi khi chạy lệnh này, có thể do bạn đã tạo một số cuốn sách 
-- (user_books) dựa trên các mẫu này. 
-- Nếu bạn muốn xóa LUÔN cả sách nháp của người dùng để làm sạch hoàn toàn:
-- Bỏ comment 2 dòng dưới đây và chạy lại:

-- DELETE FROM public.user_book_pages;
-- DELETE FROM public.user_books;
-- DELETE FROM public.template_pages;
-- DELETE FROM public.book_templates;
