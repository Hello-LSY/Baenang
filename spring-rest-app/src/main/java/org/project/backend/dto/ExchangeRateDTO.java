package org.project.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExchangeRateDTO {
    private Long id; // auto increment 필드
    private String currencyCode;
    private String currencyName;
    private Double exchangeRateValue;
    private LocalDateTime recordedAt;
    private boolean isDecreasing; // 하락 여부
    private Double exchangeChangePercentage;
}
