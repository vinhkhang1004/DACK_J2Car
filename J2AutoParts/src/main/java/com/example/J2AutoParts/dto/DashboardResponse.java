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
public class DashboardResponse {

	private long totalProducts;
	private long totalCategories;
	private long totalUsers;
	private long totalOrders;
	private BigDecimal totalRevenue;
}
