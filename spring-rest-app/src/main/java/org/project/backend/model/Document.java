package org.project.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table(name = "document")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Long documentId;

    @OneToOne
    @JoinColumn(name = "member_id", referencedColumnName = "member_id")
    private Member member;

    @OneToOne
    @JoinColumn(name = "rrn", referencedColumnName = "rrn")
    private ResidentRegistration RRN; //주민등록증 번호

    @OneToOne
    @JoinColumn(name = "dln", referencedColumnName = "dln")
    private DriverLicense DLN; //운전면허증번호

    @OneToOne
    @JoinColumn(name = "pn", referencedColumnName = "pn")
    private Passport PN;  //여권 번호

    @OneToOne
    @JoinColumn(name = "isic", referencedColumnName = "isic")
    private InternationalStudentIdentityCard ISIC;// 국제 학생증 번호

    @Column(name = "tic", columnDefinition = "TEXT")
    private String ticPath; // 여행 보험 증명서 (이미지 파일 경로)

    @Column(name = "vc", columnDefinition = "TEXT")
    private String vcPath;  // 예방접종 증명서 (이미지 파일 경로)

    @Column(name = "ic", columnDefinition = "TEXT")
    private String icPath; // 출입국 사실 증명서 (이미지 파일 경로)
}
