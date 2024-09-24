package org.project.backend.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PassportDTO {
    private Long documentId;  //문서 고유번호

    private String PN;  //여권번호
    private String imagePath;  //국가코드
    private String countryCode;  //이미지경로
    private String type;  //종류
    private String surName;  //성(영문)
    private String givenName;  //이름(영문)
    private String koreanName;  //한글성명
    private LocalDate birth;  //생년월일
    private char gender;  //성별(F,M)
    private String nationality;  //국적
    private String authority;  //발행관청
    private LocalDate issueDate;  //발급일
    private LocalDate expiryDate;  //기간만료일
}
