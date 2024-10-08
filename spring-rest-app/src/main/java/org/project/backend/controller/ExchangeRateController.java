package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.ExchangeRateDTO;
import org.project.backend.exception.exchange.ExchangeRateNotFoundException;
import org.project.backend.service.ExchangeRateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exchange")
@RequiredArgsConstructor
@Api(tags = "ExchangeRate API", description = "환율 관리 API") // Swagger 컨트롤러 설명
public class ExchangeRateController {

    private final ExchangeRateService exchangeRateService;
    private static final Logger logger = LoggerFactory.getLogger(ExchangeRateController.class); // Logger 초기화

    @ApiOperation(value = "환율 데이터 저장", notes = "특정 날짜와 데이터 타입에 따라 환율 데이터를 저장합니다.")
    @GetMapping(value = "/save", produces = "application/json")
    public ResponseEntity<String> saveExchangeRates(
            @ApiParam(value = "검색 요청 날짜", required = true, example = "20240924") @RequestParam String searchDate,
            @ApiParam(value = "검색 요청 API 타입", required = true, example = "AP01") @RequestParam String data) {
        try {
            exchangeRateService.saveExchangeRates(searchDate, data);
            return ResponseEntity.ok("Exchange rates saved successfully!");
        } catch (ExchangeRateNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Failed to save exchange rates: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error occurred: " + e.getMessage());
        }
    }

    @ApiOperation(value = "모든 환율 데이터 조회", notes = "데이터베이스에 저장된 모든 환율 정보를 조회합니다.")
    @GetMapping(value = "/all", produces = "application/json")
    public ResponseEntity<List<ExchangeRateDTO>> getAllExchangeRates() {
        try {
            List<ExchangeRateDTO> exchangeRates = exchangeRateService.getAllExchangeRates();
            return ResponseEntity.ok(exchangeRates); // 성공적으로 조회된 데이터를 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 오류 발생 시 500 반환
        }
    }

    @ApiOperation(value = "모든 국가의 환율 변동 조회", notes = "모든 국가에 대한 환율 변동 정보를 조회합니다.")
    @GetMapping(value = "/all-with-change", produces = "application/json")
    public ResponseEntity<List<ExchangeRateDTO>> getAllRatesWithChange() {
        try {
            List<ExchangeRateDTO> allRatesWithChange = exchangeRateService.getAllRatesSortedByDecreaseThenIncrease();
            return ResponseEntity.ok(allRatesWithChange);
        } catch (ExchangeRateNotFoundException e) {
            logger.error("ExchangeRateNotFoundException: " + e.getMessage(), e); // 예외 로그 추가
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        } catch (Exception e) {
            logger.error("Unexpected error occurred: " + e.getMessage(), e); // 전체 예외 처리 로그
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }



    @ApiOperation(value = "특정 통화 코드의 환율 기록 조회", notes = "특정 통화 코드의 환율 변동 기록을 조회합니다.")
    @GetMapping(value = "/{currencyCode}", produces = "application/json")
    public ResponseEntity<List<ExchangeRateDTO>> getExchangeRateByCurrencyCode(
            @ApiParam(value = "통화 코드", required = true, example = "USD") //여기에 실제 예시 값 입력
            @PathVariable String currencyCode) {
        try {
            List<ExchangeRateDTO> exchangeRates = exchangeRateService.getExchangeRateByCurrencyCode(currencyCode);
            return ResponseEntity.ok(exchangeRates);
        } catch (ExchangeRateNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @ApiOperation(value = "최신 환율 데이터 조회", notes = "가장 최신 영업일의 환율 정보를 조회합니다.")
    @GetMapping(value = "/latest", produces = "application/json")
    public ResponseEntity<List<ExchangeRateDTO>> getLatestExchangeRates() {
        try {
            List<ExchangeRateDTO> latestRates = exchangeRateService.getLatestExchangeRates();
            return ResponseEntity.ok(latestRates);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}
