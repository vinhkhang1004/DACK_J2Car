package com.example.J2AutoParts.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.J2AutoParts.dto.OrderRequest;
import com.example.J2AutoParts.dto.OrderResponse;
import com.example.J2AutoParts.entity.Order;
import com.example.J2AutoParts.entity.OrderItem;
import com.example.J2AutoParts.entity.OrderStatus;
import com.example.J2AutoParts.entity.Product;
import com.example.J2AutoParts.entity.User;
import com.example.J2AutoParts.repository.OrderRepository;
import com.example.J2AutoParts.repository.ProductRepository;
import java.math.BigDecimal;
import java.util.ArrayList;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

	private final OrderRepository orderRepository;
	private final ProductRepository productRepository;
	private final CouponService couponService;

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

	@Transactional
	public OrderResponse createOrder(User user, OrderRequest request) {
		Order order = Order.builder()
				.user(user)
				.orderDate(java.time.LocalDateTime.now())
				.status(OrderStatus.PENDING)
				.shippingAddress(request.getShippingAddress())
				.totalAmount(BigDecimal.ZERO)
				.items(new ArrayList<>())
				.build();

		BigDecimal total = BigDecimal.ZERO;
		for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
			Product p = productRepository.findById(itemReq.getProductId())
					.orElseThrow(() -> new IllegalArgumentException("Sản phẩm #" + itemReq.getProductId() + " không tồn tại"));

			if (p.getStockQuantity() < itemReq.getQuantity()) {
				throw new IllegalArgumentException("Sản phẩm " + p.getName() + " không đủ hàng trong kho");
			}

			// Reduce stock
			p.setStockQuantity(p.getStockQuantity() - itemReq.getQuantity());
			productRepository.save(p);

			BigDecimal price = p.getDiscountPrice() != null ? p.getDiscountPrice() : p.getPrice();
			total = total.add(price.multiply(BigDecimal.valueOf(itemReq.getQuantity())));

			OrderItem item = OrderItem.builder()
					.order(order)
					.product(p)
					.quantity(itemReq.getQuantity())
					.unitPrice(price)
					.build();
			order.getItems().add(item);
		}

		BigDecimal subTotal = total;
		BigDecimal discountAmount = BigDecimal.ZERO;
		
		if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
			com.example.J2AutoParts.dto.CouponDto couponDto = couponService.validateCoupon(request.getCouponCode());
			
			discountAmount = subTotal.multiply(BigDecimal.valueOf(couponDto.getDiscountPercent())).divide(BigDecimal.valueOf(100));
			total = subTotal.subtract(discountAmount);
			
			order.setCouponCode(couponDto.getCode());
			order.setDiscountAmount(discountAmount);
			
			couponService.incrementUsage(couponDto.getCode());
		}

		order.setTotalAmount(total);

		return toResponse(orderRepository.save(order));
	}

	@Transactional
	public OrderResponse cancelOrder(User user, Long orderId) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new IllegalArgumentException("Đơn hàng không tồn tại"));

		if (!order.getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("Bạn không thể hủy đơn hàng của người khác");
		}

		if (order.getStatus() != OrderStatus.PENDING) {
			throw new IllegalArgumentException("Chỉ có thể hủy đơn hàng đang ở trạng thái 'Chờ xử lý'");
		}

		// Restore stock
		for (com.example.J2AutoParts.entity.OrderItem item : order.getItems()) {
			Product p = item.getProduct();
			p.setStockQuantity(p.getStockQuantity() + item.getQuantity());
			productRepository.save(p);
		}

		order.setStatus(OrderStatus.CANCELLED);
		return toResponse(orderRepository.save(order));
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
