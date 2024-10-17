package org.project.backend.model;

import lombok.*;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table(name = "exchange_rate")
public class ExchangeRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "currency_code", nullable = false)
    private String currencyCode; // 통화 코드

    @Column(name = "currency_name", nullable = false)
    private String currencyName; // 통화 이름

    @Column(name = "exchange_rate_value", nullable = false)
    private Double exchangeRateValue; // 환율 값

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt; // 해당일 환율 일자
}
