package org.project.backend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
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

    // 사용자 이름은 반드시 입력되어야 하며, 최대 50자
    @NotBlank(message = "Username is mandatory")
    @Size(max = 50, message = "Username must be at most 50 characters")
    private String username;

    // 비밀번호는 반드시 입력되어야 하며, 최소 8자 이상, 최대 255자
    @NotBlank(message = "Password is mandatory")
    @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
    private String password;

    // 이메일 필드 추가 (필수, 형식 검사)
    @NotBlank(message = "Email is mandatory")
    @Email(message = "Email should be valid")
    private String email;

    // 사용자 이름
    @Size(max = 50, message = "Name must be at most 50 characters")
    private String name;

    // 닉네임
    @Size(max = 30, message = "Nickname must be at most 30 characters")
    private String nickname;

    // 성별
    @Size(max = 10, message = "Gender must be at most 10 characters")
    private String gender;

    // 프로필 ID
    private Long profileId;

    @Builder
    public MemberDTO(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }
}
