package com.example.J2AutoParts.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.J2AutoParts.dto.CartItemResponse;
import com.example.J2AutoParts.entity.CartItem;
import com.example.J2AutoParts.entity.Product;
import com.example.J2AutoParts.entity.User;
import com.example.J2AutoParts.repository.CartItemRepository;
import com.example.J2AutoParts.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

	private final CartItemRepository cartItemRepository;
	private final ProductRepository productRepository;

	@Transactional(readOnly = true)
	public List<CartItemResponse> getCart(User user) {
		return cartItemRepository.findByUserId(user.getId())
				.stream()
				.map(this::toResponse)
				.collect(Collectors.toList());
	}

	@Transactional
	public CartItemResponse addItem(User user, Long productId, int quantity) {
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));

		if (product.getStockQuantity() < quantity) {
			throw new IllegalArgumentException("Không đủ hàng trong kho");
		}

		CartItem item = cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
				.map(existing -> {
					int newQty = existing.getQuantity() + quantity;
					if (newQty > product.getStockQuantity()) {
						throw new IllegalArgumentException("Vượt quá số lượng tồn kho");
					}
					existing.setQuantity(newQty);
					return existing;
				})
				.orElseGet(() -> CartItem.builder()
						.user(user)
						.product(product)
						.quantity(quantity)
						.build());

		return toResponse(cartItemRepository.save(item));
	}

	@Transactional
	public CartItemResponse updateQuantity(User user, Long itemId, int quantity) {
		CartItem item = cartItemRepository.findById(itemId)
				.orElseThrow(() -> new IllegalArgumentException("Vật phẩm không tồn tại trong giỏ hàng"));

		if (!item.getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("Bạn không thể sửa giỏ hàng của người khác");
		}

		if (item.getProduct().getStockQuantity() < quantity) {
			throw new IllegalArgumentException("Không đủ hàng trong kho");
		}

		if (quantity <= 0) {
			cartItemRepository.delete(item);
			return null;
		}

		item.setQuantity(quantity);
		return toResponse(cartItemRepository.save(item));
	}

	@Transactional
	public void removeItem(User user, Long itemId) {
		CartItem item = cartItemRepository.findById(itemId)
				.orElseThrow(() -> new IllegalArgumentException("Vật phẩm không tồn tại trong giỏ hàng"));

		if (!item.getUser().getId().equals(user.getId())) {
			throw new IllegalArgumentException("Bạn không thể sửa giỏ hàng của người khác");
		}

		cartItemRepository.delete(item);
	}

	@Transactional
	public void clearCart(User user) {
		cartItemRepository.deleteByUserId(user.getId());
	}

	private CartItemResponse toResponse(CartItem item) {
		Product p = item.getProduct();
		return CartItemResponse.builder()
				.id(item.getId())
				.productId(p.getId())
				.productName(p.getName())
				.productImageUrl(p.getImageUrl())
				.unitPrice(p.getPrice())
				.discountPrice(p.getDiscountPrice())
				.quantity(item.getQuantity())
				.stockQuantity(p.getStockQuantity())
				.build();
	}
}
