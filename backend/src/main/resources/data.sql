-- Coupon seeding is now handled programmatically by CouponDataSeeder.java to support both H2 and PostgreSQL.
-- This dummy query is kept to prevent "script must not be null or empty" errors on Spring Boot startup.
SELECT 1;
