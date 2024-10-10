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
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.function.BinaryOperator;
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

    // 공휴일 리스트
    private static final Set<LocalDate> holidays = new HashSet<>(Arrays.asList(
            LocalDate.of(2024, 1, 1), LocalDate.of(2024, 2, 9), LocalDate.of(2024, 2, 10),
            LocalDate.of(2024, 2, 11), LocalDate.of(2024, 2, 12), LocalDate.of(2024, 3, 1),
            LocalDate.of(2024, 5, 5), LocalDate.of(2024, 5, 6), LocalDate.of(2024, 5, 15),
            LocalDate.of(2024, 6, 6), LocalDate.of(2024, 8, 15), LocalDate.of(2024, 9, 16),
            LocalDate.of(2024, 9, 17), LocalDate.of(2024, 9, 18), LocalDate.of(2024, 10, 1),
            LocalDate.of(2024, 10, 3), LocalDate.of(2024, 10, 9), LocalDate.of(2024, 12, 25)
    ));

    @Transactional
    @Override
    public List<ExchangeRateDTO> saveExchangeRates(String searchDate, String data) {
        List<Map<String, Object>> exchangeRateList = fetchExchangeRatesWithFallback(searchDate, data);

        if (exchangeRateList != null && !exchangeRateList.isEmpty()) {
            List<ExchangeRate> newRates = exchangeRateList.stream()
                    .map(rate -> {
                        String currencyCode = (String) rate.get("cur_unit");
                        Double dealBasR = parseDouble(rate.get("deal_bas_r"));
                        String currencyName = (String) rate.get("cur_nm");

                        if ("KRW".equals(currencyCode) || currencyCode == null || dealBasR == null || currencyName == null) {
//                            logger.warn("Skipping invalid currency data: {}", currencyCode);
                            return null;
                        }

                        LocalDateTime recordedAt = LocalDate.parse(searchDate, DATE_FORMAT).atStartOfDay();
                        Optional<ExchangeRate> existingRate = exchangeRateRepository
                                .findByCurrencyCodeAndRecordedAt(currencyCode, recordedAt);

                        if (!existingRate.isPresent()) {
                            return ExchangeRate.builder()
                                    .currencyCode(currencyCode)
                                    .currencyName(currencyName)
                                    .exchangeRateValue(dealBasR)
                                    .recordedAt(recordedAt)
                                    .build();
                        } else {
//                            logger.info("Exchange rate for {} on {} already exists.", currencyCode, searchDate);
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            exchangeRateRepository.saveAll(newRates);

            return newRates.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } else {
            throw new ExchangeRateNotFoundException("No exchange rate data found for the given date.");
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
    public List<ExchangeRateDTO> getAllRatesSortedByDecreaseThenIncrease() {
        LocalDate lastBusinessDay = getPreviousBusinessDay(LocalDate.now());
        LocalDate previousBusinessDay = getPreviousBusinessDay(lastBusinessDay.minusDays(1));

        logger.info("Last business day: {}, Previous business day: {}", lastBusinessDay, previousBusinessDay);

        List<ExchangeRate> lastBusinessDayRates = fetchRatesWithFallback(lastBusinessDay);
        List<ExchangeRate> previousBusinessDayRates = fetchRatesWithFallback(previousBusinessDay);

        if (lastBusinessDayRates.isEmpty() || previousBusinessDayRates.isEmpty()) {
            logger.warn("One of the days does not have rates: Last: {}, Previous: {}", lastBusinessDayRates.isEmpty(), previousBusinessDayRates.isEmpty());
            return Collections.emptyList();
        }

        // 통화 코드와 날짜를 키로 사용하여 맵 생성
        Map<String, ExchangeRate> previousDayRateMap = previousBusinessDayRates.stream()
                .collect(Collectors.toMap(
                        rate -> rate.getCurrencyCode() + "_" + rate.getRecordedAt().toLocalDate(),  // 통화 코드와 날짜를 결합하여 키로 사용
                        rate -> rate,
                        BinaryOperator.maxBy(Comparator.comparing(ExchangeRate::getRecordedAt))
                ));

        // 하락한 환율 리스트
        List<ExchangeRateDTO> decreasingRates = lastBusinessDayRates.stream()
                .filter(rate -> {
                    String currencyKey = rate.getCurrencyCode() + "_" + previousBusinessDay;
                    ExchangeRate previousRate = previousDayRateMap.get(currencyKey);

                    if (previousRate != null) {
                        double rateDifference = rate.getExchangeRateValue() - previousRate.getExchangeRateValue();
                        logger.info("Currency code: {}, Last day rate: {}, Previous day rate: {}, Difference: {}",
                                rate.getCurrencyCode(), rate.getExchangeRateValue(), previousRate.getExchangeRateValue(), rateDifference);
                        return rateDifference < 0;  // 하락한 경우만 필터링
                    }
                    return false;
                })
                .map(rate -> convertToDTO(rate, previousDayRateMap.get(rate.getCurrencyCode() + "_" + previousBusinessDay).getExchangeRateValue()))
                .sorted(Comparator.comparingDouble(ExchangeRateDTO::getExchangeRateValue))
                .collect(Collectors.toList());

        logger.info("Decreasing rates: {}", decreasingRates);

        // 상승한 환율 리스트
        List<ExchangeRateDTO> increasingRates = lastBusinessDayRates.stream()
                .filter(rate -> {
                    String currencyKey = rate.getCurrencyCode() + "_" + previousBusinessDay;
                    ExchangeRate previousRate = previousDayRateMap.get(currencyKey);

                    if (previousRate != null) {
                        double rateDifference = rate.getExchangeRateValue() - previousRate.getExchangeRateValue();
                        logger.info("Currency code: {}, Last day rate: {}, Previous day rate: {}, Difference: {}",
                                rate.getCurrencyCode(), rate.getExchangeRateValue(), previousRate.getExchangeRateValue(), rateDifference);
                        return rateDifference > 0;  // 상승한 경우만 필터링
                    }
                    return false;
                })
                .map(rate -> convertToDTO(rate, previousDayRateMap.get(rate.getCurrencyCode() + "_" + previousBusinessDay).getExchangeRateValue()))
                .sorted(Comparator.comparingDouble(ExchangeRateDTO::getExchangeRateValue))
                .collect(Collectors.toList());

        decreasingRates.addAll(increasingRates);

        return decreasingRates;
    }

    @Override
    public List<ExchangeRateDTO> getExchangeRateByCurrencyCode(String currencyCode) {
        List<ExchangeRate> exchangeRates = exchangeRateRepository.findByCurrencyCode(currencyCode);
        if (exchangeRates.isEmpty()) {
            throw new ExchangeRateNotFoundException("No exchange rate data found for currency code: " + currencyCode);
        }

        // 등락률을 계산할 수 있는 가장 최근 영업일과 이전 영업일 가져오기
        LocalDate lastBusinessDay = getPreviousBusinessDay(LocalDate.now());
        LocalDate previousBusinessDay = getPreviousBusinessDay(lastBusinessDay.minusDays(1));

        // 해당 통화의 최근 영업일 환율과 이전 영업일 환율 가져오기
        Optional<ExchangeRate> lastRateOptional = exchangeRateRepository.findByCurrencyCodeAndRecordedAt(currencyCode, lastBusinessDay.atStartOfDay());
        Optional<ExchangeRate> previousRateOptional = exchangeRateRepository.findByCurrencyCodeAndRecordedAt(currencyCode, previousBusinessDay.atStartOfDay());

        Double previousRate = previousRateOptional.map(ExchangeRate::getExchangeRateValue).orElse(null);

        // 등락률을 계산하고 반환
        return exchangeRates.stream()
                .map(rate -> convertToDTO(rate, previousRate))
                .collect(Collectors.toList());
    }


    @Override
    public List<ExchangeRateDTO> getLatestExchangeRates() {
        LocalDate latestBusinessDay = getPreviousBusinessDay(LocalDate.now());
        List<ExchangeRate> latestRates = fetchRatesWithFallback(latestBusinessDay);

        return latestRates.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
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

    private ExchangeRateDTO convertToDTO(ExchangeRate exchangeRate, Double previousRate) {
        Double changePercentage = null;

        if (previousRate != null && previousRate != 0) {
            changePercentage = ((exchangeRate.getExchangeRateValue() - previousRate) / previousRate) * 100;
        }

        return ExchangeRateDTO.builder()
                .id(exchangeRate.getId())
                .currencyCode(exchangeRate.getCurrencyCode())
                .currencyName(exchangeRate.getCurrencyName())
                .exchangeRateValue(exchangeRate.getExchangeRateValue())
                .recordedAt(exchangeRate.getRecordedAt())
                .exchangeChangePercentage(changePercentage)  // 변동률
                .build();
    }




    private LocalDate getPreviousBusinessDay(LocalDate date) {
        if (LocalTime.now().isBefore(LocalTime.of(11, 1))) {
            date = date.minusDays(1);
        }
        while (isNonBusinessDay(date)) {
            date = date.minusDays(1);
        }
        return date;
    }

    private boolean isNonBusinessDay(LocalDate date) {
        return date.getDayOfWeek() == DayOfWeek.SATURDAY || date.getDayOfWeek() == DayOfWeek.SUNDAY || holidays.contains(date);
    }

    private List<ExchangeRate> fetchRatesWithFallback(LocalDate date) {
        List<ExchangeRate> rates = exchangeRateRepository.findByRecordedAtBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay());

        LocalDate minDate = LocalDate.now().minusYears(1);

        while (rates.isEmpty()) {
            if (date.isBefore(minDate)) {
                throw new ExchangeRateNotFoundException("No exchange rate data available in the last year.");
            }

            date = getPreviousBusinessDay(date.minusDays(1));
            rates = exchangeRateRepository.findByRecordedAtBetween(date.atStartOfDay(), date.plusDays(1).atStartOfDay());
        }

        return rates;
    }

    private Double parseDouble(Object value) {
        try {
            return value != null ? Double.parseDouble(value.toString().replace(",", "")) : null;
        } catch (NumberFormatException e) {
            logger.error("Failed to parse value: " + value, e);
            return null;
        }
    }

    private List<Map<String, Object>> fetchExchangeRatesWithFallback(String searchDate, String data) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl(EXCHANGE_RATE_API_URL)
                    .queryParam("authkey", AUTH_KEY)
                    .queryParam("searchdate", searchDate)
                    .queryParam("data", data)
                    .toUriString();

            ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null && !response.getBody().isEmpty()) {
                return response.getBody();
            } else {
                logger.warn("Received empty or null data for {}. Falling back to previous business day.", searchDate);
                return fetchExchangeRatesWithFallback(LocalDate.parse(searchDate, DATE_FORMAT).minusDays(1).format(DATE_FORMAT), data);
            }
        } catch (Exception e) {
            logger.error("Error fetching exchange rates: ", e);
            throw new ExchangeRateNotFoundException("Error fetching exchange rates: " + e.getMessage());
        }
    }
}
