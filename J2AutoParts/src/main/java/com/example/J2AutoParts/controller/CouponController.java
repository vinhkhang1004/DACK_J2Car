package com.example.J2AutoParts.controller;

import com.example.J2AutoParts.dto.CouponDto;
import com.example.J2AutoParts.dto.CouponRequest;
import com.example.J2AutoParts.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    // Public API for validate checkout
    @GetMapping("/validate")
    public CouponDto validateCoupon(@RequestParam String code) {
        return couponService.validateCoupon(code);
    }

    // Admin APIs (restricted in SecurityConfig)
    @GetMapping
    public List<CouponDto> getAllCoupons() {
        return couponService.getAllCoupons();
    }

    @PostMapping
    public CouponDto createCoupon(@Valid @RequestBody CouponRequest request) {
        return couponService.createCoupon(request);
    }

    @PutMapping("/{id}")
    public CouponDto updateCoupon(@PathVariable Long id, @Valid @RequestBody CouponRequest request) {
        return couponService.updateCoupon(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.noContent().build();
    }
}
