package com.example.J2AutoParts.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.J2AutoParts.dto.DashboardResponse;
import com.example.J2AutoParts.dto.OrderResponse;
import com.example.J2AutoParts.dto.UserProfileResponse;
import com.example.J2AutoParts.entity.Order;
import com.example.J2AutoParts.entity.OrderStatus;
import com.example.J2AutoParts.repository.CategoryRepository;
import com.example.J2AutoParts.repository.OrderRepository;
import com.example.J2AutoParts.repository.ProductRepository;
import com.example.J2AutoParts.repository.RoleRepository;
import com.example.J2AutoParts.repository.UserRepository;
import com.example.J2AutoParts.entity.Role;
import com.example.J2AutoParts.entity.RoleName;
import com.example.J2AutoParts.dto.NotificationDto;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

	private final UserRepository userRepository;
	private final OrderRepository orderRepository;
	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;
	private final RoleRepository roleRepository;
	private final SimpMessagingTemplate messagingTemplate;

	@GetMapping("/users")
	@org.springframework.transaction.annotation.Transactional(readOnly = true)
	public List<UserProfileResponse> getUsers() {
		return userRepository.findAll().stream().map(u -> UserProfileResponse.builder()
				.id(u.getId())
				.email(u.getEmail())
				.fullName(u.getFullName())
				.phone(u.getPhone())
				.address(u.getAddress())
				.roles(u.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
				.build()).collect(Collectors.toList());
	}

	@PutMapping("/users/{id}/roles")
	@org.springframework.transaction.annotation.Transactional
	public ResponseEntity<UserProfileResponse> updateUserRoles(@PathVariable Long id, @RequestBody List<String> roleNames) {
		com.example.J2AutoParts.entity.User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng"));
		user.getRoles().clear();
		for (String rn : roleNames) {
			Role role = roleRepository.findByName(RoleName.valueOf(rn))
					.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy vai trò: " + rn));
			user.getRoles().add(role);
		}
		userRepository.save(user);
		return ResponseEntity.ok(UserProfileResponse.builder()
				.id(user.getId())
				.email(user.getEmail())
				.fullName(user.getFullName())
				.phone(user.getPhone())
				.address(user.getAddress())
				.roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
				.build());
	}

	@GetMapping("/orders")
	@org.springframework.transaction.annotation.Transactional(readOnly = true)
	public List<OrderResponse> getAllOrders() {
		return orderRepository.findAllByOrderByOrderDateDesc().stream().map(this::toOrderResponse).collect(Collectors.toList());
	}

	@PutMapping("/orders/{id}/status")
	@org.springframework.transaction.annotation.Transactional
	public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
		Order order = orderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn hàng"));
		String statusStr = body.get("status");
		order.setStatus(OrderStatus.valueOf(statusStr));
		orderRepository.save(order);
		
		NotificationDto notification = NotificationDto.builder()
				.type("STATUS_UPDATE")
				.message("Đơn hàng #ORD-" + order.getId() + " của bạn đã cập nhật trạng thái thành: " + statusStr)
				.orderId(order.getId())
				.timestamp(java.time.LocalDateTime.now())
				.build();
		messagingTemplate.convertAndSend("/topic/user/notifications/" + order.getUser().getId(), notification);
		
		return ResponseEntity.ok(toOrderResponse(order));
	}

	@GetMapping("/stats")
	public DashboardResponse getStats() {
		BigDecimal revenue = orderRepository.getTotalRevenue();
		return DashboardResponse.builder()
				.totalProducts(productRepository.count())
				.totalCategories(categoryRepository.count())
				.totalUsers(userRepository.count())
				.totalOrders(orderRepository.count())
				.totalRevenue(revenue != null ? revenue : BigDecimal.ZERO)
				.build();
	}

	private OrderResponse toOrderResponse(Order o) {
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
