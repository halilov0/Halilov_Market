package com.halilov.online.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

/**
 * Outbox-backed email sender. Every send is persisted to {@code email_outbox}
 * before an attempt is made, so 429s / Brevo outages / VM restarts cannot
 * silently drop important mail. {@link #retryPending()} drains stuck rows.
 *
 * Capacity math (Brevo free tier = 300/day):
 *   RETRY_INTERVAL_MS = 30 min → MAX_ATTEMPTS = 96 covers ~48h of retries.
 *   Daily limit resets every 24h, so any rate-limited send gets a real
 *   shot on the next quota window.
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private static final int MAX_ATTEMPTS = 96;
    private static final long RETRY_INTERVAL_MS = 30L * 60L * 1000L;
    private static final int RETRY_BATCH = 25;
    private static final int ERROR_TRUNCATE = 1000;

    private final EmailTransport transport;
    private final EmailOutboxRepository repo;

    public EmailService(EmailTransport transport, EmailOutboxRepository repo) {
        this.transport = transport;
        this.repo = repo;
    }

    @Transactional
    public void send(EmailMessage msg) {
        EmailOutbox row = persistPending(msg);
        attemptDelivery(row);
    }

    @Scheduled(fixedDelay = RETRY_INTERVAL_MS, initialDelay = 60_000L)
    @Transactional
    public void retryPending() {
        Instant cutoff = Instant.now().minusMillis(RETRY_INTERVAL_MS);
        List<EmailOutbox> rows = repo.findRetryable(
            EmailOutboxStatus.PENDING, cutoff,
            PageRequest.of(0, RETRY_BATCH)
        );
        if (rows.isEmpty()) return;
        log.info("[email:retry] picked {} pending row(s)", rows.size());
        for (EmailOutbox r : rows) {
            if (r.getAttempts() >= MAX_ATTEMPTS) {
                r.setStatus(EmailOutboxStatus.FAILED);
                repo.save(r);
                log.warn("[email:retry] giving up id={} attempts={} lastError={}",
                    r.getId(), r.getAttempts(), r.getLastError());
                continue;
            }
            attemptDelivery(r);
        }
    }

    private EmailOutbox persistPending(EmailMessage msg) {
        EmailOutbox row = new EmailOutbox();
        row.setToEmail(msg.toEmail());
        row.setToName(msg.toName());
        row.setSubject(msg.subject());
        row.setHtmlBody(msg.htmlBody());
        row.setBcc(msg.bcc() == null || msg.bcc().isEmpty() ? null : String.join(",", msg.bcc()));
        return repo.save(row);
    }

    private void attemptDelivery(EmailOutbox row) {
        row.setAttempts(row.getAttempts() + 1);
        row.setLastAttemptAt(Instant.now());
        try {
            transport.send(toMessage(row));
            row.setStatus(EmailOutboxStatus.SENT);
            row.setSentAt(Instant.now());
            row.setLastError(null);
            log.debug("[email:outbox] sent id={} to={} subject={}",
                row.getId(), row.getToEmail(), row.getSubject());
        } catch (Exception e) {
            row.setLastError(truncate(e.toString()));
            if (row.getAttempts() >= MAX_ATTEMPTS) {
                row.setStatus(EmailOutboxStatus.FAILED);
            }
            log.warn("[email:outbox] attempt {} failed id={} to={} err={}",
                row.getAttempts(), row.getId(), row.getToEmail(), e.toString());
        }
        repo.save(row);
    }

    private EmailMessage toMessage(EmailOutbox row) {
        List<String> bcc = row.getBcc() == null || row.getBcc().isBlank()
            ? List.of() : Arrays.asList(row.getBcc().split(","));
        return new EmailMessage(
            row.getToEmail(), row.getToName(),
            row.getSubject(), row.getHtmlBody(),
            bcc
        );
    }

    private static String truncate(String s) {
        if (s == null) return null;
        return s.length() <= ERROR_TRUNCATE ? s : s.substring(0, ERROR_TRUNCATE);
    }
}
