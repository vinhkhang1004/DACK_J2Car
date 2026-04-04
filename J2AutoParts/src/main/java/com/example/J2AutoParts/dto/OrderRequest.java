package com.example.J2AutoParts.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrderRequest {

	@NotBlank
	@Size(max = 500)
	private String shippingAddress;

	@NotBlank
	@Size(max = 20)
	private String phone;

	@NotEmpty
	private List<OrderItemRequest> items;

	@Data
	public static class OrderItemRequest {
		private Long productId;
		private Integer quantity;
	}
}
