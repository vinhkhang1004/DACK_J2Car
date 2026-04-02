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
public class ProductResponse {

	private Long id;
	private String name;
	private String sku;
	private BigDecimal price;
	private Integer stockQuantity;
	private String description;
	private String imageUrl;
	private Long categoryId;
	private String categoryName;
}
