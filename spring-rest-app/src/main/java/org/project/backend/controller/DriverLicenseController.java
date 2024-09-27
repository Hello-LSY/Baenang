package org.project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.DocumentDTO;
import org.project.backend.dto.DriverLicenseDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.service.DocumentService;
import org.project.backend.service.DriverLicenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/driver-license")
@RequiredArgsConstructor
public class DriverLicenseController {

    private final DocumentService documentService;
    private final DriverLicenseService driverLicenseService;

    //운전면허증 생성 또는 재등록
    @PostMapping("/create-or-update/{memberId}")
    public ResponseEntity<DriverLicenseDTO> createOrUpdateDriverLicense(
            @PathVariable Long memberId,
            @RequestBody DriverLicenseDTO driverLicenseDTO) {
        try {
            DriverLicenseDTO createdDriverLicense = driverLicenseService.createOrUpdateDriverLicense(memberId, driverLicenseDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDriverLicense);
        } catch (DocumentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Document를 찾지 못한 경우
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // Driver License 정보 조회
    @GetMapping("/my-license/{memberId}")
    public ResponseEntity<Object> getDriverLicense(@PathVariable Long memberId) {
        try {
            // (1) memberId로 document 정보 조회
            DocumentDTO documentDTO = documentService.getDocumentByMemberId(memberId);
            if (documentDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found for the given member.");
            }

            // (2) documentId로 DriverLicense 조회
            DriverLicenseDTO driverLicenseDTO = documentDTO.getDLN();
            if (driverLicenseDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Driver License not found.");
            }

            // 성공적으로 DriverLicense 조회 시
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



    // Driver License 삭제
    @DeleteMapping("/delete/{memberId}")
    public ResponseEntity<Void> deleteDriverLicense(@PathVariable Long memberId) {
        try {
            // (1) memberId로 document 정보 조회
            DocumentDTO documentDTO = documentService.getDocumentByMemberId(memberId);
            Long documentId = documentDTO.getDocumentId();

            // (2) Driver License 삭제
            driverLicenseService.deleteDriverLicenseById(documentId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}