package org.project.backend.service;

import org.project.backend.dto.ExchangeRateDTO;
import java.util.List;


public interface ExchangeRateService {
    void updateExchangeRates(String searchDate, String data);
    List<ExchangeRateDTO> getAllExchangeRates();
    ExchangeRateDTO getExchangeRateByCurrencyCode(String currencyCode);
    void deleteExchangeRate(String currencyCode);
}
