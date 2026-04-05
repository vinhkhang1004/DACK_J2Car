package com.example.J2AutoParts.controller;

import com.example.J2AutoParts.dto.ProductResponse;
import com.example.J2AutoParts.security.SecurityUserDetails;
import com.example.J2AutoParts.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public List<ProductResponse> getUserWishlist(@AuthenticationPrincipal SecurityUserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("Cần đăng nhập");
        }
        return wishlistService.getUserWishlist(userDetails.getUser());
    }

    @GetMapping("/check/{productId}")
    public boolean checkWishlist(
            @AuthenticationPrincipal SecurityUserDetails userDetails,
            @PathVariable Long productId) {
        if (userDetails == null) return false;
        return wishlistService.checkWishlist(userDetails.getUser(), productId);
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Void> toggleWishlist(
            @AuthenticationPrincipal SecurityUserDetails userDetails,
            @PathVariable Long productId) {
        if (userDetails == null) {
            throw new RuntimeException("Cần đăng nhập");
        }
        wishlistService.toggleWishlist(userDetails.getUser(), productId);
        return ResponseEntity.noContent().build();
    }
}
