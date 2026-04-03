package com.example.J2AutoParts.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.J2AutoParts.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {

	Optional<Product> findBySku(String sku);

	Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

	@Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) " +
			"OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :q, '%')) " +
			"OR LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')) " +
			"OR LOWER(p.specifications) LIKE LOWER(CONCAT('%', :q, '%'))")
	Page<Product> search(@Param("q") String q, Pageable pageable);

	@Query("SELECT p FROM Product p WHERE p.category.id = :categoryId AND (" +
			"LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%')) " +
			"OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :q, '%')) " +
			"OR LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')) " +
			"OR LOWER(p.specifications) LIKE LOWER(CONCAT('%', :q, '%')))")
	Page<Product> searchByCategory(@Param("categoryId") Long categoryId, @Param("q") String q, Pageable pageable);

	@Query("SELECT COUNT(p) FROM Product p WHERE p.category.id = :categoryId")
	long countByCategoryId(@Param("categoryId") Long categoryId);
}
