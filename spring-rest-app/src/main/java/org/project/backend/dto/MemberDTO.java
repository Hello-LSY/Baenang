package org.project.backend.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import java.time.LocalDate;

// import javax.validation.constraints.Email;
// import javax.validation.constraints.NotBlank;
// import javax.validation.constraints.Size;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDTO {

    /**
     * Entity가 있는데 왜 DTO를 정의할까?
     *
     * 엔티티는 데이터베이스와 연관된 객체로, 외부에 그대로 노출되면
     * 보안이나 비즈니스 로직에 문제가 생길 수 있다. DTO는 필요한
     * 데이터만 전송하며, 엔티티와 분리된 객체로 안전하게 데이터를 전달한다.
     */

    // 회원 고유 식별자
    @ApiModelProperty(value = "회원 고유 식별자", example = "1", notes = "자동 증가 값, 생성 시에는 입력하지 않음")
    private Long id;

    // 사용자 이름은 반드시 입력되어야 하며, 최대 50자
    // @NotBlank(message = "Username is mandatory")
    // @Size(max = 50, message = "Username must be at most 50 characters")
    @ApiModelProperty(value = "사용자 이름", example = "홍길동", required = true)
    private String username;


    // 비밀번호는 반드시 입력되어야 하며, 최소 8자 이상, 최대 255자
    // @NotBlank(message = "Password is mandatory")
    // @Size(min = 8, max = 255, message = "Password must be between 8 and 255 characters")
    @ApiModelProperty(value = "비밀번호", example = "password1234", required = true)
    private String password;

    // 이메일 필드 추가 (필수, 형식 검사)
    // @NotBlank(message = "Email is mandatory")
    // @Email(message = "Email should be valid")
    @ApiModelProperty(value = "이메일", example = "user@example.com", required = true)
    private String email;

    // 사용자 이름
    // @Size(max = 50, message = "Name must be at most 50 characters")
    @ApiModelProperty(value = "이름", example = "홍길동")
    private String name;

    // 닉네임
    // @Size(max = 30, message = "Nickname must be at most 30 characters")
    @ApiModelProperty(value = "닉네임", example = "길동이")
    private String nickname;

    // 성별
    // @Size(max = 10, message = "Gender must be at most 10 characters")
    @ApiModelProperty(value = "성별", example = "남성")
    private String gender;

    // 프로필 ID 추후 수정
    @ApiModelProperty(value = "프로필 ID")
    private Long profileId;

    @ApiModelProperty(value = "생년월일", example = "1990-01-01")
    private String birthdate;

    private String registrationNumber;


    // MemberDTO 빌더 패턴을 사용하기 위한 생성자
    @Builder
    public MemberDTO(Long id, String username, String password, String email, String name, String nickname, String gender, Long profileId) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.name = name;
        this.nickname = nickname;
        this.gender = gender;
        this.profileId = profileId;
    }
}
