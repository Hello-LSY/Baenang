package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.DocumentDTO;
import org.project.backend.dto.DriverLicenseDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.service.DocumentService;
import org.project.backend.service.DriverLicenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/driver-license")
@RequiredArgsConstructor
@Api(tags = "Driver License API", description = "운전면허증 관리 API")
public class DriverLicenseController {

    private final DocumentService documentService;
    private final DriverLicenseService driverLicenseService;

//    @ApiOperation(value = "회원 ID로 운전면허증 생성 또는 재등록", notes = "회원 ID를 사용하여 운전면허증을 생성 또는 재등록합니다.")
//    @PostMapping("/create-or-update/{memberId}")
//    public ResponseEntity<DriverLicenseDTO> createOrUpdateDriverLicense(
//            @ApiParam(value = "회원 ID", required = true) @PathVariable Long memberId,
//            @ApiParam(value = "운전면허증 정보", required = true) @RequestBody DriverLicenseDTO driverLicenseDTO) {
//        try {
//            DriverLicenseDTO createdDriverLicense = driverLicenseService.createOrUpdateDriverLicense(memberId, driverLicenseDTO);
//            return ResponseEntity.status(HttpStatus.CREATED).body(createdDriverLicense);
//        } catch (DocumentNotFoundException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Document를 찾지 못한 경우
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }

    @ApiOperation(value = "회원 ID로 운전면허증 조회", notes = "회원 ID를 사용하여 운전면허증 정보를 조회합니다.")
    @GetMapping("/my-license/{memberId}")
    public ResponseEntity<Object> getDriverLicense(@PathVariable Long memberId) {
        try {
//            // (1) memberId로 document 정보 조회
//            DocumentDTO documentDTO = documentService.getDocumentByMemberId(memberId);
//            if (documentDTO == null) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found for the given member.");
//            }
//
//            // (2) documentId로 DriverLicense 조회
//            Long driverLicenseDTO = documentDTO.getDlnId();
//            if (driverLicenseDTO == null) {
//                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Driver License not found.");
//            }
//
//            // 성공적으로 DriverLicense 조회 시
//            return ResponseEntity.ok(driverLicenseDTO);

            // (1) memberId로 document 정보 조회
            DocumentDTO documentDTO = documentService.getDocumentByLoggedInUser();
            if (documentDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found for the given member.");
            }

            // (2) document에서 운전면허증 ID 조회
            Long driverLicenseId = documentDTO.getDlnId();
            if (driverLicenseId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Driver License not found for the given member.");
            }

            // (3) DriverLicense 정보 조회
            DriverLicenseDTO driverLicenseDTO = driverLicenseService.getDriverLicenseById(driverLicenseId);
            return ResponseEntity.ok(driverLicenseDTO);
        } catch (DocumentNotFoundException e) {
            // Document 조회 실패 시 예외 처리
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found.");
        } catch (Exception e) {
            // 기타 예외 처리
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }

    @ApiOperation(value = "현재 로그인한 사용자의 운전면허증 정보 조회", notes = "현재 로그인한 사용자의 운전면허증 정보를 조회합니다.")
    @GetMapping("/get")
    public ResponseEntity<?> getDriverLicenseForLoggedInUser() {
        try {
            // 현재 로그인한 사용자의 Document 정보 조회
            DocumentDTO documentDTO = documentService.getDocumentByLoggedInUser();
            Long dlnId = documentDTO.getDlnId();

            if (dlnId == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("운전면허증 정보가 없습니다.");
            }

            // 운전면허증 정보 조회
            DriverLicenseDTO driverLicense = driverLicenseService.getDriverLicenseById(dlnId);
            return ResponseEntity.ok(driverLicense);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }

//    @ApiOperation(value = "운전면허증 삭제", notes = "회원 ID를 사용하여 운전면허증을 삭제합니다.")
//    @DeleteMapping("/delete/{memberId}")
//    public ResponseEntity<Void> deleteDriverLicense(@PathVariable Long memberId) {
//        try {
//            // (1) memberId로 document 정보 조회
//            DocumentDTO documentDTO = documentService.getDocumentByMemberId(memberId);
//            Long documentId = documentDTO.getDocumentId();
//
//            // (2) Driver License 삭제
//            driverLicenseService.deleteDriverLicenseById(documentId);
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
}