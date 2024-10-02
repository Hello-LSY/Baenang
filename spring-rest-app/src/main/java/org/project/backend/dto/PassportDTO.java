package org.project.backend.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PassportDTO {
    private Long id;  //여권 고유번호

    @NotNull(message = "Passport Number is required")
    @ApiModelProperty(value = "여권 번호", example = "M1234567")
    private String PN;  //여권번호

    @NotNull(message = "Image Path is required")
    @ApiModelProperty(value = "이미지 경로", example = "/images/passport.jpg")
    private String imagePath; //이미지 경로

    @NotNull(message = "Country Code is required")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Invalid Country Code format (should be 3 uppercase letters)")
    @ApiModelProperty(value = "국가 코드", example = "KOR")
    private String countryCode;  //국가 코드

    @NotNull(message = "Type is required")
    @ApiModelProperty(value = "여권 종류", example = "P")
    private String type;  //종류

    @NotNull(message = "Surname is required")
    @ApiModelProperty(value = "성(영문)", example = "KIM")
    private String surName;  //성(영문)

    @NotNull(message = "Given Name is required")
    @ApiModelProperty(value = "이름(영문)", example = "MINHO")
    private String givenName;  //이름(영문)

    @NotNull(message = "Korean Name is required")
    @ApiModelProperty(value = "한글 성명", example = "김민호")
    private String koreanName;  //한글성명

    @NotNull(message = "Birthdate is required")
    @ApiModelProperty(value = "생년월일", example = "1990-01-01")
    private LocalDate birth;  //생년월일

    @NotNull(message = "Gender is required")
    @ApiModelProperty(value = "성별(F,M)", example = "M")
    private char gender;  //성별(F,M)

    @NotNull(message = "Nationality is required")
    @ApiModelProperty(value = "국적", example = "Korean")
    private String nationality;  //국적

    @NotNull(message = "Authority is required")
    @ApiModelProperty(value = "발행관청", example = "Ministry of Foreign Affairs")
    private String authority;  //발행관청

    @NotNull(message = "Issue Date is required")
    @ApiModelProperty(value = "발급일", example = "2020-01-01")
    private LocalDate issueDate;  //발급일

    @NotNull(message = "Expiry Date is required")
    @ApiModelProperty(value = "기간만료일", example = "2030-01-01")
    private LocalDate expiryDate;  //기간만료일
}
