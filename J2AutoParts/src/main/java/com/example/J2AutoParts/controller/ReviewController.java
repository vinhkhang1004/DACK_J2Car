package com.example.J2AutoParts.controller;

import com.example.J2AutoParts.dto.ReviewDto;
import com.example.J2AutoParts.dto.ReviewRequest;
import com.example.J2AutoParts.security.SecurityUserDetails;
import com.example.J2AutoParts.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public List<ReviewDto> getReviews(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    @PostMapping
    public ReviewDto addReview(
            @AuthenticationPrincipal SecurityUserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        if (userDetails == null) {
            throw new RuntimeException("Must be logged in to review");
        }
        return reviewService.addReview(userDetails.getUser(), request);
    }

    @PutMapping("/{reviewId}")
    public ReviewDto updateReview(
            @AuthenticationPrincipal SecurityUserDetails userDetails,
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequest request) {
        if (userDetails == null) {
            throw new RuntimeException("Must be logged in to review");
        }
        return reviewService.updateReview(userDetails.getUser(), reviewId, request);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @AuthenticationPrincipal SecurityUserDetails userDetails,
            @PathVariable Long reviewId) {
        if (userDetails == null) {
            throw new RuntimeException("Must be logged in to review");
        }
        reviewService.deleteReview(userDetails.getUser(), reviewId);
        return ResponseEntity.noContent().build();
    }
}
