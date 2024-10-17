package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.project.backend.service.S3Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
@Api(tags = "File Upload API", description = "파일 업로드 API")
public class FileUploadController {

    private static final Logger logger = LoggerFactory.getLogger(FileUploadController.class);

    private final S3Service s3Service;

    public FileUploadController(S3Service s3Service) {
        this.s3Service = s3Service;
    }

    @ApiOperation(value = "이미지 파일 업로드", notes = "이미지 파일을 S3에 업로드합니다.")
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @ApiParam(value = "업로드할 파일", required = true)
            @RequestParam("file") MultipartFile file) {

        logger.info("파일 업로드 요청을 받음: 파일명 = {}", file.getOriginalFilename());

        try {
            // 파일 크기 로그 추가
            logger.info("파일 크기: {} bytes", file.getSize());

            // S3에 파일 업로드
            String fileName = s3Service.uploadFile(file);

            // 업로드한 파일 이름 로그
            logger.info("파일이 성공적으로 S3에 업로드됨: 파일명 = {}", fileName);

            // 업로드한 파일의 이름을 반환
            return ResponseEntity.ok().body("{\"fileName\": \"" + fileName + "\"}");

        } catch (IOException e) {
            // 업로드 실패 시 오류 로그 및 메시지 반환
            logger.error("파일 업로드 중 오류 발생: 파일명 = {}, 오류 메시지 = {}", file.getOriginalFilename(), e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패");
        }
    }
}
