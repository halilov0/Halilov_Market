-- Halilov V6: back-in-stock notification subscriptions.
-- A customer hits "notify me when back in stock" on a sold-out PDP. When the
-- product transitions from stockQty <= 0 to > 0, all pending rows for that
-- product are emailed (via the existing email_outbox) and stamped notified_at.
-- Partial unique index permits re-subscription after a previous notification.

CREATE TABLE stock_notifications (
    id          BIGSERIAL PRIMARY KEY,
    product_id  BIGINT       NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    email       VARCHAR(255) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    notified_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_stock_notifications_pending_unique
    ON stock_notifications (product_id, email)
    WHERE notified_at IS NULL;

CREATE INDEX idx_stock_notifications_product_pending
    ON stock_notifications (product_id)
    WHERE notified_at IS NULL;
