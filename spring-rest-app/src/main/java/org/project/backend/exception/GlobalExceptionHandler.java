package org.project.backend.exception;

import org.project.backend.exception.businessCard.BusinessCardMemberNotFoundException; // 수정된 이름
import org.project.backend.exception.member.GeneralMemberNotFoundException; // 수정된 이름
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 커스텀 예외처리(Exception)를 사용하는 이유?
     * - 도메인에 특화된 의미 있는 오류 메시지를 제공
     * - 구체적인 예외 처리를 통해 유연한 오류 대응 가능
     */

    // 일반적인 회원을 찾지 못했을 때 발생하며, 404 상태 코드와 예외 메시지를 반환
    @ExceptionHandler(GeneralMemberNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleGeneralMemberNotFoundException(GeneralMemberNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    // 비즈니스 카드 도메인에서 회원을 찾지 못했을 때 발생하며, 404 상태 코드와 예외 메시지를 반환
    @ExceptionHandler(BusinessCardMemberNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleBusinessCardMemberNotFoundException(BusinessCardMemberNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    // 예기치 않은 서버 오류가 발생했을 때 반환하며, 500 상태 코드와 기본 오류 메시지를 반환
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ex.printStackTrace(); // 로그를 남겨서 오류 추적이 가능하게

        ErrorResponse errorResponse = new ErrorResponse(
                "Internal Server Error",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
