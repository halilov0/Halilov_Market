-- Halilov Market V2: transactional-email outbox.
-- Every email send is persisted before delivery so 429s / outages / crashes
-- don't drop important mail (e.g. order confirmations). A scheduled retry
-- worker drains PENDING rows.

CREATE TABLE email_outbox (
    id              BIGSERIAL PRIMARY KEY,
    to_email        VARCHAR(255) NOT NULL,
    to_name         VARCHAR(255),
    subject         VARCHAR(512) NOT NULL,
    html_body       TEXT NOT NULL,
    bcc             TEXT,                            -- comma-joined list, may be NULL
    status          VARCHAR(16)  NOT NULL DEFAULT 'PENDING',
    attempts        INT          NOT NULL DEFAULT 0,
    last_error      TEXT,
    created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
    last_attempt_at TIMESTAMPTZ,
    sent_at         TIMESTAMPTZ,
    CONSTRAINT email_outbox_status_chk CHECK (status IN ('PENDING','SENT','FAILED'))
);

CREATE INDEX idx_email_outbox_status_created
    ON email_outbox (status, created_at)
    WHERE status = 'PENDING';
