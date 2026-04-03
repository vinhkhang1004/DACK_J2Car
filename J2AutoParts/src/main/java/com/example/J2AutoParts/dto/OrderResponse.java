package com.example.J2AutoParts.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.example.J2AutoParts.entity.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

	private Long id;
	private LocalDateTime orderDate;
	private BigDecimal totalAmount;
	private OrderStatus status;
	private String shippingAddress;
	private List<OrderItemResponse> items;

	@Data
	@Builder
	@NoArgsConstructor
	@AllArgsConstructor
	public static class OrderItemResponse {
		private Long id;
		private Long productId;
		private String productName;
		private String productImageUrl;
		private Integer quantity;
		private BigDecimal unitPrice;
	}
}
