package com.halilov.online.notification;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class StockNotificationController {

    private final StockNotificationService service;

    public StockNotificationController(StockNotificationService service) {
        this.service = service;
    }

    @PostMapping("/{id}/stock-notify")
    public ResponseEntity<Void> subscribe(
        @PathVariable Long id,
        @RequestBody StockNotificationDtos.SubscribeRequest req
    ) {
        service.subscribe(id, req == null ? null : req.email());
        return ResponseEntity.accepted().build();
    }
}
