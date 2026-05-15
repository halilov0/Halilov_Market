package com.halilov.market.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.email.provider", havingValue = "log", matchIfMissing = true)
public class LogEmailTransport implements EmailTransport {

    private static final Logger log = LoggerFactory.getLogger(LogEmailTransport.class);

    @Override
    public void send(EmailMessage message) {
        log.info("[email:log] to={} ({}) subject={} bcc={} bodyLen={}",
            message.toEmail(), message.toName(), message.subject(),
            message.bcc(), message.htmlBody() == null ? 0 : message.htmlBody().length());
    }
}
