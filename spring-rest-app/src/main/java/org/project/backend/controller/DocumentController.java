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

    // (1) 고유의 Document 생성
    @ApiOperation(value = "회원 ID로 새로운 문서 생성", notes = "회원 ID를 사용하여 새로운 전자 명함을 생성합니다.")
    @PostMapping("/create/{memberId}")
    public ResponseEntity<DocumentDTO> createDocument(
            @ApiParam(value = "회원 ID", required=true) @PathVariable Long memberId){
        try {
            DocumentDTO createdDocument = documentService.createDocumentForLoggedInUser();
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDocument);
        } catch (IllegalStateException e) {
            // 중복된 Document가 있는 경우
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (DocumentNotFoundException e) {
            // 회원이 존재하지 않거나 Document를 찾을 수 없는 경우
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            // 그 외 예외 처리
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
}
