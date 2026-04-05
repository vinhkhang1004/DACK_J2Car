package com.example.J2AutoParts.service;

import com.example.J2AutoParts.dto.ProductResponse;
import com.example.J2AutoParts.entity.Category;
import com.example.J2AutoParts.entity.Product;
import com.example.J2AutoParts.entity.User;
import com.example.J2AutoParts.entity.Wishlist;
import com.example.J2AutoParts.repository.ProductRepository;
import com.example.J2AutoParts.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<ProductResponse> getUserWishlist(User user) {
        return wishlistRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(wishlist -> mapProductToResponse(wishlist.getProduct()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean checkWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));
        return wishlistRepository.findByUserAndProduct(user, product).isPresent();
    }

    @Transactional
    public void toggleWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Sản phẩm không tồn tại"));
            
        Optional<Wishlist> existing = wishlistRepository.findByUserAndProduct(user, product);
        
        if (existing.isPresent()) {
            wishlistRepository.delete(existing.get());
        } else {
            Wishlist item = Wishlist.builder()
                .user(user)
                .product(product)
                .build();
            wishlistRepository.save(item);
        }
    }

    private ProductResponse mapProductToResponse(Product p) {
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
}
