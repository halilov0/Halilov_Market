package com.halilov.online.notification;

public final class StockNotificationDtos {
    private StockNotificationDtos() {}

    public record SubscribeRequest(String email) {}
}
