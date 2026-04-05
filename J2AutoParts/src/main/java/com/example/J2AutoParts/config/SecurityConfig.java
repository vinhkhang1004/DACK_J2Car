package com.example.J2AutoParts.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.J2AutoParts.security.JwtAuthenticationFilter;
import com.example.J2AutoParts.security.RestAuthHandlers;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final RestAuthHandlers restAuthHandlers;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.cors(Customizer.withDefaults())
				.csrf(csrf -> csrf.disable())
				.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.exceptionHandling(ex -> ex
						.authenticationEntryPoint(restAuthHandlers.authenticationEntryPoint())
						.accessDeniedHandler(restAuthHandlers.accessDeniedHandler()))
				.authorizeHttpRequests(auth -> auth
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers(HttpMethod.POST, "/api/auth/register", "/api/auth/login").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()
						.requestMatchers(
							"/", "/index.html", "/favicon.ico", "/manifest.json",
							"/**/*.js", "/**/*.css", "/**/*.html", "/**/*.json",
							"/**/*.svg", "/**/*.png", "/**/*.woff2", "/**/*.map"
						).permitAll()
						.requestMatchers(HttpMethod.POST, "/api/categories/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PUT, "/api/categories/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PATCH, "/api/categories/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PATCH, "/api/products/**").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")
						.requestMatchers("/api/admin/**").hasRole("ADMIN")
						.anyRequest().authenticated())
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
