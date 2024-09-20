package org.project.backend.model;

import lombok.*;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table(name = "business_card") // 테이블명은 소문자로
public class BusinessCard implements Serializable {

    @Id
    @Column(name = "card_id")
    private String cardId;

    @OneToOne
    @JoinColumn(name = "member_id", referencedColumnName = "member_id")
    private Member member;

    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @Column(name = "country", length = 50)
    private String country;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "sns", columnDefinition = "TEXT")
    private String sns;

    @Column(name = "introduction", length = 50)
    private String introduction;

    @Column(name = "qr", columnDefinition = "TEXT")
    private String qr;

    // 엔티티의 상태를 변경하기 위한 update 메서드
    public void update(String name, String country, String email, String sns, String introduction, String qr) {
        this.name = name;
        this.country = country;
        this.email = email;
        this.sns = sns;
        this.introduction = introduction;
        this.qr = qr;
    }
}
