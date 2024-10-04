package org.project.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDTO {
    private Long memberId;
    private Long documentId;  //문서 고유번호

    private Long rrnId;  // 주민등록증 번호 ID
    private Long dlnId;  // 운전면허증번호 ID
    private Long pnId;   // 여권 번호 ID
    private Long isicId; // 국제 학생증 번호 ID

    private String TIC; // 여행 보험 증명서 (이미지 파일 경로)
    private String VC;  // 예방접종 증명서 (이미지 파일 경로)
    private String IC; // 출입국 사실 증명서 (이미지 파일 경로)
}
