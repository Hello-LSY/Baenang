package org.project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.BusinessCardDTO;
import org.project.backend.dto.SavedBusinessCardDTO;
import org.project.backend.service.BusinessCardService;
import org.project.backend.service.SavedBusinessCardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business-cards")
@RequiredArgsConstructor
public class BusinessCardController {

    private final BusinessCardService businessCardService;
    private final SavedBusinessCardService savedBusinessCardService;

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
    public ResponseEntity<BusinessCardDTO> getBusinessCardById(@PathVariable String cardId) {
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
            e.printStackTrace(); // 예외 로그 출력
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // 오류 발생 시 400 반환
        } catch (Exception e) {
            e.printStackTrace(); // 예외 로그 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 내부 서버 오류 시 500 반환
        }
    }

    // 기존 명함 정보를 업데이트하는 엔드포인트
    @PutMapping("/{cardId}")
    public ResponseEntity<BusinessCardDTO> updateBusinessCard(@PathVariable String cardId, @RequestBody BusinessCardDTO businessCardDTO) {
        try {
            BusinessCardDTO updatedBusinessCardDTO = businessCardService.updateBusinessCard(cardId, businessCardDTO);
            return ResponseEntity.ok(updatedBusinessCardDTO); // 성공적으로 업데이트된 정보를 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 명함을 찾지 못했을 때 404 반환
        }
    }

    // 명함 정보를 삭제하는 엔드포인트
    @DeleteMapping("/{cardId}")
    public ResponseEntity<String> deleteBusinessCard(@PathVariable String cardId) {
        try {
            businessCardService.deleteBusinessCard(cardId);
            return ResponseEntity.noContent().build(); // 명함 삭제 후 204 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Business Card not found"); // 명함을 찾지 못했을 때 404 반환
        }
    }

    // 명함 저장 기능을 추가하는 엔드포인트
    @PostMapping("/save")
    public ResponseEntity<SavedBusinessCardDTO> saveBusinessCard(@RequestBody SavedBusinessCardDTO savedBusinessCardDTO) {
        try {
            SavedBusinessCardDTO savedCard = savedBusinessCardService.saveBusinessCard(savedBusinessCardDTO.getMemberId(), savedBusinessCardDTO.getBusinessCardId());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCard); // 명함 저장 후 201 반환
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // 저장 실패 시 400 반환
        }
    }

    // 특정 회원이 저장한 명함 ID 목록 조회 엔드포인트
    @GetMapping("/saved/{memberId}/ids")
    public ResponseEntity<List<SavedBusinessCardDTO>> getSavedBusinessCardIds(@PathVariable Long memberId) {
        try {
            List<SavedBusinessCardDTO> savedCards = savedBusinessCardService.getSavedBusinessCardIds(memberId);
            return ResponseEntity.ok(savedCards);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 조회 실패 시 404 반환
        }
    }

    // 특정 회원이 저장한 명함 정보 조회 엔드포인트
    @GetMapping("/saved/{memberId}/cards")
    public ResponseEntity<List<BusinessCardDTO>> getSavedBusinessCards(@PathVariable Long memberId) {
        try {
            List<BusinessCardDTO> savedCards = savedBusinessCardService.getSavedBusinessCards(memberId);
            return ResponseEntity.ok(savedCards);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 조회 실패 시 404 반환
        }
    }
}
