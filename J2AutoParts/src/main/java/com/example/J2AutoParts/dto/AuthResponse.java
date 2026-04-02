package com.example.J2AutoParts.dto;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

	private String token;

	@Builder.Default
	private String type = "Bearer";
	private String email;
	private String fullName;
	private Set<String> roles;
}
