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
@Table(name = "driver_license")
public class DriverLicense implements Serializable {
    // 기본 키
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)  // 문서 고유번호와 연결
    private Document document;

    @Column(name = "dln", nullable = false, unique = true)
    private String DLN; //운전면허증 번호

    @Column(name = "management_number", nullable = false, length = 50)
    private String managementNumber;  //관리번호

    @Column(name = "rrn", nullable = false, length = 14)
    private String RRN;  //주민등록번호

    @Column(name = "address", nullable = false, length = 255)
    private String address;  //주소

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;  //발급일

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;  //만료일

    @Column(name = "image_path", nullable = false, columnDefinition = "TEXT")
    private String imagePath;  //이미지 경로

    @Column(name = "issuer", nullable = false, length = 50)
    private String issuer;  //발급처
}
