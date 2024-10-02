package org.project.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExchangeRateDTO {
    private Long id; // 이 필드는 null 또는 0으로 설정해 auto increment이므로 직접 입력하지 않도록 유도
    private String currencyCode; // 예시 값: "USD"
    private String currencyName; // 예시 값: "United States Dollar"
    private Double exchangeRateValue; // 예시 값: 1100.50
    private LocalDateTime recordedAt; // 예시 값: LocalDateTime.now()
}
