package com.halilov.market.payment;

public final class PaymentDtos {

    public record InitiateResponse(
        String provider,
        String redirectUrl,
        String orderNumber
    ) {}

    public record MockCompleteRequest(String outcome) {}

    private PaymentDtos() {}
}
