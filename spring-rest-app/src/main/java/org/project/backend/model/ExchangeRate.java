package org.project.backend.model;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exchange_rate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true) // Builder 패턴 사용
public class ExchangeRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String currencyCode; // 통화 코드

    @Column(nullable = false)
    private String currencyName; // 통화명

    @Column(nullable = false)
    private Double exchangeRateValue; // 환율 값

    @Column(nullable = false)
    private LocalDateTime updatedAt; // 마지막 업데이트 시간

    // 생성자 (Builder 사용 시 updatedAt 자동 설정)
    @Builder
    public ExchangeRate(String currencyCode, String currencyName, Double exchangeRateValue) {
        this.currencyCode = currencyCode;
        this.currencyName = currencyName;
        this.exchangeRateValue = exchangeRateValue;
        this.updatedAt = LocalDateTime.now(); // 기본 값 설정
    }

    // 데이터 갱신 메서드
    public void updateExchangeRate(Double exchangeRateValue) {
        this.exchangeRateValue = exchangeRateValue;
        this.updatedAt = LocalDateTime.now(); // 업데이트 시간 갱신
    }
}
