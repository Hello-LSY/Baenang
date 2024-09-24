package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.ExchangeRateDTO;
import org.project.backend.exception.exchange.ExchangeRateNotFoundException;
import org.project.backend.model.ExchangeRate;
import org.project.backend.repository.ExchangeRateRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExchangeRateServiceImpl implements ExchangeRateService {

    private static final String EXCHANGE_RATE_API_URL = "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON";
    private static final String AUTH_KEY = "GOjcXLOmL9DrNmgZcPGBEg1OjvW1CsN4"; // 발급받은 인증키 입력

    private final RestTemplate restTemplate; // RestTemplate 빈 주입
    private final ExchangeRateRepository exchangeRateRepository;

    // API로부터 환율 데이터를 가져오는 메서드
    public List<Map<String, Object>> fetchExchangeRates(String searchDate, String data) {
        String url = UriComponentsBuilder.fromHttpUrl(EXCHANGE_RATE_API_URL)
                .queryParam("authkey", AUTH_KEY)
                .queryParam("searchdate", searchDate)
                .queryParam("data", data)
                .toUriString();

        return restTemplate.getForObject(url, List.class);
    }

    // 환율 데이터 저장 또는 업데이트
    @Transactional
    @Override
    public void updateExchangeRates(String searchDate, String data) {
        List<Map<String, Object>> exchangeRateList = fetchExchangeRates(searchDate, data);

        if (exchangeRateList != null) {
            for (Map<String, Object> rate : exchangeRateList) {
                String currencyCode = (String) rate.get("cur_unit");
                Double dealBasR = parseDouble(rate.get("deal_bas_r"));
                String currencyName = (String) rate.get("cur_nm");

                // 기존 데이터 존재 여부 확인 후 업데이트 또는 생성
                ExchangeRate exchangeRate = exchangeRateRepository.findByCurrencyCode(currencyCode)
                        .orElse(ExchangeRate.builder()
                                .currencyCode(currencyCode)
                                .currencyName(currencyName)
                                .exchangeRateValue(dealBasR)
                                .build());

                // 데이터 갱신 메서드를 사용하여 업데이트
                exchangeRate.updateExchangeRate(dealBasR);
                exchangeRateRepository.save(exchangeRate);
            }
        }
    }

    // DB에서 모든 환율 데이터 조회
    @Override
    public List<ExchangeRateDTO> getAllExchangeRates() {
        List<ExchangeRate> exchangeRates = exchangeRateRepository.findAll();
        return exchangeRates.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 통화 코드로 환율 정보 조회
    @Override
    public ExchangeRateDTO getExchangeRateByCurrencyCode(String currencyCode) {
        ExchangeRate exchangeRate = exchangeRateRepository.findByCurrencyCode(currencyCode)
                .orElseThrow(() -> new ExchangeRateNotFoundException("Exchange rate not found for currency: " + currencyCode));
        return convertToDTO(exchangeRate);
    }

    // 특정 통화 코드로 환율 데이터 삭제
    @Transactional
    @Override
    public void deleteExchangeRate(String currencyCode) {
        ExchangeRate exchangeRate = exchangeRateRepository.findByCurrencyCode(currencyCode)
                .orElseThrow(() -> new ExchangeRateNotFoundException("Exchange rate not found for currency: " + currencyCode));
        exchangeRateRepository.delete(exchangeRate);
    }

    // 엔티티 -> DTO 변환 메서드
    private ExchangeRateDTO convertToDTO(ExchangeRate exchangeRate) {
        return ExchangeRateDTO.builder()
                .id(exchangeRate.getId())
                .currencyCode(exchangeRate.getCurrencyCode())
                .currencyName(exchangeRate.getCurrencyName())
                .exchangeRateValue(exchangeRate.getExchangeRateValue())
                .updatedAt(exchangeRate.getUpdatedAt())
                .build();
    }

    // 문자열을 Double로 변환하는 메서드 (Null 처리 포함)
    private Double parseDouble(Object value) {
        try {
            return value != null ? Double.parseDouble(value.toString()) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
