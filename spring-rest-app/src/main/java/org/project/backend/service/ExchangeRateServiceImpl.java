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
// 공휴일 리스트 (사전에 설정 또는 외부 API로 관리 가능)
    private static final Set<LocalDate> holidays = new HashSet<>(Arrays.asList(
            LocalDate.of(2024, 1, 1),  // 새해 (월요일)
            LocalDate.of(2024, 2, 9),  // 설날 (금요일)
            LocalDate.of(2024, 2, 10), // 설날 (토요일)
            LocalDate.of(2024, 2, 11), // 설날 (일요일)
            LocalDate.of(2024, 2, 12), // 설날 휴일 (월요일)
            LocalDate.of(2024, 3, 1),  // 3·1 운동/삼일절 (금요일)
            LocalDate.of(2024, 5, 5),  // 어린이날 (일요일)
            LocalDate.of(2024, 5, 6),  // 어린이날 휴일 (월요일)
            LocalDate.of(2024, 5, 15), // 부처님 오신 날 (수요일)
            LocalDate.of(2024, 6, 6),  // 현충일 (목요일)
            LocalDate.of(2024, 8, 15), // 광복절 (목요일)
            LocalDate.of(2024, 9, 16), // 추석 (월요일)
            LocalDate.of(2024, 9, 17), // 추석 (화요일)
            LocalDate.of(2024, 9, 18), // 추석 (수요일)
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
        // 가장 최근 영업일과 그 이전 영업일 계산
        LocalDate lastBusinessDay = getPreviousBusinessDay(LocalDate.now());
        LocalDate previousBusinessDay = getPreviousBusinessDay(lastBusinessDay.minusDays(1));

        // 두 영업일의 환율 데이터 가져오기
        List<ExchangeRate> lastBusinessDayRates = fetchRatesWithFallback(lastBusinessDay);
        List<ExchangeRate> previousBusinessDayRates = fetchRatesWithFallback(previousBusinessDay);

        // 두 영업일을 비교하여 감소한 환율 정보 추출
        Map<String, Double> previousDayRateMap = previousBusinessDayRates.stream()
                .collect(Collectors.toMap(ExchangeRate::getCurrencyCode, ExchangeRate::getExchangeRateValue));

        List<ExchangeRateDTO> decreasingRates = lastBusinessDayRates.stream()
                .filter(rate -> previousDayRateMap.containsKey(rate.getCurrencyCode()) &&
                        rate.getExchangeRateValue() < previousDayRateMap.get(rate.getCurrencyCode())) // 환율 감소 필터링
                .map(this::convertToDTO)
                .sorted(Comparator.comparingDouble(ExchangeRateDTO::getExchangeRateValue)) // 감소량 순 정렬
                .limit(5) // 상위 5개 선택
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

    // 가장 최근 영업일을 반환하는 메서드 (주말 및 공휴일을 자동으로 스킵)
    private LocalDate getPreviousBusinessDay(LocalDate date) {
        while (isNonBusinessDay(date)) {
            date = date.minusDays(1);  // 비영업일이면 전날로 이동
        }
        return date;
    }

    // 주말 또는 공휴일 여부 확인
    private boolean isNonBusinessDay(LocalDate date) {
        // 주말 여부 확인
        if (date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY) {
            return true;
        }
        // 공휴일 여부 확인
        return holidays.contains(date);
    }

    // 환율 데이터를 가져오는 기존 메서드 재사용 (비영업일이면 이전 영업일로 계속 조회)
    private List<ExchangeRate> fetchRatesWithFallback(LocalDate date) {
        List<ExchangeRate> rates = exchangeRateRepository.findByRecordedAtBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        // 만약 데이터가 없다면 이전 영업일로 계속 이동
        while (rates.isEmpty()) {
            date = getPreviousBusinessDay(date.minusDays(1));  // 이전 영업일로 이동
            rates = exchangeRateRepository.findByRecordedAtBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay());
        }

        return rates;
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
