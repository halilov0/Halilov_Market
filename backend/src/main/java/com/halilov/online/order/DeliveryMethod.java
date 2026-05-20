package com.halilov.online.order;

public enum DeliveryMethod {
    /** Courier delivers to the buyer's address. Flat rate, free above threshold. */
    COURIER,
    /** Buyer collects from a configured pickup point. Always free, no shipping address. */
    PICKUP
}
