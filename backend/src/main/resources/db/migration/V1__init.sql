-- Halilov Market V1: core schema
-- Prices stored in agorot (integer) to avoid float drift. VAT 18% inclusive.

CREATE TABLE users (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    phone           VARCHAR(32),
    role            VARCHAR(32) NOT NULL DEFAULT 'CUSTOMER',
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT users_role_chk CHECK (role IN ('CUSTOMER','ADMIN'))
);

CREATE TABLE categories (
    id              BIGSERIAL PRIMARY KEY,
    slug            VARCHAR(128) NOT NULL UNIQUE,
    name_he         VARCHAR(255) NOT NULL,
    parent_id       BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    sort_order      INT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE products (
    id              BIGSERIAL PRIMARY KEY,
    sku             VARCHAR(64) NOT NULL UNIQUE,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    name_he         VARCHAR(255) NOT NULL,
    description_he  TEXT,
    category_id     BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    price_agorot    INT NOT NULL CHECK (price_agorot >= 0),
    stock_qty       INT NOT NULL DEFAULT 0 CHECK (stock_qty >= 0),
    image_url       VARCHAR(1024),
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active   ON products(active);

CREATE TABLE addresses (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name       VARCHAR(255) NOT NULL,
    phone           VARCHAR(32) NOT NULL,
    street          VARCHAR(255) NOT NULL,
    house_no        VARCHAR(32),
    apartment       VARCHAR(32),
    city            VARCHAR(128) NOT NULL,
    postal_code     VARCHAR(16),
    notes           VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

CREATE TABLE orders (
    id                  BIGSERIAL PRIMARY KEY,
    order_number        VARCHAR(32) NOT NULL UNIQUE,
    user_id             BIGINT REFERENCES users(id) ON DELETE SET NULL,
    status              VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    subtotal_agorot     INT NOT NULL CHECK (subtotal_agorot >= 0),
    shipping_agorot     INT NOT NULL DEFAULT 0 CHECK (shipping_agorot >= 0),
    vat_agorot          INT NOT NULL CHECK (vat_agorot >= 0),
    total_agorot        INT NOT NULL CHECK (total_agorot >= 0),
    shipping_address_id BIGINT REFERENCES addresses(id) ON DELETE SET NULL,
    payment_ref         VARCHAR(128),
    invoice_number      VARCHAR(64),
    tracking_number     VARCHAR(128),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    paid_at             TIMESTAMPTZ,
    CONSTRAINT orders_status_chk CHECK (status IN
        ('PENDING','PAID','FULFILLED','SHIPPED','DELIVERED','CANCELLED','REFUNDED'))
);

CREATE INDEX idx_orders_user   ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);

CREATE TABLE order_items (
    id              BIGSERIAL PRIMARY KEY,
    order_id        BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id      BIGINT NOT NULL REFERENCES products(id),
    name_he         VARCHAR(255) NOT NULL,
    sku             VARCHAR(64) NOT NULL,
    unit_price_agorot INT NOT NULL CHECK (unit_price_agorot >= 0),
    quantity        INT NOT NULL CHECK (quantity > 0),
    line_total_agorot INT NOT NULL CHECK (line_total_agorot >= 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
