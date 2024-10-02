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

    @ApiOperation(value = "회원 ID로 새로운 문서 생성", notes = "회원 ID를 사용하여 새로운 문서를 생성합니다.")
    @PostMapping("/create/{memberId}")
    public ResponseEntity<DocumentDTO> createDocument(
            @ApiParam(value = "회원 ID", required = true, example = "1") @PathVariable Long memberId) {
        try {
            DocumentDTO createdDocument = documentService.createDocument(memberId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDocument);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null); // 중복된 Document
        } catch (DocumentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Document 없음
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 서버 에러
        }
    }

    @ApiOperation(value = "회원 ID로 문서 조회", notes = "회원 ID를 사용하여 문서를 조회합니다.")
    @GetMapping("/get/{memberId}")
    public ResponseEntity<DocumentDTO> getDocument(
            @ApiParam(value = "회원 ID", required = true, example = "1") @PathVariable Long memberId) {
        try {
            DocumentDTO documentDTO = documentService.getDocumentByMemberId(memberId);
            return ResponseEntity.ok(documentDTO);
        } catch (DocumentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
