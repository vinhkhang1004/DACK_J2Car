package com.example.J2AutoParts.service;

import com.example.J2AutoParts.dto.ReviewDto;
import com.example.J2AutoParts.dto.ReviewRequest;
import com.example.J2AutoParts.entity.Product;
import com.example.J2AutoParts.entity.Review;
import com.example.J2AutoParts.entity.User;
import com.example.J2AutoParts.repository.ProductRepository;
import com.example.J2AutoParts.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
            .stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto addReview(User user, ReviewRequest request) {
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new RuntimeException("Product not found"));
            
        Review review = Review.builder()
            .product(product)
            .user(user)
            .rating(request.getRating())
            .comment(request.getComment())
            .build();
            
        Review saved = reviewRepository.save(review);
        return mapToDto(saved);
    }

    @Transactional
    public ReviewDto updateReview(User user, Long reviewId, ReviewRequest request) {
        Review review = reviewRepository.findByIdAndUserId(reviewId, user.getId())
            .orElseThrow(() -> new RuntimeException("Review not found or unauthorized"));
            
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        
        Review saved = reviewRepository.save(review);
        return mapToDto(saved);
    }

    @Transactional
    public void deleteReview(User user, Long reviewId) {
        Review review = reviewRepository.findByIdAndUserId(reviewId, user.getId())
            .orElseThrow(() -> new RuntimeException("Review not found or unauthorized"));
        reviewRepository.delete(review);
    }

    private ReviewDto mapToDto(Review review) {
        return ReviewDto.builder()
            .id(review.getId())
            .productId(review.getProduct().getId())
            .userId(review.getUser().getId())
            .userName(review.getUser().getFullName())
            .rating(review.getRating())
            .comment(review.getComment())
            .createdAt(review.getCreatedAt())
            .updatedAt(review.getUpdatedAt())
            .build();
    }
}
