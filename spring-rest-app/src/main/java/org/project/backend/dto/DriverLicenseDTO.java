package org.project.backend.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverLicenseDTO {
    private String DLN; //운전면허증 번호

    private String managementNumber;  //관리번호
    private String RRN;  //주민등록번호
    private String address;  //주소
    private LocalDate issueDate;  //발급일
    private LocalDate expiryDate;  //만료일
    private String imagePath;  //이미지 경로
    private String issuer;  //발급처
}
