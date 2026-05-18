-- Halilov Market V5: customer-owned address book.
-- `addresses` keeps a per-order snapshot. `saved_addresses` is the user's
-- managed list — picked from in checkout, edited from the profile page.
-- Exactly one row per user may have is_default = TRUE (enforced via partial index).

CREATE TABLE saved_addresses (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label           VARCHAR(64),
    full_name       VARCHAR(255) NOT NULL,
    phone           VARCHAR(32)  NOT NULL,
    street          VARCHAR(255) NOT NULL,
    house_no        VARCHAR(32),
    apartment       VARCHAR(32),
    city            VARCHAR(128) NOT NULL,
    postal_code     VARCHAR(16),
    notes           VARCHAR(500),
    is_default      BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_saved_addresses_user ON saved_addresses(user_id);

-- Only one default per user
CREATE UNIQUE INDEX idx_saved_addresses_one_default
    ON saved_addresses(user_id) WHERE is_default = TRUE;
