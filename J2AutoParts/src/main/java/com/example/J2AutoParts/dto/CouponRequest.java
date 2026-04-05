package com.example.J2AutoParts.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CouponRequest {
    @NotBlank(message = "Code is required")
    @Size(max = 50)
    private String code;

    @NotNull(message = "Discount percent is required")
    @Min(1)
    @Max(100)
    private Integer discountPercent;

    private LocalDateTime expirationDate;
    
    @NotNull
    private Boolean active;

    private Integer usageLimit;
}
