package com.example.J2AutoParts.repository;

import com.example.J2AutoParts.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);
    Optional<Review> findByIdAndUserId(Long id, Long userId);
}
