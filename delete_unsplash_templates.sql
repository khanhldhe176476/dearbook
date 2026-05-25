-- =====================================================
-- XÓA CÁC MẪU SÁCH SỬ DỤNG ẢNH UNSPLASH (MẪU RÁC)
-- Chạy file SQL này trong Supabase Dashboard > SQL Editor
-- =====================================================

-- 1. Xóa tất cả các trang thuộc về những mẫu sách dùng ảnh Unsplash
DELETE FROM public.template_pages
WHERE template_id IN (
  SELECT id FROM public.book_templates 
  WHERE cover_image_url LIKE '%unsplash%'
);

-- 2. Xóa các mẫu sách dùng ảnh Unsplash
DELETE FROM public.book_templates
WHERE cover_image_url LIKE '%unsplash%';

-- Lưu ý: Những mẫu local (Vintage, Hiện đại, Tối giản) dùng đường dẫn ảnh kiểu '/temp...' sẽ được giữ nguyên.
