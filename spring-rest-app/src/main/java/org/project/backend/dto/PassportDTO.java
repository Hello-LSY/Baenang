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
public class PassportDTO {
    private Long id;  //여권 고유번호
    
    @NotNull(message = "Resident Registration Number is required")
    @Pattern(regexp = "^\\d{6}-\\d{7}$", message = "Invalid Resident Registration Number format")
    private String RRN;   //주민등록증 번호

    @NotNull(message = "Passport Number is required")
    private String PN;  //여권번호

    @NotNull(message = "Image Path is required")
    private String imagePath; //이미지 경로

    @NotNull(message = "Country Code is required")
    @Pattern(regexp = "^[A-Z]{3}$", message = "Invalid Country Code format (should be 3 uppercase letters)")
    private String countryCode;  //국가 코드

    @NotNull(message = "Type is required")
    private String type;  //종류

    @NotNull(message = "Surname is required")
    private String surName;  //성(영문)

    @NotNull(message = "Given Name is required")
    private String givenName;  //이름(영문)

    @NotNull(message = "Korean Name is required")
    private String koreanName;  //한글성명

    @NotNull(message = "Birthdate is required")
    private LocalDate birth;  //생년월일

    @NotNull(message = "Gender is required")
    private char gender;  //성별(F,M)

    @NotNull(message = "Nationality is required")
    private String nationality;  //국적

    @NotNull(message = "Authority is required")
    private String authority;  //발행관청

    @NotNull(message = "Issue Date is required")
    private LocalDate issueDate;  //발급일

    @NotNull(message = "Expiry Date is required")
    private LocalDate expiryDate;  //기간만료일
}
