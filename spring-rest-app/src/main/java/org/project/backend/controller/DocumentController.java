package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.DocumentDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/document")
@RequiredArgsConstructor
@Api(tags = "Document API", description = "문서 관리 API")
public class DocumentController {

    private final DocumentService documentService;

    // (1) 로그인한 사용자의 Document 생성
    @ApiOperation(value = "로그인한 사용자 기준으로 새로운 문서 생성", notes = "로그인한 사용자의 고유 문서를 생성합니다.")
    @PostMapping("/create")
    public ResponseEntity<DocumentDTO> createDocumentForLoggedInUser() {
        try {
            DocumentDTO createdDocument = documentService.createDocumentForLoggedInUser();
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDocument);
        } catch (IllegalStateException e) {
            // 이미 문서가 존재하는 경우
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (DocumentNotFoundException e) {
            // 회원 또는 문서를 찾을 수 없는 경우
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            // 그 외 예외 처리
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // (2) 로그인한 사용자의 Document 정보 조회
    @ApiOperation(value = "로그인한 사용자의 문서 정보 조회", notes = "로그인한 사용자의 고유 문서 정보를 조회합니다.")
    @GetMapping("/get")
    public ResponseEntity<DocumentDTO> getDocumentForLoggedInUser() {
        try {
            DocumentDTO documentDTO = documentService.getDocumentByLoggedInUser();
            return ResponseEntity.ok(documentDTO);
        } catch (DocumentNotFoundException e) {
            // Document를 찾을 수 없는 경우
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // (3) 주민등록번호로 문서 ID 업데이트
    @ApiOperation(value = "주민등록번호로 문서 ID 업데이트", notes = "주민등록번호를 사용하여 문서 ID를 업데이트합니다.")
    @PostMapping("/update-by-rrn")
    public ResponseEntity<Void> updateDocumentByRrn(
            @ApiParam(value = "주민등록번호", required = true) @RequestParam String rrn) {
        try {
            // 주민등록번호로 문서 ID 업데이트
            documentService.updateDocumentByRrn(rrn);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (DocumentNotFoundException e) {
            // 문서가 존재하지 않거나 관련 문서를 찾을 수 없는 경우
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            // 그 외 예외 처리
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // (4) 이메일 인증 요청
    @ApiOperation(value = "이메일 인증 요청", notes = "이름, 주민등록번호, 이메일을 기반으로 인증 요청을 보냅니다.")
    @PostMapping("/request-verification")
    public ResponseEntity<Void> requestVerification(
            @ApiParam(value = "이름", required = true) @RequestParam String fullName,
            @ApiParam(value = "주민등록번호", required = true) @RequestParam String rrn,
            @ApiParam(value = "이메일", required = true) @RequestParam String email) {
        try {
            // 이메일 인증 요청
            documentService.requestVerification(fullName, rrn, email);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (IllegalArgumentException e) {
            // 잘못된 입력값 또는 회원을 찾을 수 없는 경우
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            // 그 외 예외 처리
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // (5) 이메일 인증 코드 확인 및 문서 ID 업데이트
    @ApiOperation(value = "이메일 인증 코드 확인 및 문서 ID 업데이트", notes = "이메일 인증 코드 확인 후 문서 ID를 업데이트합니다.")
    @PostMapping("/verify")
    public ResponseEntity<String> verifyAndUpdateDocuments(
            @ApiParam(value = "이름", required = true) @RequestParam String fullName,
            @ApiParam(value = "주민등록번호", required = true) @RequestParam String rrn,
            @ApiParam(value = "이메일", required = true) @RequestParam String email,
            @ApiParam(value = "인증 코드", required = true) @RequestParam String code) {
        try {
            // 인증 코드 확인 및 문서 ID 업데이트
            String token = documentService.verifyAndUpdateDocuments(fullName, rrn, email, code);
            return ResponseEntity.ok(token); // 인증 토큰 반환
        } catch (IllegalArgumentException e) {
            // 잘못된 인증 코드 또는 만료된 경우
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired verification code.");
        } catch (Exception e) {
            // 그 외 예외 처리
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
