package com.halilov.online.notification;

/**
 * Low-level email delivery channel. One impl is active at a time, picked
 * by {@code app.email.provider}. Implementations throw on failure — the
 * caller ({@link EmailService}) owns retry/persistence via the outbox.
 */
public interface EmailTransport {

    void send(EmailMessage message) throws Exception;
}
