-- Halilov Market V3: promo codes / coupons.
-- PERCENT: value is whole percent (1-100) of subtotal.
-- FIXED:   value is agorot off the subtotal.
-- Discount caps at subtotal (never goes negative). VAT recalculated from
-- (subtotal - discount + shipping) so books stay correct.

CREATE TABLE coupons (
    id                   BIGSERIAL PRIMARY KEY,
    code                 VARCHAR(64)  NOT NULL UNIQUE,
    type                 VARCHAR(16)  NOT NULL,
    value                INT          NOT NULL CHECK (value > 0),
    min_subtotal_agorot  INT          NOT NULL DEFAULT 0 CHECK (min_subtotal_agorot >= 0),
    max_uses             INT,                              -- NULL = unlimited
    used_count           INT          NOT NULL DEFAULT 0 CHECK (used_count >= 0),
    expires_at           TIMESTAMPTZ,
    active               BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at           TIMESTAMPTZ  NOT NULL DEFAULT now(),
    CONSTRAINT coupons_type_chk CHECK (type IN ('PERCENT','FIXED')),
    CONSTRAINT coupons_percent_range_chk
        CHECK (type <> 'PERCENT' OR (value BETWEEN 1 AND 100))
);

CREATE INDEX idx_coupons_active ON coupons(active);

ALTER TABLE orders
    ADD COLUMN discount_agorot INT NOT NULL DEFAULT 0 CHECK (discount_agorot >= 0),
    ADD COLUMN coupon_code     VARCHAR(64);
