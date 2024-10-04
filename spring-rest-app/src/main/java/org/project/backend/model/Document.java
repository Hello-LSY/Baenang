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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", referencedColumnName = "member_id")
    private Member member;

    // 주민등록증 ID (엔티티 대신 Long 타입으로 ID 저장)
    @Column(name = "rrn_id", nullable = true)
    private Long rrnId;

    // 운전면허증 ID
    @Column(name = "dln_id", nullable = true)
    private Long dlnId;

    // 여권 ID
    @Column(name = "pn_id", nullable = true)
    private Long pnId;

    // 국제학생증 ID
    @Column(name = "isic_id", nullable = true)
    private Long isicId;
    @Column(name = "tic", columnDefinition = "TEXT")
    private String ticPath; // 여행 보험 증명서 (이미지 파일 경로)

    @Column(name = "vc", columnDefinition = "TEXT")
    private String vcPath;  // 예방접종 증명서 (이미지 파일 경로)

    @Column(name = "ic", columnDefinition = "TEXT")
    private String icPath; // 출입국 사실 증명서 (이미지 파일 경로)
}
