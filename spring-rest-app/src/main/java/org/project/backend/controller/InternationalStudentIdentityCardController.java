package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.DocumentDTO;
import org.project.backend.dto.InternationalStudentIdentityCardDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.service.DocumentService;
import org.project.backend.service.InternationalStudentIdentityCardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/isic")
@RequiredArgsConstructor
@Api(tags = "ISIC API", description = "국제학생증 관리 API")
public class InternationalStudentIdentityCardController {

    private final DocumentService documentService;
    private final InternationalStudentIdentityCardService isicService;

//    @ApiOperation(value = "회원 ID로 국제학생증 생성 또는 재등록", notes = "회원 ID를 사용하여 국제학생증을 생성 또는 재등록합니다.")
//    @PostMapping("/create-or-update/{memberId}")
//    public ResponseEntity<InternationalStudentIdentityCardDTO> createOrUpdateISIC(
//          @ApiParam(value = "회원 ID", required = true) @PathVariable Long memberId,
//          @ApiParam(value = "국제학생증 정보", required = true) @RequestBody InternationalStudentIdentityCardDTO isicDto){
//        try{
//            InternationalStudentIdentityCardDTO createdISIC = isicService.createOrUpdateISIC(memberId, isicDto);
//            return ResponseEntity.status(HttpStatus.CREATED).body(createdISIC);
//        } catch (DocumentNotFoundException e) {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Document를 찾지 못한 경우
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
//        }
//    }

    @ApiOperation(value = "회원 ID로 국제학생증 조회", notes = "회원 ID를 사용하여 국제학생증 정보를 조회합니다.")
    @GetMapping("/my-license/{memberId}")
    public ResponseEntity<Object> getISIC(@PathVariable Long memberId){
        try{
            DocumentDTO documentDTO = documentService.getDocumentByMemberId(memberId);
            if (documentDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found for the given member.");
            }

            InternationalStudentIdentityCardDTO isicDTO = documentDTO.getISIC();
            if(isicDTO == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("ISIC not found.");
            }

            return ResponseEntity.ok(isicDTO);
        } catch (DocumentNotFoundException e) {
            // Document 조회 실패 시 예외 처리
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Document not found.");
        } catch (Exception e) {
            // 기타 예외 처리
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred.");
        }
    }

//    @ApiOperation(value = "국제학생증 삭제", notes = "회원 ID를 사용하여 국제학생증을 삭제합니다.")
//    @DeleteMapping("/delete/{memberId}")
//    public ResponseEntity<Void> deleteISIC(@PathVariable Long memberId){
//        try{
//            DocumentDTO documentDTO = documentService.getDocumentByMemberId(memberId);
//            Long documentId = documentDTO.getDocumentId();
//
//            isicService.deleteISICById(documentId);
//            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
//        } catch (Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//    }
}
