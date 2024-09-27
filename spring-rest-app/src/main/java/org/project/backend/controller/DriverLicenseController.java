package org.project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.DocumentDTO;
import org.project.backend.dto.DriverLicenseDTO;
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

    // Driver License 정보 조회
    @GetMapping("/my-license")
    public ResponseEntity<Object> getDriverLicense(@RequestParam Long memberId) {
        try {
            // (1) memberId로 document 정보 조회
            DocumentDTO documentDTO = documentService.getDocumentByMemberId(memberId);
            Long documentId = documentDTO.getDocumentId();

            // (2) driverLicense가 있는지 확인
            DriverLicenseDTO driverLicenseDTO = driverLicenseService.getDriverLicenseById(documentId);
            if (driverLicenseDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Driver License not found.");
            }

            return ResponseEntity.ok(driverLicenseDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }

    // Driver License 생성
    @PostMapping("/create")
    public ResponseEntity<DriverLicenseDTO> createDriverLicense(
            @RequestParam Long memberId,
            @Valid @RequestBody DriverLicenseDTO driverLicenseDTO) {

        System.out.println("dldididiidjfald;jf");

        try {
            // (1) memberId로 document 정보 조회
            DocumentDTO documentDTO = documentService.getDocumentByMemberId(memberId);
            Long documentId = documentDTO.getDocumentId();

            // (2) Driver License 생성
            DriverLicenseDTO createdDriverLicense = driverLicenseService.createDriverLicense(documentId, driverLicenseDTO);
            System.out.println(createdDriverLicense.toString());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDriverLicense);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Driver License 삭제
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteDriverLicense(@RequestParam Long memberId) {
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