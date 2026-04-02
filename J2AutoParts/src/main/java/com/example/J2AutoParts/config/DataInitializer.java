package com.example.J2AutoParts.config;

import java.math.BigDecimal;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.J2AutoParts.entity.Category;
import com.example.J2AutoParts.entity.Product;
import com.example.J2AutoParts.entity.Role;
import com.example.J2AutoParts.entity.RoleName;
import com.example.J2AutoParts.entity.User;
import com.example.J2AutoParts.repository.CategoryRepository;
import com.example.J2AutoParts.repository.ProductRepository;
import com.example.J2AutoParts.repository.RoleRepository;
import com.example.J2AutoParts.repository.UserRepository;
import com.example.J2AutoParts.util.SlugUtil;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

	private final RoleRepository roleRepository;
	private final UserRepository userRepository;
	private final CategoryRepository categoryRepository;
	private final ProductRepository productRepository;
	private final PasswordEncoder passwordEncoder;

	@Bean
	ApplicationRunner seedData() {
		return args -> {
			Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).orElseGet(() ->
					roleRepository.save(Role.builder().name(RoleName.ROLE_ADMIN).build()));
			Role customerRole = roleRepository.findByName(RoleName.ROLE_CUSTOMER).orElseGet(() ->
					roleRepository.save(Role.builder().name(RoleName.ROLE_CUSTOMER).build()));

			if (userRepository.findByEmail("admin@j2autoparts.local").isEmpty()) {
				User admin = User.builder()
						.email("admin@j2autoparts.local")
						.password(passwordEncoder.encode("Admin@123"))
						.fullName("Quản trị viên")
						.enabled(true)
						.build();
				admin.getRoles().add(adminRole);
				admin.getRoles().add(customerRole);
				userRepository.save(admin);
			}

			if (categoryRepository.count() == 0) {
				Category phanh = categoryRepository.save(Category.builder()
						.name("Phanh & ABS")
						.slug(SlugUtil.slugify("Phanh & ABS"))
						.description("Má phanh, đĩa phanh, dầu phanh, cảm biến ABS")
						.build());
				Category loc = categoryRepository.save(Category.builder()
						.name("Lọc & bảo dưỡng")
						.slug(SlugUtil.slugify("Lọc & bảo dưỡng"))
						.description("Lọc gió, lọc dầu, lọc nhiên liệu")
						.build());

				productRepository.save(Product.builder()
						.name("Má phanh trước Bosch")
						.sku("BOSCH-BP-001")
						.price(new BigDecimal("1250000"))
						.stockQuantity(24)
						.description("Má phanh gốm, phù hợp sedan phổ biến")
						.imageUrl("https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600")
						.category(phanh)
						.build());
				productRepository.save(Product.builder()
						.name("Đĩa phanh sau")
						.sku("DISC-REAR-220")
						.price(new BigDecimal("2100000"))
						.stockQuantity(10)
						.description("Đĩa gang, đường kính 280mm")
						.category(phanh)
						.build());
				productRepository.save(Product.builder()
						.name("Lọc gió động cơ")
						.sku("AIR-FLT-889")
						.price(new BigDecimal("185000"))
						.stockQuantity(80)
						.description("Lọc gió OEM tương đương")
						.category(loc)
						.build());
			}
		};
	}
}
