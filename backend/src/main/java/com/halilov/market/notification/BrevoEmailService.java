package com.halilov.market.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@ConditionalOnProperty(name = "app.email.provider", havingValue = "brevo")
public class BrevoEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(BrevoEmailService.class);
    private static final String BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

    private final RestClient http;
    private final ObjectMapper mapper = new ObjectMapper();
    private final String fromEmail;
    private final String fromName;

    public BrevoEmailService(
        @Value("${app.email.brevo.apiKey:}") String apiKey,
        @Value("${app.email.fromEmail}") String fromEmail,
        @Value("${app.email.fromName}") String fromName
    ) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                "EMAIL_PROVIDER=brevo but BREVO_API_KEY is empty");
        }
        this.fromEmail = fromEmail;
        this.fromName = fromName;
        this.http = RestClient.builder()
            .baseUrl(BREVO_ENDPOINT)
            .defaultHeader("api-key", apiKey)
            .defaultHeader("accept", "application/json")
            .build();
    }

    @Override
    public void send(EmailMessage message) {
        Map<String, Object> sender = new LinkedHashMap<>();
        sender.put("email", fromEmail);
        sender.put("name", fromName);

        Map<String, Object> to = new LinkedHashMap<>();
        to.put("email", message.toEmail());
        if (message.toName() != null && !message.toName().isBlank()) {
            to.put("name", message.toName());
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("sender", sender);
        body.put("to", List.of(to));
        body.put("subject", message.subject());
        body.put("htmlContent", message.htmlBody());

        if (message.bcc() != null && !message.bcc().isEmpty()) {
            List<Map<String, Object>> bccList = new ArrayList<>();
            for (String b : message.bcc()) {
                if (b != null && !b.isBlank()) {
                    bccList.add(Map.of("email", b));
                }
            }
            if (!bccList.isEmpty()) body.put("bcc", bccList);
        }

        try {
            String payload = mapper.writeValueAsString(body);
            String response = http.post()
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(String.class);
            log.info("[email:brevo] sent to={} subject={} resp={}",
                message.toEmail(), message.subject(), response);
        } catch (Exception e) {
            log.warn("[email:brevo] send failed to={} subject={} err={}",
                message.toEmail(), message.subject(), e.toString());
        }
    }
}
