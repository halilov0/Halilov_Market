-- Marketing consent + one-click unsubscribe tokens.
-- Default FALSE = explicit opt-in only (GDPR/IL spam law safe).

ALTER TABLE users
    ADD COLUMN marketing_opt_in        BOOLEAN     NOT NULL DEFAULT FALSE,
    ADD COLUMN marketing_consent_at    TIMESTAMPTZ,
    ADD COLUMN unsubscribe_token       VARCHAR(64) UNIQUE;

CREATE INDEX idx_users_marketing_opt_in ON users(marketing_opt_in) WHERE marketing_opt_in = TRUE;
