package com.example.J2AutoParts.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {

	private Long id;
	private Long productId;
	private String productName;
	private String productImageUrl;
	private BigDecimal unitPrice;
	private BigDecimal discountPrice;
	private Integer quantity;
	private Integer stockQuantity;
}
