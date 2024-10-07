package org.project.backend.dto;

import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternationalStudentIdentityCardDTO {
    private Long id;  //국제학생증 고유번호

    @NotNull(message = "Resident Registration Number is required")
    @Pattern(regexp = "^\\d{6}-\\d{7}$", message = "Invalid Resident Registration Number format")
    private String rrn;   //주민등록증 번호

    @NotNull(message = "International Student Identity Card Number is required")
    private String isic;  //국제학생증 카드 번호


    @NotNull(message = "School Name is required")
    private String schoolName;  //학교이름

    @NotNull(message = "Name is required")
    private String name;  //성명

    @NotNull(message = "Birth Date is required")
    private LocalDate birth;  //생년월일

    @NotNull(message = "Issue Date is required")
    private LocalDate issueDate;  //발급년월

    @NotNull(message = "Expiry Date is required")
    private LocalDate expiryDate;  //만료년월

    @NotNull(message = "Image Path is required")
    private String imagePath;  //이미지 경로
}
