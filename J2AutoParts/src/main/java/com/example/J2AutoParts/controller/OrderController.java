package com.example.J2AutoParts.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.J2AutoParts.dto.OrderRequest;
import com.example.J2AutoParts.dto.OrderResponse;
import com.example.J2AutoParts.security.SecurityUserDetails;
import com.example.J2AutoParts.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

	private final OrderService orderService;

	@GetMapping
	public ResponseEntity<List<OrderResponse>> getOrders(@AuthenticationPrincipal SecurityUserDetails userDetails) {
		if (userDetails == null) {
			return ResponseEntity.status(401).build();
		}
		return ResponseEntity.ok(orderService.getOrders(userDetails.getUser()));
	}

	@GetMapping("/{id}")
	public ResponseEntity<OrderResponse> getOrder(
			@AuthenticationPrincipal SecurityUserDetails userDetails,
			@PathVariable Long id) {
		if (userDetails == null) {
			return ResponseEntity.status(401).build();
		}
		return ResponseEntity.ok(orderService.getOrder(userDetails.getUser(), id));
	}

	@PostMapping
	public ResponseEntity<OrderResponse> createOrder(
			@AuthenticationPrincipal SecurityUserDetails userDetails,
			@Valid @RequestBody OrderRequest request) {
		if (userDetails == null) {
			return ResponseEntity.status(401).build();
		}
		return ResponseEntity.status(201).body(orderService.createOrder(userDetails.getUser(), request));
	}

	@org.springframework.web.bind.annotation.PutMapping("/{id}/cancel")
	public ResponseEntity<OrderResponse> cancelOrder(
			@AuthenticationPrincipal SecurityUserDetails userDetails,
			@PathVariable Long id) {
		if (userDetails == null) {
			return ResponseEntity.status(401).build();
		}
		return ResponseEntity.ok(orderService.cancelOrder(userDetails.getUser(), id));
	}
}
