package com.example.J2AutoParts.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponDto {
    private Long id;
    private String code;
    private Integer discountPercent;
    private LocalDateTime expirationDate;
    private boolean active;
    private Integer usageLimit;
    private Integer usedCount;
    private LocalDateTime createdAt;
}
