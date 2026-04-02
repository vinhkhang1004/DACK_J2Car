package com.example.J2AutoParts.exception;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiErrorBody> handleValidation(MethodArgumentNotValidException ex) {
		Map<String, String> errors = ex.getBindingResult().getFieldErrors().stream()
				.collect(Collectors.toMap(
						FieldError::getField,
						fe -> fe.getDefaultMessage() != null ? fe.getDefaultMessage() : "Không hợp lệ",
						(a, b) -> a + "; " + b));
		return ResponseEntity.badRequest().body(ApiErrorBody.builder()
				.message("Dữ liệu không hợp lệ")
				.fieldErrors(errors)
				.build());
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ApiErrorBody> handleBadRequest(IllegalArgumentException ex) {
		return ResponseEntity.badRequest().body(ApiErrorBody.builder()
				.message(ex.getMessage())
				.fieldErrors(new HashMap<>())
				.build());
	}

	@ExceptionHandler(IllegalStateException.class)
	public ResponseEntity<ApiErrorBody> handleConflict(IllegalStateException ex) {
		return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiErrorBody.builder()
				.message(ex.getMessage())
				.fieldErrors(new HashMap<>())
				.build());
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ApiErrorBody> handleBadCredentials(BadCredentialsException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiErrorBody.builder()
				.message("Email hoặc mật khẩu không đúng")
				.fieldErrors(new HashMap<>())
				.build());
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiErrorBody> handleAccessDenied(AccessDeniedException ex) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ApiErrorBody.builder()
				.message("Bạn không có quyền thực hiện thao tác này")
				.fieldErrors(new HashMap<>())
				.build());
	}
}
