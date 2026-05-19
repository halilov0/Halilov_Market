package com.halilov.online.marketing;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/marketing")
public class MarketingAdminController {

    private final MarketingService service;

    public MarketingAdminController(MarketingService service) {
        this.service = service;
    }

    @GetMapping("/recipients")
    public MarketingDtos.RecipientCount recipientCount() {
        return new MarketingDtos.RecipientCount(service.eligibleCount());
    }

    @PostMapping("/broadcast")
    public MarketingDtos.BroadcastResult broadcast(@Valid @RequestBody MarketingDtos.BroadcastRequest req) {
        return service.broadcast(req);
    }
}
