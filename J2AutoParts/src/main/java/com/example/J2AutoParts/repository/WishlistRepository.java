package com.example.J2AutoParts.repository;

import com.example.J2AutoParts.entity.Product;
import com.example.J2AutoParts.entity.User;
import com.example.J2AutoParts.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserOrderByCreatedAtDesc(User user);
    Optional<Wishlist> findByUserAndProduct(User user, Product product);
}
