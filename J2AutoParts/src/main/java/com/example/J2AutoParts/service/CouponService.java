package com.example.J2AutoParts.service;

import com.example.J2AutoParts.dto.CouponDto;
import com.example.J2AutoParts.dto.CouponRequest;
import com.example.J2AutoParts.entity.Coupon;
import com.example.J2AutoParts.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponRepository couponRepository;

    @Transactional(readOnly = true)
    public List<CouponDto> getAllCoupons() {
        return couponRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CouponDto validateCoupon(String code) {
        Coupon coupon = couponRepository.findByCode(code)
            .orElseThrow(() -> new IllegalArgumentException("Mã giảm giá không tồn tại"));
            
        if (!coupon.isActive()) {
            throw new IllegalArgumentException("Mã giảm giá đã bị vô hiệu hoá");
        }
        
        if (coupon.getExpirationDate() != null && coupon.getExpirationDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Mã giảm giá đã hết hạn");
        }
        
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new IllegalArgumentException("Mã giảm giá đã đạt giới hạn sử dụng");
        }
        
        return mapToDto(coupon);
    }

    @Transactional
    public CouponDto createCoupon(CouponRequest req) {
        if (couponRepository.findByCode(req.getCode()).isPresent()) {
            throw new IllegalArgumentException("Mã giảm giá đã tồn tại");
        }
        
        Coupon coupon = Coupon.builder()
            .code(req.getCode().toUpperCase())
            .discountPercent(req.getDiscountPercent())
            .expirationDate(req.getExpirationDate())
            .active(req.getActive() != null ? req.getActive() : true)
            .usageLimit(req.getUsageLimit())
            .usedCount(0)
            .build();
            
        return mapToDto(couponRepository.save(coupon));
    }

    @Transactional
    public CouponDto updateCoupon(Long id, CouponRequest req) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Mã giảm giá không tồn tại"));
            
        // Check uniqueness if code changed
        if (!coupon.getCode().equalsIgnoreCase(req.getCode())) {
            if (couponRepository.findByCode(req.getCode()).isPresent()) {
                throw new IllegalArgumentException("Mã giảm giá đã tồn tại");
            }
            coupon.setCode(req.getCode().toUpperCase());
        }
        
        coupon.setDiscountPercent(req.getDiscountPercent());
        coupon.setExpirationDate(req.getExpirationDate());
        coupon.setActive(req.getActive() != null ? req.getActive() : true);
        coupon.setUsageLimit(req.getUsageLimit());
        
        return mapToDto(couponRepository.save(coupon));
    }

    @Transactional
    public void deleteCoupon(Long id) {
        Coupon coupon = couponRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy mã giảm giá"));
        couponRepository.delete(coupon);
    }
    
    // Internal method to increment usage count
    @Transactional
    public void incrementUsage(String code) {
        couponRepository.findByCode(code).ifPresent(coupon -> {
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
        });
    }

    private CouponDto mapToDto(Coupon coupon) {
        return CouponDto.builder()
            .id(coupon.getId())
            .code(coupon.getCode())
            .discountPercent(coupon.getDiscountPercent())
            .expirationDate(coupon.getExpirationDate())
            .active(coupon.isActive())
            .usageLimit(coupon.getUsageLimit())
            .usedCount(coupon.getUsedCount())
            .createdAt(coupon.getCreatedAt())
            .build();
    }
}
