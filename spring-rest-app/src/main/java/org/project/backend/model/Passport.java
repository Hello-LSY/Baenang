package org.project.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table(name = "passport")
public class Passport implements Serializable {
    // 기본 키
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)  // 문서 고유번호와 연결
    private Document document;

    @Column(name = "pn", nullable = false, unique = true)
    private String PN;  //여권번호

    @Column(name = "image_path", nullable = false, columnDefinition = "TEXT")
    private String imagePath;  //이미지경로

    @Column(name = "country_code", nullable = false, length = 3)
    private String countryCode;  //국가코드

    @Column(name = "type", nullable = false, length = 5)
    private String type;  //종류

    @Column(name = "sur_name", nullable = false, length = 50)
    private String surName;  //성(영문)

    @Column(name = "given_name", nullable = false, length = 50)
    private String givenName;  //이름(영문)

    @Column(name = "korean_name", length = 50)
    private String koreanName;  //한글성명

    @Column(name = "birth", nullable = false)
    private LocalDate birth;  //생년월일

    @Column(name = "gender", nullable = false)
    private char gender;  //성별(F,M)

    @Column(name = "nationality", nullable = false, length = 50)
    private String nationality;  //국적

    @Column(name = "authority", nullable = false, length = 100)
    private String authority;  //발행관청

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;  //발급일

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;  //기간만료일
}
