package org.project.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.BusinessCardDTO;
import org.project.backend.dto.SavedBusinessCardDTO;
import org.project.backend.service.BusinessCardService;
import org.project.backend.service.EncryptionUtil;
import org.project.backend.service.SavedBusinessCardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.util.List;
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Api(tags = "BusinessCard API", description = "전자 명함 관리 API") // 컨트롤러 설명
public class BusinessCardController {

    private final BusinessCardService businessCardService;

    @ApiOperation(value = "회원 ID로 새로운 명함 생성", notes = "회원 ID를 사용하여 새로운 전자 명함을 생성합니다.")
    @PostMapping("/business-cards/members/{memberId}")
    public ResponseEntity<BusinessCardDTO> createBusinessCard(
            @ApiParam(value = "회원 ID", required = true) @PathVariable Long memberId,
            @ApiParam(value = "생성할 명함 정보", required = true) @RequestBody BusinessCardDTO businessCardDTO) {
        try {
            BusinessCardDTO createdBusinessCardDTO = businessCardService.createBusinessCard(memberId, businessCardDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBusinessCardDTO); // 명함 생성 후 201 반환
        } catch (RuntimeException e) {
            e.printStackTrace(); // 예외 로그 출력
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // 오류 발생 시 400 반환
        } catch (Exception e) {
            e.printStackTrace(); // 예외 로그 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 내부 서버 오류 시 500 반환
        }
    }

    @ApiOperation(value = "명함 ID로 명함 정보 조회", notes = "명함 ID를 사용하여 전자 명함 정보를 조회합니다.")
    @GetMapping("/business-cards/{cardId}")
    public ResponseEntity<BusinessCardDTO> getBusinessCardById(
            @ApiParam(value = "명함 ID", required = true) @PathVariable String cardId) {
        try {
            BusinessCardDTO businessCardDTO = businessCardService.getBusinessCardById(cardId);
            return ResponseEntity.ok(businessCardDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 명함을 찾지 못했을 때 404 반환
        }
    }

    @ApiOperation(value = "회원 ID로 명함 정보 조회", notes = "회원 ID를 사용하여 전자 명함 정보를 조회합니다.")
    @GetMapping("/business-cards/members/{memberId}")
    public ResponseEntity<BusinessCardDTO> getBusinessCardByMemberId(
            @ApiParam(value = "회원 ID", required = true) @PathVariable Long memberId) {
        try {
            BusinessCardDTO businessCardDTO = businessCardService.getBusinessCardByMemberId(memberId);
            return ResponseEntity.ok(businessCardDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 명함을 찾지 못했을 때 404 반환
        }
    }

    @ApiOperation(value = "명함 정보 업데이트", notes = "명함 ID와 업데이트할 정보를 사용하여 전자 명함을 업데이트합니다.")
    @PutMapping("/business-cards/{cardId}")
    public ResponseEntity<BusinessCardDTO> updateBusinessCard(
            @ApiParam(value = "명함 ID", required = true) @PathVariable String cardId,
            @ApiParam(value = "업데이트할 명함 정보", required = true) @RequestBody BusinessCardDTO businessCardDTO) {
        try {
            BusinessCardDTO updatedBusinessCardDTO = businessCardService.updateBusinessCard(cardId, businessCardDTO);
            return ResponseEntity.ok(updatedBusinessCardDTO); // 성공적으로 업데이트된 정보를 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 명함을 찾지 못했을 때 404 반환
        }
    }

    @ApiOperation(value = "명함 삭제", notes = "명함 ID를 사용하여 전자 명함을 삭제합니다.")
    @DeleteMapping("/business-cards/{cardId}")
    public ResponseEntity<String> deleteBusinessCard(
            @ApiParam(value = "명함 ID", required = true) @PathVariable String cardId) {
        try {
            businessCardService.deleteBusinessCard(cardId);
            return ResponseEntity.noContent().build(); // 명함 삭제 후 204 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Business Card not found"); // 명함을 찾지 못했을 때 404 반환
        }
    }
}
