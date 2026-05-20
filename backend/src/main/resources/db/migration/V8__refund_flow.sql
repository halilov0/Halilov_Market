-- Cancellation + refund tracking on orders.
-- IL חוק הגנת הצרכן: 14-day cooling-off window, partial refunds allowed
-- (max cancellation fee = 5% of order or 100 ILS, whichever lower).

ALTER TABLE orders
    ADD COLUMN cancelled_at         TIMESTAMPTZ,
    ADD COLUMN cancellation_reason  VARCHAR(500),
    ADD COLUMN cancelled_by         VARCHAR(16),
    ADD COLUMN refunded_at          TIMESTAMPTZ,
    ADD COLUMN refund_amount_agorot INT CHECK (refund_amount_agorot IS NULL OR refund_amount_agorot >= 0),
    ADD CONSTRAINT orders_cancelled_by_chk
        CHECK (cancelled_by IS NULL OR cancelled_by IN ('CUSTOMER','ADMIN','SYSTEM'));
