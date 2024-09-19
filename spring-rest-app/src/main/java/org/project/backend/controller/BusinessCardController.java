package org.project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.BusinessCardDTO;
import org.project.backend.service.BusinessCardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/business-cards")
@RequiredArgsConstructor
public class BusinessCardController {

    private final BusinessCardService businessCardService;

    // 특정 회원의 명함 정보를 조회하는 엔드포인트
    @GetMapping("/member/{memberId}")
    public ResponseEntity<BusinessCardDTO> getBusinessCardByMemberId(@PathVariable Long memberId) {
        try {
            BusinessCardDTO businessCardDTO = businessCardService.getBusinessCardByMemberId(memberId);
            return ResponseEntity.ok(businessCardDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 명함을 찾지 못했을 때 404 반환
        }
    }

    // 명함 ID로 명함 정보를 조회하는 엔드포인트
    @GetMapping("/{cardId}")
    public ResponseEntity<BusinessCardDTO> getBusinessCardById(@PathVariable Long cardId) {
        try {
            BusinessCardDTO businessCardDTO = businessCardService.getBusinessCardById(cardId);
            return ResponseEntity.ok(businessCardDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 명함을 찾지 못했을 때 404 반환
        }
    }

    // 새로운 명함을 생성하는 엔드포인트
    @PostMapping("/member/{memberId}")
    public ResponseEntity<BusinessCardDTO> createBusinessCard(@PathVariable Long memberId, @RequestBody BusinessCardDTO businessCardDTO) {
        try {
            BusinessCardDTO createdBusinessCardDTO = businessCardService.createBusinessCard(memberId, businessCardDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBusinessCardDTO); // 명함 생성 후 201 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // 오류 발생 시 400 반환
        }
    }

    // 기존 명함 정보를 업데이트하는 엔드포인트
    @PutMapping("/{cardId}")
    public ResponseEntity<BusinessCardDTO> updateBusinessCard(@PathVariable Long cardId, @RequestBody BusinessCardDTO businessCardDTO) {
        try {
            BusinessCardDTO updatedBusinessCardDTO = businessCardService.updateBusinessCard(cardId, businessCardDTO);
            return ResponseEntity.ok(updatedBusinessCardDTO); // 성공적으로 업데이트된 정보를 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 명함을 찾지 못했을 때 404 반환
        }
    }

    // 명함 정보를 삭제하는 엔드포인트
    @DeleteMapping("/{cardId}")
    public ResponseEntity<String> deleteBusinessCard(@PathVariable Long cardId) {
        try {
            businessCardService.deleteBusinessCard(cardId);
            return ResponseEntity.noContent().build(); // 명함 삭제 후 204 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Business Card not found"); // 명함을 찾지 못했을 때 404 반환
        }
    }
}
