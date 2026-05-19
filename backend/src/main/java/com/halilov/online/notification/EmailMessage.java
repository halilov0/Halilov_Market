package com.halilov.online.notification;

import java.util.List;

public record EmailMessage(
    String toEmail,
    String toName,
    String subject,
    String htmlBody,
    List<String> bcc
) {
    public EmailMessage(String toEmail, String toName, String subject, String htmlBody) {
        this(toEmail, toName, subject, htmlBody, List.of());
    }
}
