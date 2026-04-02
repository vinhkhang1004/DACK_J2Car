package com.example.J2AutoParts.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.J2AutoParts.dto.CategoryRequest;
import com.example.J2AutoParts.dto.CategoryResponse;
import com.example.J2AutoParts.entity.Category;
import com.example.J2AutoParts.repository.CategoryRepository;
import com.example.J2AutoParts.repository.ProductRepository;
import com.example.J2AutoParts.util.SlugUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

	private final CategoryRepository categoryRepository;
	private final ProductRepository productRepository;

	@Transactional(readOnly = true)
	public List<CategoryResponse> findAll() {
		return categoryRepository.findAll().stream()
				.map(this::toResponse)
				.collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public CategoryResponse findById(Long id) {
		Category c = categoryRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục"));
		return toResponse(c);
	}

	@Transactional
	public CategoryResponse create(CategoryRequest request) {
		String base = SlugUtil.slugify(request.getName());
		String slug = uniqueSlug(base, null);
		Category c = Category.builder()
				.name(request.getName().trim())
				.slug(slug)
				.description(request.getDescription())
				.build();
		return toResponse(categoryRepository.save(c));
	}

	@Transactional
	public CategoryResponse update(Long id, CategoryRequest request) {
		Category c = categoryRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục"));
		c.setName(request.getName().trim());
		c.setDescription(request.getDescription());
		c.setSlug(uniqueSlug(SlugUtil.slugify(request.getName()), c.getId()));
		return toResponse(categoryRepository.save(c));
	}

	@Transactional
	public void delete(Long id) {
		Category c = categoryRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục"));
		if (productRepository.countByCategoryId(id) > 0) {
			throw new IllegalStateException("Không xóa được: còn sản phẩm thuộc danh mục");
		}
		categoryRepository.delete(c);
	}

	private CategoryResponse toResponse(Category c) {
		long cnt = productRepository.countByCategoryId(c.getId());
		return CategoryResponse.builder()
				.id(c.getId())
				.name(c.getName())
				.slug(c.getSlug())
				.description(c.getDescription())
				.productCount(cnt)
				.build();
	}

	private String uniqueSlug(String base, Long excludeCategoryId) {
		String slug = base;
		int i = 0;
		while (true) {
			var existing = categoryRepository.findBySlug(slug);
			if (existing.isEmpty()) {
				return slug;
			}
			if (excludeCategoryId != null && existing.get().getId().equals(excludeCategoryId)) {
				return slug;
			}
			i++;
			slug = base + "-" + i;
		}
	}
}
