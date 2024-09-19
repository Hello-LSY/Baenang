package org.project.backend.model;

import lombok.Builder;
import lombok.Getter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Getter
@Entity
@Builder(toBuilder = true)
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long postId;  // 관계형 객체 대신 식별자 사용
    private Long memberId; // 관계형 객체 대신 식별자 사용

    // 기본 생성자
    protected Like() {
        // JPA용 기본 생성자
    }

    // Getter 메서드 Lombok이 생성
}
