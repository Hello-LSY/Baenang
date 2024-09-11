package org.project.backend.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class MemberDTO {

    /**
     * Entity가 있는데 왜 DTO를 정의할까?
     *
     * 엔티티는 데이터베이스와 연관된 객체로, 외부에 그대로 노출되면
     * 보안이나 비즈니스 로직에 문제가 생길 수 있다. DTO는 필요한
     * 데이터만 전송하며, 엔티티와 분리된 객체로 안전하게 데이터를 전달한다.
     */


    // 회원 고유 식별자
    private Long id;

    // 사용자 이름은 반드시 입력되어야 함
    @NotBlank(message = "Name is mandatory")  // 공백이나 null 값이 허용되지 않음
    private String username;

    // 비밀번호는 반드시 입력되어야 함
    @NotBlank(message = "Password is mandatory")  // 공백이나 null 값이 허용되지 않음
    private String password;
}
