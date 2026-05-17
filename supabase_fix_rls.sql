-- =====================================================
-- FIX RLS POLICY CHO DỰ ÁN DEARBOOK
-- Chạy file SQL này trong Supabase Dashboard > SQL Editor
-- URL: https://supabase.com/dashboard/project/zncvhhibbnpcihsualen/sql/new
-- =====================================================

-- =====================================================
-- BẢNG CÔNG KHAI (public read)
-- =====================================================

-- 1. book_categories - ai cũng được xem danh mục
ALTER TABLE public.book_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read book_categories" ON public.book_categories;
CREATE POLICY "Allow public read book_categories"
ON public.book_categories FOR SELECT TO public USING (true);

-- 2. book_templates - ai cũng được xem mẫu sách
ALTER TABLE public.book_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read book_templates" ON public.book_templates;
CREATE POLICY "Allow public read book_templates"
ON public.book_templates FOR SELECT TO public USING (true);

-- 3. template_pages - ai cũng được xem trang mẫu
ALTER TABLE public.template_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read template_pages" ON public.template_pages;
CREATE POLICY "Allow public read template_pages"
ON public.template_pages FOR SELECT TO public USING (true);

-- =====================================================
-- BẢNG NGƯỜI DÙNG (chỉ xem/sửa dữ liệu của mình)
-- =====================================================

-- 4. profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- 5. user_books
ALTER TABLE public.user_books ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own user_books" ON public.user_books;
CREATE POLICY "Users can read own user_books"
ON public.user_books FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own user_books" ON public.user_books;
CREATE POLICY "Users can insert own user_books"
ON public.user_books FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own user_books" ON public.user_books;
CREATE POLICY "Users can update own user_books"
ON public.user_books FOR UPDATE TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own user_books" ON public.user_books;
CREATE POLICY "Users can delete own user_books"
ON public.user_books FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 6. user_book_pages
ALTER TABLE public.user_book_pages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own user_book_pages" ON public.user_book_pages;
CREATE POLICY "Users can read own user_book_pages"
ON public.user_book_pages FOR SELECT TO authenticated
USING (auth.uid() = (SELECT user_id FROM public.user_books WHERE id = book_id));

DROP POLICY IF EXISTS "Users can insert own user_book_pages" ON public.user_book_pages;
CREATE POLICY "Users can insert own user_book_pages"
ON public.user_book_pages FOR INSERT TO authenticated
WITH CHECK (auth.uid() = (SELECT user_id FROM public.user_books WHERE id = book_id));

DROP POLICY IF EXISTS "Users can update own user_book_pages" ON public.user_book_pages;
CREATE POLICY "Users can update own user_book_pages"
ON public.user_book_pages FOR UPDATE TO authenticated
USING (auth.uid() = (SELECT user_id FROM public.user_books WHERE id = book_id));

DROP POLICY IF EXISTS "Users can delete own user_book_pages" ON public.user_book_pages;
CREATE POLICY "Users can delete own user_book_pages"
ON public.user_book_pages FOR DELETE TO authenticated
USING (auth.uid() = (SELECT user_id FROM public.user_books WHERE id = book_id));

-- 7. user_uploads
ALTER TABLE public.user_uploads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own user_uploads" ON public.user_uploads;
CREATE POLICY "Users can read own user_uploads"
ON public.user_uploads FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own user_uploads" ON public.user_uploads;
CREATE POLICY "Users can insert own user_uploads"
ON public.user_uploads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own user_uploads" ON public.user_uploads;
CREATE POLICY "Users can delete own user_uploads"
ON public.user_uploads FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 8. orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
CREATE POLICY "Users can read own orders"
ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
CREATE POLICY "Users can insert own orders"
ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
CREATE POLICY "Users can update own orders"
ON public.orders FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 9. order_shipping
ALTER TABLE public.order_shipping ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own order_shipping" ON public.order_shipping;
CREATE POLICY "Users can read own order_shipping"
ON public.order_shipping FOR SELECT TO authenticated
USING (auth.uid() = (SELECT user_id FROM public.orders WHERE id = order_id));

DROP POLICY IF EXISTS "Users can insert own order_shipping" ON public.order_shipping;
CREATE POLICY "Users can insert own order_shipping"
ON public.order_shipping FOR INSERT TO authenticated
WITH CHECK (auth.uid() = (SELECT user_id FROM public.orders WHERE id = order_id));

-- 10. payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own payments" ON public.payments;
CREATE POLICY "Users can read own payments"
ON public.payments FOR SELECT TO authenticated
USING (auth.uid() = (SELECT user_id FROM public.orders WHERE id = order_id));

DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
CREATE POLICY "Users can insert own payments"
ON public.payments FOR INSERT TO authenticated
WITH CHECK (auth.uid() = (SELECT user_id FROM public.orders WHERE id = order_id));
