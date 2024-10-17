package org.project.backend.service;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface S3Service {
    // S3에 파일 업로드 메서드
    String uploadFile(MultipartFile file) throws IOException;

    // Presigned URL 생성 메서드
    String generatePresignedUrl(String fileName);
}
