package com.example.J2AutoParts.entity;

import java.math.BigDecimal;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 200)
	private String name;

	@Column(nullable = false, unique = true, length = 80)
	private String sku;

	@Column(nullable = false, precision = 14, scale = 2)
	private BigDecimal price;

	@Column(precision = 14, scale = 2)
	private BigDecimal discountPrice;

	@Column(nullable = false)
	private Integer stockQuantity;

	@Column(length = 4000)
	private String description;

	@Column(length = 500)
	private String imageUrl;

	@Column(length = 4000)
	private String specifications;

	@Column(length = 4000)
	private String compatibility;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "category_id", nullable = false)
	private Category category;

	@ElementCollection
	@CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
	@Column(name = "image_url", length = 500)
	@Builder.Default
	private List<String> additionalImageUrls = new ArrayList<>();
}
