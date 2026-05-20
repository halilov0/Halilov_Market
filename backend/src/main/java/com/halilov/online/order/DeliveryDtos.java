package com.halilov.online.order;

import java.util.List;

public class DeliveryDtos {

    public record Option(
        DeliveryMethod method,
        String label,
        String description,
        int priceAgorot,
        int basePriceAgorot,
        int freeAboveAgorot
    ) {}

    public record PickupInfo(String address, String hours, String phone) {}

    public record Quote(List<Option> options, PickupInfo pickup) {}
}
