package com.halilov.online.coupon;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService coupons;

    public CouponController(CouponService coupons) {
        this.coupons = coupons;
    }

    @PostMapping("/validate")
    public CouponDtos.ValidateResponse validate(@Valid @RequestBody CouponDtos.ValidateRequest req) {
        return coupons.validate(req);
    }
}
