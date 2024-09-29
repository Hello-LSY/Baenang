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

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
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

                        // KRW(한국 원화)는 저장하지 않음
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

    @Override
    public List<ExchangeRateDTO> getTop5DecreasingRates() {
        // 어제 날짜 구하기
        LocalDate yesterday = LocalDate.now().minusDays(1);

        // 오늘 날짜 구하기
        LocalDate today = LocalDate.now();

        // 어제와 오늘의 환율 데이터 가져오기
        List<ExchangeRate> todayRates = fetchRatesWithFallback(today);
        List<ExchangeRate> yesterdayRates = fetchRatesWithFallback(yesterday);

        // 어제와 오늘의 환율을 비교하여 환율이 감소한 국가 목록 추출
        Map<String, Double> yesterdayRateMap = yesterdayRates.stream()
                .collect(Collectors.toMap(ExchangeRate::getCurrencyCode, ExchangeRate::getExchangeRateValue));

        List<ExchangeRateDTO> decreasingRates = todayRates.stream()
                .filter(todayRate -> yesterdayRateMap.containsKey(todayRate.getCurrencyCode()) &&
                        todayRate.getExchangeRateValue() < yesterdayRateMap.get(todayRate.getCurrencyCode())) // 환율 감소한 경우 필터링
                .map(this::convertToDTO)
                .sorted(Comparator.comparingDouble(ExchangeRateDTO::getExchangeRateValue)) // 가장 큰 감소순으로 정렬
                .limit(5) // 상위 5개만 선택
                .collect(Collectors.toList());

        return decreasingRates;
    }

    private List<ExchangeRate> fetchRatesWithFallback(LocalDate date) {
        List<ExchangeRate> rates = exchangeRateRepository.findByRecordedAtBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        // 만약 데이터가 없다면 이전 날짜로 계속 조회
        while (rates.isEmpty()) {
            date = date.minusDays(1);  // 전날로 이동
            rates = exchangeRateRepository.findByRecordedAtBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay());
        }

        return rates;
    }

    @Override
    public List<ExchangeRateDTO> getExchangeRateByCurrencyCode(String currencyCode) {
        List<ExchangeRate> exchangeRates = exchangeRateRepository.findByCurrencyCode(currencyCode);
        if (exchangeRates.isEmpty()) {
            throw new ExchangeRateNotFoundException("No exchange rate data found for currency code: " + currencyCode);
        }
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
        try {
            String url = UriComponentsBuilder.fromHttpUrl(EXCHANGE_RATE_API_URL)
                    .queryParam("authkey", AUTH_KEY)
                    .queryParam("searchdate", searchDate)
                    .queryParam("data", data)
                    .toUriString();

            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            } else {
                logger.error("Failed to fetch exchange rates, status code: " + response.getStatusCode());
                throw new ExchangeRateNotFoundException("Failed to fetch exchange rates, status code: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error("Error occurred while fetching exchange rates: ", e);
            throw new ExchangeRateNotFoundException("Error occurred while fetching exchange rates: " + e.getMessage());
        }
    }
}
