-- Delivery method on orders.
-- COURIER = שליח עד הבית (requires shipping address)
-- PICKUP  = איסוף עצמי מנקודת איסוף (no address, always free)

ALTER TABLE orders
    ADD COLUMN delivery_method VARCHAR(16) NOT NULL DEFAULT 'COURIER',
    ADD CONSTRAINT orders_delivery_method_chk
        CHECK (delivery_method IN ('COURIER','PICKUP'));
