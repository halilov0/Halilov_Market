package com.halilov.market.coupon;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/coupons")
public class CouponAdminController {

    private final CouponService coupons;

    public CouponAdminController(CouponService coupons) {
        this.coupons = coupons;
    }

    @GetMapping
    public List<CouponDtos.CouponView> list() {
        return coupons.adminListAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CouponDtos.CouponView create(@Valid @RequestBody CouponDtos.CouponUpsert req) {
        return coupons.adminCreate(req);
    }

    @PutMapping("/{id}")
    public CouponDtos.CouponView update(@PathVariable Long id, @Valid @RequestBody CouponDtos.CouponUpsert req) {
        return coupons.adminUpdate(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        coupons.adminDelete(id);
    }
}
