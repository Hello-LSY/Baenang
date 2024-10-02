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

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
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

    // 공휴일 리스트 (사전에 설정 또는 외부 API로 관리 가능)
    private static final Set<LocalDate> holidays = new HashSet<>(Arrays.asList(
            LocalDate.of(2024, 1, 1),  // 새해 (월요일)
            LocalDate.of(2024, 2, 9),  // 설날 (금요일)
            LocalDate.of(2024, 2, 10), // 설날 (토요일)
            LocalDate.of(2024, 2, 11), // 설날 (일요일)
            LocalDate.of(2024, 2, 12), // 설날 휴일 (월요일)
            LocalDate.of(2024, 3, 1),  // 삼일절 (금요일)
            LocalDate.of(2024, 5, 5),  // 어린이날 (일요일)
            LocalDate.of(2024, 5, 6),  // 어린이날 휴일 (월요일)
            LocalDate.of(2024, 5, 15), // 부처님 오신 날 (수요일)
            LocalDate.of(2024, 6, 6),  // 현충일 (목요일)
            LocalDate.of(2024, 8, 15), // 광복절 (목요일)
            LocalDate.of(2024, 9, 16), // 추석 (월요일)
            LocalDate.of(2024, 9, 17), // 추석 (화요일)
            LocalDate.of(2024, 9, 18), // 추석 (수요일)
            LocalDate.of(2024, 10, 1), // 국군의날 (목요일)
            LocalDate.of(2024, 10, 3), // 개천절 (목요일)
            LocalDate.of(2024, 10, 9), // 한글날 (수요일)
            LocalDate.of(2024, 12, 25) // 크리스마스 (수요일)
    ));

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
                            return null;
                        }

                        // 새로 데이터를 기록
                        return ExchangeRate.builder()
                                .currencyCode(currencyCode)
                                .currencyName(currencyName)
                                .exchangeRateValue(dealBasR)
                                .recordedAt(LocalDate.parse(searchDate, DATE_FORMAT).atStartOfDay()) // searchDate를 기준으로 설정
                                .build();
                    })
                    .filter(Objects::nonNull)
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
        LocalDate lastBusinessDay = getPreviousBusinessDay(LocalDate.now());
        LocalDate previousBusinessDay = getPreviousBusinessDay(lastBusinessDay.minusDays(1));

        List<ExchangeRate> lastBusinessDayRates = fetchRatesWithFallback(lastBusinessDay);
        List<ExchangeRate> previousBusinessDayRates = fetchRatesWithFallback(previousBusinessDay);

        Map<String, Double> previousDayRateMap = previousBusinessDayRates.stream()
                .collect(Collectors.toMap(ExchangeRate::getCurrencyCode, ExchangeRate::getExchangeRateValue));

        List<ExchangeRateDTO> decreasingRates = lastBusinessDayRates.stream()
                .filter(rate -> previousDayRateMap.containsKey(rate.getCurrencyCode()) &&
                        rate.getExchangeRateValue() < previousDayRateMap.get(rate.getCurrencyCode()))
                .map(this::convertToDTO)
                .sorted(Comparator.comparingDouble(ExchangeRateDTO::getExchangeRateValue))
                .limit(5)
                .collect(Collectors.toList());

        return decreasingRates;
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

    @Override
    public List<ExchangeRateDTO> getLatestExchangeRates() {
        // 오늘 날짜를 기준으로 최신 영업일 환율 데이터를 가져옴
        LocalDate latestBusinessDay = getPreviousBusinessDay(LocalDate.now());
        List<ExchangeRate> latestRates = fetchRatesWithFallback(latestBusinessDay);

        // 데이터를 DTO로 변환하여 반환
        return latestRates.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private LocalDate getPreviousBusinessDay(LocalDate date) {
        // 현재 시간이 11시 이전이면 전날 영업일을 기준으로 설정
        if (LocalTime.now().isBefore(LocalTime.of(11, 1))) {
            date = date.minusDays(1);
        }
        while (isNonBusinessDay(date)) {
            date = date.minusDays(1);  // 비영업일이면 전날로 이동
        }
        return date;
    }


    private boolean isNonBusinessDay(LocalDate date) {
        if (date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY) {
            return true;
        }
        return holidays.contains(date);
    }

    private List<ExchangeRate> fetchRatesWithFallback(LocalDate date) {
        List<ExchangeRate> rates = exchangeRateRepository.findByRecordedAtBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        // 최대 검색 범위를 1년 전으로 설정
        LocalDate minDate = LocalDate.now().minusYears(1);

        while (rates.isEmpty()) {
            if (date.isBefore(minDate)) {
                // 만약 최소 날짜까지 내려갔는데도 데이터가 없으면 예외 발생
                throw new ExchangeRateNotFoundException("No exchange rate data available in the last year.");
            }

            date = getPreviousBusinessDay(date.minusDays(1));  // 이전 영업일로 이동
            rates = exchangeRateRepository.findByRecordedAtBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay());
        }

        return rates;
    }



    private ExchangeRateDTO convertToDTO(ExchangeRate exchangeRate) {
        return ExchangeRateDTO.builder()
                .id(exchangeRate.getId())
                .currencyCode(exchangeRate.getCurrencyCode())
                .currencyName(exchangeRate.getCurrencyName())
                .exchangeRateValue(exchangeRate.getExchangeRateValue())
                .recordedAt(exchangeRate.getRecordedAt())
                .build();
    }

    private Double parseDouble(Object value) {
        try {
            return value != null ? Double.parseDouble(value.toString()) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

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
