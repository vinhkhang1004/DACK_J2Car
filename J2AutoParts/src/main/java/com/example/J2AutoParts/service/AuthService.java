package com.example.J2AutoParts.service;

import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.J2AutoParts.dto.AuthResponse;
import com.example.J2AutoParts.dto.LoginRequest;
import com.example.J2AutoParts.dto.RegisterRequest;
import com.example.J2AutoParts.dto.UserProfileResponse;
import com.example.J2AutoParts.entity.Role;
import com.example.J2AutoParts.entity.RoleName;
import com.example.J2AutoParts.entity.User;
import com.example.J2AutoParts.repository.RoleRepository;
import com.example.J2AutoParts.repository.UserRepository;
import com.example.J2AutoParts.security.JwtTokenProvider;
import com.example.J2AutoParts.security.SecurityUserDetails;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuthenticationManager authenticationManager;
	private final JwtTokenProvider jwtTokenProvider;

	@Transactional
	public AuthResponse register(RegisterRequest request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new IllegalArgumentException("Email đã được sử dụng");
		}
		Role customer = roleRepository.findByName(RoleName.ROLE_CUSTOMER)
				.orElseThrow(() -> new IllegalStateException("Thiếu vai trò ROLE_CUSTOMER trong CSDL"));
		User user = User.builder()
				.email(request.getEmail().trim().toLowerCase())
				.password(passwordEncoder.encode(request.getPassword()))
				.fullName(request.getFullName().trim())
				.enabled(true)
				.build();
		user.getRoles().add(customer);
		userRepository.save(user);
		Authentication auth = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getEmail().trim().toLowerCase(), request.getPassword()));
		return buildAuthResponse(auth);
	}

	public AuthResponse login(LoginRequest request) {
		String email = request.getEmail().trim().toLowerCase();
		Authentication auth = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(email, request.getPassword()));
		return buildAuthResponse(auth);
	}

	@Transactional(readOnly = true)
	public UserProfileResponse currentProfile(org.springframework.security.core.userdetails.UserDetails principal) {
		User user = userRepository.findByEmail(principal.getUsername())
				.orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));
		return UserProfileResponse.builder()
				.id(user.getId())
				.email(user.getEmail())
				.fullName(user.getFullName())
				.phone(user.getPhone())
				.address(user.getAddress())
				.roles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
				.build();
	}

	@Transactional
	public UserProfileResponse updateProfile(org.springframework.security.core.userdetails.UserDetails principal, com.example.J2AutoParts.dto.ProfileRequest request) {
		User user = userRepository.findByEmail(principal.getUsername())
				.orElseThrow(() -> new IllegalArgumentException("Người dùng không tồn tại"));
		user.setFullName(request.getFullName().trim());
		user.setPhone(request.getPhone());
		user.setAddress(request.getAddress());
		userRepository.save(user);
		return currentProfile(principal);
	}

	private AuthResponse buildAuthResponse(Authentication authentication) {
		String token = jwtTokenProvider.createToken(authentication);
		SecurityUserDetails details = (SecurityUserDetails) authentication.getPrincipal();
		User u = details.getUser();
		return AuthResponse.builder()
				.token(token)
				.email(u.getEmail())
				.fullName(u.getFullName())
				.roles(u.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
				.build();
	}
}
