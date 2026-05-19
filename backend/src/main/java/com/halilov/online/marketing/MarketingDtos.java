package com.halilov.online.marketing;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class MarketingDtos {

    public record RecipientCount(long eligibleCount) {}

    public record BroadcastRequest(
        @NotBlank @Size(max = 255) String subject,
        @NotBlank @Size(max = 50_000) String htmlBody
    ) {}

    public record BroadcastResult(int queued, long eligibleCount) {}
}
