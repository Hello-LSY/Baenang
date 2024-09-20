package org.project.backend.model;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedBusinessCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;  // 명함을 저장한 사용자

    @Column(nullable = false)
    private String businessCardId;  // 저장된 명함의 ID
}