package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.DocumentDTO;
import org.project.backend.dto.ResidentRegistrationDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.service.DocumentService;
import org.project.backend.service.ResidentRegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/residentregistration")
@RequiredArgsConstructor
@Api(tags = "ResidentRegistration API", description = "주민등록증 관리 API")
public class ResidentRegistrationController {
    private final DocumentService documentService;
    private final ResidentRegistrationService residentRegistrationService;

    @ApiOperation(value = "회원 ID로 주민등록증 조회", notes = "회원 ID를 사용하여 주민등록증 정보를 조회합니다.")
    @GetMapping("/my-license/{memberId}")
    public ResponseEntity<Object> getResidentRegistration(
            @ApiParam(value = "회원 ID", required = true, example = "12345")
            @PathVariable Long memberId) {
        try {
            // (1) memberId로 document 정보 조회
            DocumentDTO documentDTO = documentService.getDocumentByLoggedInUser();
            if (documentDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found for the given member.");
            }

            // (2) document에서 residentRegistrationId 조회
            Long residentRegistrationId = documentDTO.getRrnId();
            if (residentRegistrationId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Resident Registration not found.");
            }

            // (3) 주민등록증 정보 조회
            ResidentRegistrationDTO residentRegistrationDTO = residentRegistrationService.getResidentRegistrationById(residentRegistrationId);
            return ResponseEntity.ok(residentRegistrationDTO);
        } catch (DocumentNotFoundException e) {
            // Document 조회 실패 시 예외 처리
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found.");
        } catch (Exception e) {
            // 기타 예외 처리
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }


    }

    @ApiOperation(value = "현재 로그인한 사용자의 주민등록증 정보 조회", notes = "현재 로그인한 사용자의 주민등록증 정보를 조회합니다.")
    @GetMapping("/get")
    public ResponseEntity<?> getResidentRegistrationForLoggedInUser() {
        try {
            // 현재 로그인한 사용자의 Document 정보 조회
            DocumentDTO documentDTO = documentService.getDocumentByLoggedInUser();
            Long rrnId = documentDTO.getRrnId();

            if (rrnId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("주민등록증 정보가 없습니다.");
            }

            // 주민등록증 정보 조회
            ResidentRegistrationDTO residentRegistration = residentRegistrationService.getResidentRegistrationById(rrnId);
            return ResponseEntity.ok(residentRegistration);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }

}
