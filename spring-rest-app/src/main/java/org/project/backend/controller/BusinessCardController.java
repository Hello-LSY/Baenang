package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.BusinessCardDTO;
import org.project.backend.dto.SavedBusinessCardDTO;
import org.project.backend.service.BusinessCardService;
import org.project.backend.service.SavedBusinessCardService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Api(tags = "BusinessCard API", description = "전자 명함 관리 API") // 컨트롤러 설명
public class BusinessCardController {

    private final BusinessCardService businessCardService;
    private final SavedBusinessCardService savedBusinessCardService;

    private static final String QR_IMAGE_PATH = "C:/upload/images/qr/";

    // 명함 생성 및 관리 관련 엔드포인트

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

    // 명함 저장소 관련 엔드포인트 (저장된 명함 관리)

    @ApiOperation(value = "명함 지갑에 명함 저장", notes = "회원 ID와 명함 ID를 사용하여 명함 지갑에 전자 명함을 저장합니다.")
    @PostMapping("/saved-business-cards")
    public ResponseEntity<SavedBusinessCardDTO> saveBusinessCard(
            @ApiParam(value = "저장할 명함 정보", required = true) @RequestBody SavedBusinessCardDTO savedBusinessCardDTO) {
        try {
            SavedBusinessCardDTO savedCard = savedBusinessCardService.saveBusinessCard(savedBusinessCardDTO.getMemberId(), savedBusinessCardDTO.getBusinessCardId());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCard); // 명함 저장 후 201 반환
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // 저장 실패 시 400 반환
        }
    }

    @ApiOperation(value = "회원의 명함 ID 목록 조회", notes = "회원 ID를 사용하여 명함 지갑에 저장된 명함 ID 목록을 조회합니다.")
    @GetMapping("/saved-business-cards/members/{memberId}/ids")
    public ResponseEntity<List<SavedBusinessCardDTO>> getSavedBusinessCardIds(
            @ApiParam(value = "회원 ID", required = true) @PathVariable Long memberId) {
        try {
            List<SavedBusinessCardDTO> savedCards = savedBusinessCardService.getSavedBusinessCardIds(memberId);
            return ResponseEntity.ok(savedCards);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 조회 실패 시 404 반환
        }
    }

    @ApiOperation(value = "회원의 저장된 명함 정보 조회", notes = "회원 ID를 사용하여 명함 지갑에 저장된 전자 명함 정보를 조회합니다.")
    @GetMapping("/saved-business-cards/members/{memberId}/cards")
    public ResponseEntity<List<BusinessCardDTO>> getSavedBusinessCards(
            @ApiParam(value = "회원 ID", required = true) @PathVariable Long memberId) {
        try {
            List<BusinessCardDTO> savedCards = savedBusinessCardService.getSavedBusinessCards(memberId);
            return ResponseEntity.ok(savedCards);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 조회 실패 시 404 반환
        }
    }

    // 이미지 파일 제공 엔드포인트
    @ApiOperation(value = "QR 코드 이미지 제공", notes = "파일 이름을 통해 QR 코드 이미지를 제공합니다.")
    @GetMapping("/qr-images/{fileName}")
    public ResponseEntity<Resource> getQRCodeImage(
            @ApiParam(value = "파일 이름", required = true) @PathVariable String fileName) {
        try {
            File file = new File(QR_IMAGE_PATH + fileName);
            Resource resource = new FileSystemResource(file);

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .contentType(MediaType.IMAGE_PNG) // 이미지 MIME 타입 설정
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
