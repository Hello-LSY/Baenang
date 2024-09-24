package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.ExchangeRateDTO;
import org.project.backend.exception.exchange.ExchangeRateNotFoundException;
import org.project.backend.model.ExchangeRate;
import org.project.backend.repository.ExchangeRateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import java.time.format.DateTimeFormatter;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExchangeRateServiceImpl implements ExchangeRateService {

    private static final Logger logger = LoggerFactory.getLogger(ExchangeRateServiceImpl.class);

    private static final String EXCHANGE_RATE_API_URL = "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON";
    private static final String AUTH_KEY = "GOjcXLOmL9DrNmgZcPGBEg1OjvW1CsN4"; // 발급받은 인증키 입력
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");

    private final RestTemplate restTemplate;
    private final ExchangeRateRepository exchangeRateRepository;

    @Transactional
    @Override
    public List<ExchangeRateDTO> saveExchangeRates(String searchDate, String data) {
        List<Map<String, Object>> exchangeRateList = fetchExchangeRates(searchDate, data);

        if (exchangeRateList != null && !exchangeRateList.isEmpty()) {
            List<ExchangeRate> newRates = exchangeRateList.stream()
                    .map(rate -> {
                        String currencyCode = (String) rate.get("cur_unit");
                        Double dealBasR = parseDouble(rate.get("deal_bas_r"));
                        String currencyName = (String) rate.get("cur_nm");

                        if ("KRW".equals(currencyCode) || currencyCode == null || dealBasR == null || currencyName == null) {
                            logger.warn("Skipping data for currency: {}. Not a valid currency for storing.", currencyCode);
                            return null; // 필수 데이터가 없을 경우 건너뛰기
                        }

                        // 새로 데이터를 기록
                        return ExchangeRate.builder()
                                .currencyCode(currencyCode)
                                .currencyName(currencyName)
                                .exchangeRateValue(dealBasR)
                                .recordedAt(LocalDate.parse(searchDate, DATE_FORMAT).atStartOfDay()) // searchDate를 기준으로 설정
                                .build();
                    })
                    .filter(rate -> rate != null)
                    .collect(Collectors.toList());

            // 데이터 저장
            exchangeRateRepository.saveAll(newRates);

            // 저장된 데이터를 DTO로 변환하여 반환
            return newRates.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } else {
            throw new ExchangeRateNotFoundException("No exchange rate data found for the given date and type.");
        }
    }

    @Override
    public List<ExchangeRateDTO> getAllExchangeRates() {
        List<ExchangeRate> exchangeRates = exchangeRateRepository.findAll();
        return exchangeRates.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 엔티티 -> DTO 변환 메서드
    private ExchangeRateDTO convertToDTO(ExchangeRate exchangeRate) {
        return ExchangeRateDTO.builder()
                .id(exchangeRate.getId())
                .currencyCode(exchangeRate.getCurrencyCode())
                .currencyName(exchangeRate.getCurrencyName())
                .exchangeRateValue(exchangeRate.getExchangeRateValue())
                .recordedAt(exchangeRate.getRecordedAt())
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

    // API로부터 환율 데이터를 가져오는 메서드
    private List<Map<String, Object>> fetchExchangeRates(String searchDate, String data) {
        String url = UriComponentsBuilder.fromHttpUrl(EXCHANGE_RATE_API_URL)
                .queryParam("authkey", AUTH_KEY)
                .queryParam("searchdate", searchDate)
                .queryParam("data", data)
                .toUriString();

        ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            return response.getBody();
        } else {
            throw new ExchangeRateNotFoundException("Failed to fetch exchange rates, status code: " + response.getStatusCode());
        }
    }
}
