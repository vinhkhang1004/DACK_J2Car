package com.example.J2AutoParts.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProductRequest {

	@NotBlank
	@Size(max = 200)
	private String name;

	@NotBlank
	@Size(max = 80)
	private String sku;

	@NotNull
	@DecimalMin("0.0")
	private BigDecimal price;

	@DecimalMin("0.0")
	private BigDecimal discountPrice;

	@NotNull
	@Min(0)
	private Integer stockQuantity;

	@Size(max = 4000)
	private String description;

	@Size(max = 500)
	private String imageUrl;

	@Size(max = 4000)
	private String specifications;

	@Size(max = 4000)
	private String compatibility;

	@NotNull
	private Long categoryId;
}
