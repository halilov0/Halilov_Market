-- Halilov Market V4: multi-image gallery for products.
-- Stores extra image URLs as a TEXT column with newline-separated values.
-- The primary `image_url` stays unchanged for backwards compatibility and is
-- treated as the first/main image. `image_urls` holds additional gallery images.

ALTER TABLE products
    ADD COLUMN image_urls TEXT;
