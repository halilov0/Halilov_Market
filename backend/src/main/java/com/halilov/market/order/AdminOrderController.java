package com.halilov.market.order;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderDtos.OrderView> all() {
        return orderService.adminListAll();
    }

    @GetMapping("/{orderNumber}")
    public OrderDtos.OrderView one(@PathVariable String orderNumber) {
        return orderService.adminGet(orderNumber);
    }

    @PatchMapping("/{orderNumber}/status")
    public OrderDtos.OrderView updateStatus(
        @PathVariable String orderNumber,
        @Valid @RequestBody OrderDtos.UpdateStatusRequest req
    ) {
        return orderService.adminUpdateStatus(orderNumber, req.status());
    }
}
