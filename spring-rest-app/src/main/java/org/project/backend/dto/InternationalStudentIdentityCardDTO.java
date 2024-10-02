package org.project.backend.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternationalStudentIdentityCardDTO {

    @ApiModelProperty(value = "회원 ID", example = "1", notes = "Auto-increment되는 고유번호") // id 필드는 auto-increment
    private Long id;  //국제학생증 고유번호

    @ApiModelProperty(value = "국제학생증 카드 번호", example = "ISIC123456789", notes = "유효한 국제학생증 카드 번호")
    @NotNull(message = "International Student Identity Card Number is required")
    private String ISIC;  //국제학생증 카드 번호

    @ApiModelProperty(value = "학교 이름", example = "서울대학교", notes = "학생이 재학 중인 학교 이름")
    @NotNull(message = "School Name is required")
    private String schoolName;  //학교이름

    @ApiModelProperty(value = "성명", example = "홍길동", notes = "국제학생증에 기재된 학생 성명")
    @NotNull(message = "Name is required")
    private String name;  //성명

    @ApiModelProperty(value = "생년월일", example = "1990-01-01", notes = "학생의 생년월일")
    @NotNull(message = "Birth Date is required")
    private LocalDate birth;  //생년월일

    @ApiModelProperty(value = "발급일", example = "2024-01-01", notes = "국제학생증 발급일")
    @NotNull(message = "Issue Date is required")
    private LocalDate issueDate;  //발급일

    @ApiModelProperty(value = "만료일", example = "2025-01-01", notes = "국제학생증 만료일")
    @NotNull(message = "Expiry Date is required")
    private LocalDate expiryDate;  //만료일

    @ApiModelProperty(value = "이미지 경로", example = "/images/idcard.png", notes = "학생증 이미지 파일 경로")
    @NotNull(message = "Image Path is required")
    private String imagePath;  //이미지 경로
}