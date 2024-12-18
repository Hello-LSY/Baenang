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
@Table(name = "international_student_identity_card")
public class InternationalStudentIdentityCard implements Serializable {

    // 기본 키
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = true)  // 문서 고유번호와 연결
    private Document document;

    @Column(name = "rrn", nullable = false, length = 14)
    private String rrn;   // 주민등록증 번호

    @Column(name = "isic", nullable = false)
    private String isic;   // 국제학생증 카드 번호, 기본 키 설정

    @Column(name = "school_name", nullable = false, length = 100)
    private String schoolName;  // 학교 이름

    @Column(name = "name", nullable = false, length = 50)
    private String name;  // 성명

    @Column(name = "birth", nullable = false)
    private LocalDate birth;  // 생년월일

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;  // 발급년월

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;  // 만료년월

    @Column(name = "image_path", nullable = false, columnDefinition = "TEXT")
    private String imagePath;  // 이미지 경로
}
