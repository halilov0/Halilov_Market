package com.halilov.online.payment;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class PaymentController {

    private final PaymentService payment;

    public PaymentController(PaymentService payment) {
        this.payment = payment;
    }

    @PostMapping("/api/orders/{orderNumber}/pay")
    public PaymentDtos.InitiateResponse initiate(Authentication auth, @PathVariable String orderNumber) {
        requireAuth(auth);
        return payment.initiate(auth.getName(), orderNumber);
    }

    @PostMapping("/api/payments/mock/{orderNumber}/complete")
    public PaymentDtos.InitiateResponse completeMock(
        Authentication auth,
        @PathVariable String orderNumber,
        @RequestBody PaymentDtos.MockCompleteRequest req
    ) {
        requireAuth(auth);
        return payment.completeMock(auth.getName(), orderNumber, req.outcome());
    }

    private void requireAuth(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "login required");
        }
    }
}
