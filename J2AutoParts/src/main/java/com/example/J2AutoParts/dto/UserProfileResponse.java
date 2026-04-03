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
public class UserProfileResponse {

	private Long id;
	private String email;
	private String fullName;
	private String phone;
	private String address;
	private Set<String> roles;
}
