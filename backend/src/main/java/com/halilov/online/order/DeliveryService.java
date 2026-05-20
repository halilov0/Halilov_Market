package com.halilov.online.order;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Computes shipping cost server-side. The checkout UI also previews these
 * numbers via {@link #quote}, but {@link #priceFor} is the source of truth
 * — orders never trust client-sent shipping amounts.
 */
@Service
public class DeliveryService {

    private final int courierFlatAgorot;
    private final int freeAboveAgorot;
    private final String pickupAddress;
    private final String pickupHours;
    private final String pickupPhone;

    public DeliveryService(
        @Value("${app.delivery.courierFlatAgorot:1990}") int courierFlatAgorot,
        @Value("${app.delivery.freeAboveAgorot:30000}") int freeAboveAgorot,
        @Value("${app.delivery.pickup.address:}") String pickupAddress,
        @Value("${app.delivery.pickup.hours:}") String pickupHours,
        @Value("${app.delivery.pickup.phone:}") String pickupPhone
    ) {
        this.courierFlatAgorot = courierFlatAgorot;
        this.freeAboveAgorot = freeAboveAgorot;
        this.pickupAddress = pickupAddress;
        this.pickupHours = pickupHours;
        this.pickupPhone = pickupPhone;
    }

    public int priceFor(DeliveryMethod method, int subtotalAgorot) {
        return switch (method) {
            case PICKUP -> 0;
            case COURIER -> subtotalAgorot >= freeAboveAgorot ? 0 : courierFlatAgorot;
        };
    }

    public DeliveryDtos.Quote quote(int subtotalAgorot) {
        return new DeliveryDtos.Quote(
            List.of(
                new DeliveryDtos.Option(
                    DeliveryMethod.COURIER,
                    "שליח עד הבית",
                    "אספקה תוך 3-5 ימי עסקים",
                    priceFor(DeliveryMethod.COURIER, subtotalAgorot),
                    courierFlatAgorot,
                    freeAboveAgorot
                ),
                new DeliveryDtos.Option(
                    DeliveryMethod.PICKUP,
                    "איסוף עצמי",
                    pickupAddress.isBlank() ? "פרטים יישלחו במייל" : pickupAddress,
                    0, 0, 0
                )
            ),
            new DeliveryDtos.PickupInfo(pickupAddress, pickupHours, pickupPhone)
        );
    }
}
