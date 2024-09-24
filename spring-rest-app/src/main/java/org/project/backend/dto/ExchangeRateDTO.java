package org.project.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExchangeRateDTO {

    private Long id;
    private String currencyCode;
    private String currencyName;
    private Double exchangeRateValue;
    private LocalDateTime updatedAt;

}