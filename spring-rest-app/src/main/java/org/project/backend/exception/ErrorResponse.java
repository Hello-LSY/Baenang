package org.project.backend.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ErrorResponse {
    private String message;     // 예외 메시지
    private int status;         // 상태 코드
    private LocalDateTime timestamp; // 예외 발생 시간
}
