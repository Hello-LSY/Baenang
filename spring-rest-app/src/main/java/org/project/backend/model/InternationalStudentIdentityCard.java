package org.project.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table(name = "international_student_identity_card")
public class InternationalStudentIdentityCard {

    @Id
    @OneToOne
    @JoinColumn(name = "document_id")
    @MapsId
    private Document document;  // 문서 고유번호

    @Column(name = "isic", nullable = false, unique = true)
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
