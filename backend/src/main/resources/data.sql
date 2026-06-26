-- Seed dữ liệu mã giảm giá (H2 database)
INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, max_discount, usage_limit, used_count, starts_at, expires_at, is_active, created_at)
SELECT RANDOM_UUID(), 'GIAM20K', 'FIXED',   20000, 0,      NULL, 100, 0, '2026-01-01 00:00:00+00', '2027-12-31 23:59:59+00', TRUE, NOW()
WHERE NOT EXISTS (SELECT 1 FROM coupons WHERE code = 'GIAM20K');

INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, max_discount, usage_limit, used_count, starts_at, expires_at, is_active, created_at)
SELECT RANDOM_UUID(), 'GIAM15',  'PERCENT', 15,    0,      50000, 100, 0, '2026-01-01 00:00:00+00', '2027-12-31 23:59:59+00', TRUE, NOW()
WHERE NOT EXISTS (SELECT 1 FROM coupons WHERE code = 'GIAM15');

INSERT INTO coupons (id, code, discount_type, discount_value, min_order_amount, max_discount, usage_limit, used_count, starts_at, expires_at, is_active, created_at)
SELECT RANDOM_UUID(), 'GIAM20',  'PERCENT', 20,    0,      80000, 50,  0, '2026-01-01 00:00:00+00', '2027-12-31 23:59:59+00', TRUE, NOW()
WHERE NOT EXISTS (SELECT 1 FROM coupons WHERE code = 'GIAM20');
