package com.example.J2AutoParts.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.J2AutoParts.dto.CartItemResponse;
import com.example.J2AutoParts.security.SecurityUserDetails;
import com.example.J2AutoParts.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

	private final CartService cartService;

	@GetMapping
	public List<CartItemResponse> getCart(@AuthenticationPrincipal SecurityUserDetails userDetails) {
		return cartService.getCart(userDetails.getUser());
	}

	@PostMapping
	public CartItemResponse addItem(
			@AuthenticationPrincipal SecurityUserDetails userDetails,
			@RequestParam Long productId,
			@RequestParam(defaultValue = "1") int quantity) {
		return cartService.addItem(userDetails.getUser(), productId, quantity);
	}

	@PutMapping("/{id}")
	public CartItemResponse updateQuantity(
			@AuthenticationPrincipal SecurityUserDetails userDetails,
			@PathVariable Long id,
			@RequestParam int quantity) {
		return cartService.updateQuantity(userDetails.getUser(), id, quantity);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> removeItem(
			@AuthenticationPrincipal SecurityUserDetails userDetails,
			@PathVariable Long id) {
		cartService.removeItem(userDetails.getUser(), id);
		return ResponseEntity.noContent().build();
	}

	@DeleteMapping
	public ResponseEntity<Void> clearCart(@AuthenticationPrincipal SecurityUserDetails userDetails) {
		cartService.clearCart(userDetails.getUser());
		return ResponseEntity.noContent().build();
	}
}
