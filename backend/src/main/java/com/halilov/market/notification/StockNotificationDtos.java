package com.halilov.market.notification;

public final class StockNotificationDtos {
    private StockNotificationDtos() {}

    public record SubscribeRequest(String email) {}
}
