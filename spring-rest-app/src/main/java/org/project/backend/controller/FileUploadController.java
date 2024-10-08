package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
@Api(tags = "File Upload API", description = "파일 업로드 API")  // Swagger 설명 추가
public class FileUploadController {

    @Value("${file.upload-dir}")
    private String UPLOAD_DIR;

    @ApiOperation(value = "이미지 파일 업로드", notes = "이미지 파일을 서버에 업로드합니다.")
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(
            @ApiParam(value = "업로드할 파일", required = true)
            @RequestParam("file") MultipartFile file) {



        try {
            // 파일 이름은 클라이언트에서 온 파일명을 그대로 사용
            String fileName = file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            // 파일 저장 디렉터리 생성
            Files.createDirectories(filePath.getParent());
            // 파일 저장
            Files.write(filePath, file.getBytes());

            // 파일명만 반환 (URL은 클라이언트가 구성)
            return ResponseEntity.ok().body("{\"fileName\": \"" + fileName + "\"}");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패");
        }
    }
}
