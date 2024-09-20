package org.project.backend.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import org.springframework.stereotype.Component;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
@Component
public class QRCodeGenerator {

    // QR 코드 생성 메서드
    public String generateQRCode(String text, String fileName) throws Exception {
        String directoryPath = "C:/upload/images/qr/"; // Windows의 경우

        // QR 코드 생성
        BitMatrix matrix = new MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, 200, 200);
        Path path = Paths.get(directoryPath + fileName); // 전체 경로 생성

        // 디렉토리가 존재하지 않으면 생성
        File directory = new File(directoryPath);
        if (!directory.exists()) {
            boolean dirCreated = directory.mkdirs(); // 디렉토리 생성 시 결과 체크
            if (!dirCreated) {
                throw new RuntimeException("디렉토리를 생성할 수 없습니다: " + directoryPath);
            }
        }

        // QR 코드 이미지 파일 저장
        MatrixToImageWriter.writeToPath(matrix, "PNG", path);
        return path.toString();
    }
}
