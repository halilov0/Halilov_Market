package com.halilov.online.order;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderDtos.OrderView create(Authentication auth, @Valid @RequestBody OrderDtos.CreateOrderRequest req) {
        requireAuth(auth);
        return orderService.createOrder(auth.getName(), req);
    }

    @GetMapping
    public List<OrderDtos.OrderView> mine(Authentication auth) {
        requireAuth(auth);
        return orderService.listMine(auth.getName());
    }

    @GetMapping("/{orderNumber}")
    public OrderDtos.OrderView one(Authentication auth, @PathVariable String orderNumber) {
        requireAuth(auth);
        return orderService.getMine(auth.getName(), orderNumber);
    }

    private void requireAuth(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "login required");
        }
    }
}
