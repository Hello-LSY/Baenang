package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.ExchangeRateDTO;
import org.project.backend.exception.exchange.ExchangeRateNotFoundException;
import org.project.backend.service.ExchangeRateService;
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

    @ApiOperation(value = "환율이 가장 많이 감소한 상위 5개 국가 조회", notes = "어제와 오늘의 환율을 비교하여 가장 많이 감소한 상위 5개 국가를 조회합니다.")
    @GetMapping(value = "/top5-decreasing", produces = "application/json")
    public ResponseEntity<List<ExchangeRateDTO>> getTop5DecreasingRates() {
        try {
            List<ExchangeRateDTO> decreasingRates = exchangeRateService.getTop5DecreasingRates();
            return ResponseEntity.ok(decreasingRates);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(value = "/history/{currencyCode}", produces = "application/json")
    public ResponseEntity<List<ExchangeRateDTO>> getExchangeRateHistoryByCurrencyCode(
            @ApiParam(value = "통화 코드", required = true) @PathVariable String currencyCode) {
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
