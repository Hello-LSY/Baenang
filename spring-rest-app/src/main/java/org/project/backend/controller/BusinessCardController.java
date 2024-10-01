package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.BusinessCardDTO;
import org.project.backend.service.BusinessCardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Api(tags = "BusinessCard API", description = "전자 명함 관리 API") // 컨트롤러 설명
public class BusinessCardController {

    private static final Logger logger = LoggerFactory.getLogger(BusinessCardController.class);

    private final BusinessCardService businessCardService;

    @ApiOperation(value = "회원 ID로 새로운 명함 생성", notes = "회원 ID를 사용하여 새로운 전자 명함을 생성합니다.")
    @PostMapping("/business-cards/members/{memberId}")
    public ResponseEntity<BusinessCardDTO> createBusinessCard(
            @ApiParam(value = "회원 ID", required = true) @PathVariable Long memberId,
            @ApiParam(value = "생성할 명함 정보", required = true) @RequestBody BusinessCardDTO businessCardDTO) {
        try {
            // 비즈니스 로직 처리 (이미지 URL 포함)
            BusinessCardDTO createdBusinessCardDTO = businessCardService.createBusinessCard(memberId, businessCardDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBusinessCardDTO);
        } catch (RuntimeException e) {
            logger.error("Error creating business card", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (Exception e) {
            logger.error("Internal server error while creating business card", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @ApiOperation(value = "회원 ID로 명함 조회", notes = "회원 ID를 사용하여 전자 명함을 조회합니다.")
    @GetMapping("/business-cards/members/{memberId}")
    public ResponseEntity<BusinessCardDTO> getBusinessCardByMemberId(
            @ApiParam(value = "회원 ID", required = true) @PathVariable Long memberId) {
        try {
            // 비즈니스 로직을 통해 명함 정보 조회
            BusinessCardDTO businessCardDTO = businessCardService.getBusinessCardByMemberId(memberId);
            return ResponseEntity.ok(businessCardDTO); // 조회된 명함 정보를 반환
        } catch (RuntimeException e) {
            logger.error("Business card not found for member ID: {}", memberId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 명함을 찾지 못했을 때 404 반환
        } catch (Exception e) {
            logger.error("Internal server error while retrieving business card", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 내부 서버 오류 시 500 반환
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
            logger.error("Business card not found with ID: {}", cardId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 명함을 찾지 못했을 때 404 반환
        } catch (Exception e) {
            logger.error("Internal server error while updating business card", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 내부 서버 오류 시 500 반환
        }
    }
}
