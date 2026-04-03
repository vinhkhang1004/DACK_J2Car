package com.example.J2AutoParts.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.J2AutoParts.dto.PagedResponse;
import com.example.J2AutoParts.dto.ProductRequest;
import com.example.J2AutoParts.dto.ProductResponse;
import com.example.J2AutoParts.entity.Category;
import com.example.J2AutoParts.entity.Product;
import com.example.J2AutoParts.repository.CategoryRepository;
import com.example.J2AutoParts.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {

	private final ProductRepository productRepository;
	private final CategoryRepository categoryRepository;

	@Transactional(readOnly = true)
	public PagedResponse<ProductResponse> search(int page, int size, String sort, Long categoryId, String q) {
		Sort s = parseSort(sort);
		Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(100, Math.max(1, size)), s);
		String query = q != null ? q.trim() : "";
		Page<Product> result;
		if (!query.isEmpty() && categoryId != null) {
			result = productRepository.searchByCategory(categoryId, query, pageable);
		}
		else if (!query.isEmpty()) {
			result = productRepository.search(query, pageable);
		}
		else if (categoryId != null) {
			result = productRepository.findByCategoryId(categoryId, pageable);
		}
		else {
			result = productRepository.findAll(pageable);
		}
		return toPaged(result);
	}

	@Transactional(readOnly = true)
	public ProductResponse findById(Long id) {
		Product p = productRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));
		return toResponse(p);
	}

	@Transactional
	public ProductResponse create(ProductRequest request) {
		if (productRepository.findBySku(request.getSku().trim()).isPresent()) {
			throw new IllegalArgumentException("SKU đã tồn tại");
		}
		Category cat = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new IllegalArgumentException("Danh mục không tồn tại"));
		Product p = Product.builder()
				.name(request.getName().trim())
				.sku(request.getSku().trim())
				.price(request.getPrice())
				.discountPrice(request.getDiscountPrice())
				.stockQuantity(request.getStockQuantity())
				.description(request.getDescription())
				.imageUrl(request.getImageUrl())
				.specifications(request.getSpecifications())
				.compatibility(request.getCompatibility())
				.category(cat)
				.additionalImageUrls(request.getAdditionalImageUrls() != null ? new java.util.ArrayList<>(request.getAdditionalImageUrls()) : new java.util.ArrayList<>())
				.build();
		return toResponse(productRepository.save(p));
	}

	@Transactional
	public ProductResponse update(Long id, ProductRequest request) {
		Product p = productRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));
		productRepository.findBySku(request.getSku().trim()).ifPresent(other -> {
			if (!other.getId().equals(id)) {
				throw new IllegalArgumentException("SKU đã tồn tại");
			}
		});
		Category cat = categoryRepository.findById(request.getCategoryId())
				.orElseThrow(() -> new IllegalArgumentException("Danh mục không tồn tại"));
		p.setName(request.getName().trim());
		p.setSku(request.getSku().trim());
		p.setPrice(request.getPrice());
		p.setDiscountPrice(request.getDiscountPrice());
		p.setStockQuantity(request.getStockQuantity());
		p.setDescription(request.getDescription());
		p.setImageUrl(request.getImageUrl());
		p.setSpecifications(request.getSpecifications());
		p.setCompatibility(request.getCompatibility());
		p.setCategory(cat);
		if (request.getAdditionalImageUrls() != null) {
			p.getAdditionalImageUrls().clear();
			p.getAdditionalImageUrls().addAll(request.getAdditionalImageUrls());
		}
		return toResponse(productRepository.save(p));
	}

	@Transactional
	public void delete(Long id) {
		if (!productRepository.existsById(id)) {
			throw new IllegalArgumentException("Không tìm thấy sản phẩm");
		}
		productRepository.deleteById(id);
	}

	private Sort parseSort(String sort) {
		if (sort == null || sort.isBlank()) {
			return Sort.by(Sort.Direction.ASC, "name");
		}
		String[] parts = sort.split(",");
		if (parts.length == 1) {
			return Sort.by(Sort.Direction.ASC, parts[0].trim());
		}
		Sort.Direction dir = "desc".equalsIgnoreCase(parts[1].trim()) ? Sort.Direction.DESC : Sort.Direction.ASC;
		return Sort.by(dir, parts[0].trim());
	}

	private ProductResponse toResponse(Product p) {
		Category c = p.getCategory();
		return ProductResponse.builder()
				.id(p.getId())
				.name(p.getName())
				.sku(p.getSku())
				.price(p.getPrice())
				.discountPrice(p.getDiscountPrice())
				.stockQuantity(p.getStockQuantity())
				.description(p.getDescription())
				.imageUrl(p.getImageUrl())
				.specifications(p.getSpecifications())
				.compatibility(p.getCompatibility())
				.categoryId(c.getId())
				.categoryName(c.getName())
				.additionalImageUrls(new java.util.ArrayList<>(p.getAdditionalImageUrls()))
				.build();
	}

	private PagedResponse<ProductResponse> toPaged(Page<Product> page) {
		return PagedResponse.<ProductResponse>builder()
				.content(page.getContent().stream().map(this::toResponse).toList())
				.page(page.getNumber())
				.size(page.getSize())
				.totalElements(page.getTotalElements())
				.totalPages(page.getTotalPages())
				.last(page.isLast())
				.build();
	}
}
