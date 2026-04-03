package com.example.J2AutoParts.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.J2AutoParts.dto.OrderResponse;
import com.example.J2AutoParts.entity.Order;
import com.example.J2AutoParts.entity.User;
import com.example.J2AutoParts.repository.OrderRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

	private final OrderRepository orderRepository;

	@Transactional(readOnly = true)
	public List<OrderResponse> getOrders(User user) {
		return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId())
				.stream()
				.map(this::toResponse)
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public OrderResponse getOrder(User user, Long orderId) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new IllegalArgumentException("Đơn hàng không tồn tại"));

		if (!order.getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("Bạn không thể xem đơn hàng của người khác");
		}

		return toResponse(order);
	}

	private OrderResponse toResponse(Order o) {
		return OrderResponse.builder()
				.id(o.getId())
				.orderDate(o.getOrderDate())
				.totalAmount(o.getTotalAmount())
				.status(o.getStatus())
				.shippingAddress(o.getShippingAddress())
				.items(o.getItems().stream().map(item -> OrderResponse.OrderItemResponse.builder()
						.id(item.getId())
						.productId(item.getProduct().getId())
						.productName(item.getProduct().getName())
						.productImageUrl(item.getProduct().getImageUrl())
						.quantity(item.getQuantity())
						.unitPrice(item.getUnitPrice())
						.build()).collect(Collectors.toList()))
				.build();
	}
}
