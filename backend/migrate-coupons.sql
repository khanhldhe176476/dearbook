-- migrate-coupons.sql
-- Tạo bảng coupons và thêm cột vào orders để hỗ trợ mã giảm giá
-- Chạy: psql -U <user> -d <db> -f migrate-coupons.sql

-- 1. Tạo bảng coupons
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('FIXED', 'PERCENT')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount DECIMAL(10,2),
    usage_limit INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Thêm cột vào bảng orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0;

-- 3. Seed dữ liệu mẫu: 3 mã giảm giá
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_discount, usage_limit, starts_at, expires_at)
VALUES
    ('GIAM20K',  'FIXED',   20000, 0,      NULL, 100, '2026-01-01T00:00:00Z', '2027-12-31T23:59:59Z'),
    ('GIAM15',   'PERCENT', 15,    100000, 50000, 100, '2026-01-01T00:00:00Z', '2027-12-31T23:59:59Z'),
    ('GIAM20',   'PERCENT', 20,    200000, 80000, 50,  '2026-01-01T00:00:00Z', '2027-12-31T23:59:59Z')
ON CONFLICT (code) DO NOTHING;
