package com.example.J2AutoParts.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

	private final SecretKey key;
	private final long expirationMs;

	public JwtTokenProvider(
			@Value("${app.jwt.secret}") String secret,
			@Value("${app.jwt.expiration-ms}") long expirationMs) {
		byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
		if (bytes.length < 32) {
			throw new IllegalArgumentException("app.jwt.secret phải dài ít nhất 32 byte (UTF-8)");
		}
		this.key = Keys.hmacShaKeyFor(bytes);
		this.expirationMs = expirationMs;
	}

	public String createToken(Authentication authentication) {
		String subject = authentication.getName();
		String authorities = authentication.getAuthorities().stream()
				.map(GrantedAuthority::getAuthority)
				.collect(Collectors.joining(","));
		Date now = new Date();
		Date exp = new Date(now.getTime() + expirationMs);
		return Jwts.builder()
				.subject(subject)
				.claim("roles", authorities)
				.issuedAt(now)
				.expiration(exp)
				.signWith(key)
				.compact();
	}

	public boolean validate(String token) {
		try {
			Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
			return true;
		}
		catch (Exception e) {
			return false;
		}
	}

	public String getEmail(String token) {
		Claims claims = Jwts.parser().verifyWith(key).build()
				.parseSignedClaims(token)
				.getPayload();
		return claims.getSubject();
	}
}
