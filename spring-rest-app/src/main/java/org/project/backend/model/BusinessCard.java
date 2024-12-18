package org.project.backend.model;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table(name = "business_card") // 테이블명은 소문자로
public class BusinessCard {

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

    @Column(name = "image_url")
    private String imageUrl;

}
