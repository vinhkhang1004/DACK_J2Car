package com.example.J2AutoParts.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.J2AutoParts.dto.OrderResponse;
import com.example.J2AutoParts.security.SecurityUserDetails;
import com.example.J2AutoParts.service.OrderService;

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
}
