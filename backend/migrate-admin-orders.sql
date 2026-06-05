-- Migration: Add admin order fields to orders table
-- Run this manually on production Supabase PostgreSQL before deploying the new backend version
-- Dev: spring.jpa.hibernate.ddl-auto=update will handle this automatically

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS customer_name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS note TEXT,
  ADD COLUMN IF NOT EXISTS collection_name TEXT,
  ADD COLUMN IF NOT EXISTS product_type TEXT,
  ADD COLUMN IF NOT EXISTS product_size TEXT,
  ADD COLUMN IF NOT EXISTS custom_pages INTEGER,
  ADD COLUMN IF NOT EXISTS selected_page_ids JSONB;

ALTER TABLE order_shipping
  ADD COLUMN IF NOT EXISTS district TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS pdf_file_name TEXT,
  ADD COLUMN IF NOT EXISTS pdf_file_data TEXT;

-- Add CASCADE DELETE for payments → orders (must drop & recreate FK)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'payments_order_id_fkey' AND table_name = 'payments'
  ) THEN
    ALTER TABLE payments DROP CONSTRAINT payments_order_id_fkey;
  END IF;
END $$;
ALTER TABLE payments ADD CONSTRAINT payments_order_id_fkey
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
