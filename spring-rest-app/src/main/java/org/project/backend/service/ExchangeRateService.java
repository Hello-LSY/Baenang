package org.project.backend.service;

import org.project.backend.dto.ExchangeRateDTO;
import java.util.List;

public interface ExchangeRateService {
    List<ExchangeRateDTO> saveExchangeRates(String searchDate, String data); // 환율 데이터를 저장하는 메서드
    List<ExchangeRateDTO> getAllExchangeRates(); // 모든 환율 데이터를 조회하는 메서드
    List<ExchangeRateDTO> getAllRatesSortedByDecreaseThenIncrease();
    List<ExchangeRateDTO> getExchangeRateByCurrencyCode(String currencyCode); // 국가 코드로 데이터를 조회하는 메서드
    List<ExchangeRateDTO> getLatestExchangeRates();
}
