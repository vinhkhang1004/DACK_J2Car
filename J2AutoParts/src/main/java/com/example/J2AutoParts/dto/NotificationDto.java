package com.example.J2AutoParts.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {
    private String type; // "NEW_ORDER", "STATUS_UPDATE"
    private String message;
    private Long orderId;
    private LocalDateTime timestamp;
}
