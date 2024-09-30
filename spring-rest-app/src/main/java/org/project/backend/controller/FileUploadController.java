package org.project.backend.controller;

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
public class FileUploadController {

    // 파일을 저장할 로컬 경로 (예: C:/uploads)
    private static final String UPLOAD_DIR = "C:/uploads/";

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // 프론트에서 임의로 파일명을 생성하여 보냈으므로, 파일 이름은 file.getOriginalFilename() 대신 클라이언트에서 온 파일명을 그대로 사용
            String fileName = file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            // 파일 저장 디렉터리 생성
            Files.createDirectories(filePath.getParent());
            // 파일 저장
            Files.write(filePath, file.getBytes());

            // 이미지 URL 반환 (파일 경로로 접근 가능하도록)
            String fileUrl = "http://localhost:8080/uploads/" + fileName;
            return ResponseEntity.ok().body("{\"imageUrl\": \"" + fileUrl + "\"}");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패");
        }
    }
}
