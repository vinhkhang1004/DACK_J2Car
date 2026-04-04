package com.example.J2AutoParts.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.J2AutoParts.dto.AuthResponse;
import com.example.J2AutoParts.dto.LoginRequest;
import com.example.J2AutoParts.dto.ProfileRequest;
import com.example.J2AutoParts.dto.RegisterRequest;
import com.example.J2AutoParts.dto.UserProfileResponse;
import com.example.J2AutoParts.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthController {

	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
		return ResponseEntity.ok(authService.register(request));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
		return ResponseEntity.ok(authService.login(request));
	}

	@GetMapping("/me")
	public ResponseEntity<UserProfileResponse> me(@AuthenticationPrincipal UserDetails principal) {
		if (principal == null) {
			return ResponseEntity.status(401).build();
		}
		return ResponseEntity.ok(authService.currentProfile(principal));
	}

	@PutMapping("/profile")
	public ResponseEntity<UserProfileResponse> updateProfile(
			@AuthenticationPrincipal UserDetails principal,
			@Valid @RequestBody ProfileRequest request) {
		if (principal == null) {
			return ResponseEntity.status(401).build();
		}
		return ResponseEntity.ok(authService.updateProfile(principal, request));
	}

	@GetMapping("/debug")
	public ResponseEntity<java.util.Map<String, Object>> debug(@AuthenticationPrincipal UserDetails principal) {
		log.info("Debug endpoint called. Principal: {}", principal);
		if (principal == null) {
			return ResponseEntity.status(401).body(java.util.Map.of("error", "NULL PRINCIPAL (Unauthenticated)"));
		}
		return ResponseEntity.ok(java.util.Map.of(
				"username", principal.getUsername(),
				"authorities", principal.getAuthorities().stream().map(Object::toString).toList(),
				"enabled", principal.isEnabled()
		));
	}
}
