package com.example.J2AutoParts.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileRequest {

	@NotBlank(message = "Họ tên không được để trống")
	private String fullName;

	private String phone;

	private String address;
	
	private java.util.List<String> savedAddresses;
}
