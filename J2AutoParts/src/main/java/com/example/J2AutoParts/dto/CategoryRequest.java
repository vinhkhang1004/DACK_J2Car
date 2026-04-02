package com.example.J2AutoParts.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryRequest {

	@NotBlank
	@Size(max = 160)
	private String name;

	@Size(max = 1000)
	private String description;
}
