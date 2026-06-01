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
  ADD COLUMN IF NOT EXISTS custom_pages INTEGER;

ALTER TABLE order_shipping
  ADD COLUMN IF NOT EXISTS email TEXT;
