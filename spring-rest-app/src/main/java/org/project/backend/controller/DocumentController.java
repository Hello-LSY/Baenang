package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.DocumentDTO;
import org.project.backend.service.DocumentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

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
            @ApiParam(value = "회원 ID", required=true) @PathVariable Long memberId,
            @ApiParam(value = "생성할 문서", required=true) @RequestBody DocumentDTO documentDTO){
        try{
            DocumentDTO createdDocumentDTO = documentService.createDocument(memberId, documentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDocumentDTO);
        } catch (RuntimeException e) {
            e.printStackTrace(); // 예외 로그 출력
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // 오류 발생 시 400 반환
        } catch (Exception e) {
            e.printStackTrace(); // 예외 로그 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); // 내부 서버 오류 시 500 반환
        }
    }

    // Document 정보 조회
    @ApiOperation(value = "회원 ID로 문서 조회", notes = "회원 ID를 사용하여 문서 정보를 조회합니다.")
    @GetMapping("/get/{memberId}")
    public ResponseEntity<DocumentDTO> getDocument(
            @ApiParam(value = "회원 ID", required = true) @PathVariable Long memberId) {

        try {
            DocumentDTO documentDTO = documentService.getDocumentByMemberId(memberId);
            return ResponseEntity.ok(documentDTO);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}
