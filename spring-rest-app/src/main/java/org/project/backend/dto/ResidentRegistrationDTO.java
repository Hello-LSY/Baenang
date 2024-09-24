package org.project.backend.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResidentRegistrationDTO {
    private Long documentId;  //문서 고유번호

    private Long RRN;   //주민등록증 번호
    private String name; //사용자 이름
    private String imagePath; //이미지경로
    private String address;  //주소
    private LocalDate issueDate;  //발급일
    private String issuer;  //발급처
}
