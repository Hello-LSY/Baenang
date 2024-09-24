package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.ExchangeRateDTO;
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

    @ApiOperation(value = "환율 데이터 갱신", notes = "특정 날짜와 데이터 타입에 따라 환율 데이터를 갱신합니다.")
    @GetMapping(value = "/update", produces = "application/json")
    public ResponseEntity<String> updateExchangeRates(
            @ApiParam(value = "검색 요청 날짜", required = true, example = "20220101") @RequestParam String searchDate,
            @ApiParam(value = "검색 요청 API 타입", required = true, example = "AP01") @RequestParam String data) {
        try {
            exchangeRateService.updateExchangeRates(searchDate, data);
            return ResponseEntity.ok("Exchange rates updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update exchange rates: " + e.getMessage());
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

    @ApiOperation(value = "특정 통화의 환율 정보 조회", notes = "특정 통화 코드를 사용하여 환율 정보를 조회합니다.")
    @GetMapping(value = "/{currencyCode}", produces = "application/json")
    public ResponseEntity<ExchangeRateDTO> getExchangeRateByCurrencyCode(
            @ApiParam(value = "통화 코드", required = true, example = "USD") @PathVariable String currencyCode) {
        try {
            ExchangeRateDTO exchangeRate = exchangeRateService.getExchangeRateByCurrencyCode(currencyCode);
            return ResponseEntity.ok(exchangeRate); // 성공적으로 조회된 환율 정보를 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 환율 정보를 찾지 못했을 때 404 반환
        }
    }

    @ApiOperation(value = "특정 통화의 환율 데이터 삭제", notes = "특정 통화 코드를 사용하여 환율 데이터를 삭제합니다.")
    @DeleteMapping(value = "/{currencyCode}", produces = "application/json")
    public ResponseEntity<String> deleteExchangeRate(
            @ApiParam(value = "통화 코드", required = true, example = "USD") @PathVariable String currencyCode) {
        try {
            exchangeRateService.deleteExchangeRate(currencyCode);
            return ResponseEntity.noContent().build(); // 성공적으로 삭제된 경우 204 반환
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exchange rate not found"); // 데이터를 찾지 못했을 때 404 반환
        }
    }
}
