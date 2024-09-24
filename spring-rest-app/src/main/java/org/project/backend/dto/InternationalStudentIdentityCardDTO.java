package org.project.backend.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InternationalStudentIdentityCardDTO {
    private Long documentId;  //문서 고유번호

    private String ISIC;  //국제학생증 카드 번호
    private String schoolName;  //학교이름
    private String name;  //성명
    private LocalDate birth;  //생년월일
    private LocalDate issueDate;  //발급년월
    private LocalDate expiryDate;  //만료년월
    private String imagePath;  //이미지 경로
}
