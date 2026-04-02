package com.example.J2AutoParts.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.J2AutoParts.exception.ApiErrorBody;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RestAuthHandlers {

	private final ObjectMapper objectMapper;

	public AuthenticationEntryPoint authenticationEntryPoint() {
		return (request, response, authException) -> writeJson(
				response,
				HttpServletResponse.SC_UNAUTHORIZED,
				"Yêu cầu đăng nhập hoặc token không hợp lệ");
	}

	public AccessDeniedHandler accessDeniedHandler() {
		return (request, response, accessDeniedException) -> writeJson(
				response,
				HttpServletResponse.SC_FORBIDDEN,
				"Bạn không có quyền thực hiện thao tác này");
	}

	private void writeJson(HttpServletResponse response, int status, String message) throws IOException {
		response.setStatus(status);
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding(StandardCharsets.UTF_8.name());
		ApiErrorBody body = ApiErrorBody.builder().message(message).fieldErrors(Map.of()).build();
		objectMapper.writeValue(response.getOutputStream(), body);
	}
}
