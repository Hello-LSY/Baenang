package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.DocumentDTO;
import org.project.backend.dto.PassportDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.service.DocumentService;
import org.project.backend.service.PassportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/passport")
@RequiredArgsConstructor
@Api(tags = "Passport API", description = "여권 관리 API")
public class PassportController {
    private final DocumentService documentService;
    private final PassportService passportService;

    @ApiOperation(value = "회원 ID로 여권 조회", notes = "회원 ID를 사용하여 여권 정보를 조회합니다.")
    @GetMapping("/my-license/{memberId}")
    public ResponseEntity<Object> getPassport(
        @ApiParam(value = "회원 ID", required = true, example = "12345")
        @PathVariable Long memberId) {
        try {
//            // (1) memberId로 document 정보 조회
//            DocumentDTO documentDTO = documentService.getDocumentByMemberId(memberId);
//            if (documentDTO == null) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found for the given member.");
//            }
//
//            // (2) documentId로 Passport 조회
//            Long passportDTO = documentDTO.getPnId();
//            if (passportDTO == null) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passport not found.");
//            }
//
//            // 성공적으로 Passport 조회 시
//            return ResponseEntity.ok(passportDTO);

            // (1) memberId로 document 정보 조회
            DocumentDTO documentDTO = documentService.getDocumentByLoggedInUser();
            if (documentDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found for the given member.");
            }

            // (2) document에서 여권 ID 조회
            Long passportId = documentDTO.getPnId();
            if (passportId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Passport not found for the given member.");
            }

            // (3) Passport 정보 조회
            PassportDTO passportDTO = passportService.getPassportById(passportId);
            return ResponseEntity.ok(passportDTO);
        } catch (DocumentNotFoundException e) {
            // Document 조회 실패 시 예외 처리
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found.");
        } catch (Exception e) {
            // 기타 예외 처리
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }

    }

//    @ApiOperation(value = "여권 ID로 조회", notes = "Document 테이블에서 pnId로 여권을 조회합니다.")
//    @GetMapping("/get/{pnId}")
//    public ResponseEntity<PassportDTO> getPassportById(@PathVariable Long pnId) {
//        try {
//            PassportDTO passport = passportService.getPassportById(pnId);
//            return ResponseEntity.ok(passport);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
//        }
//    }
@ApiOperation(value = "현재 로그인한 사용자의 여권 정보 조회", notes = "현재 로그인한 사용자의 여권 정보를 조회합니다.")
@GetMapping("/get")
public ResponseEntity<?> getPassportForLoggedInUser() {
    try {
        // 현재 로그인한 사용자의 Document 정보 조회
        DocumentDTO documentDTO = documentService.getDocumentByLoggedInUser();
        Long pnId = documentDTO.getPnId();

        if (pnId == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("여권 정보가 없습니다.");
        }

        // 여권 정보 조회
        PassportDTO passport = passportService.getPassportById(pnId);
        return ResponseEntity.ok(passport);
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
    }
}

//    @ApiOperation(value = "여권 삭제", notes = "회원 ID를 사용하여 여권을 삭제합니다.")
//    @DeleteMapping("/delete/{memberId}")
//    public ResponseEntity<Void> deletePassport(@PathVariable Long memberId) {
//        try {
//            // (1) memberId로 document 정보 조회
//            DocumentDTO documentDTO = documentService.getDocumentByMemberId(memberId);
//            Long documentId = documentDTO.getDocumentId();
//
//            // (2) Passport 삭제
//            passportService.deletePassportById(documentId);
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
}
