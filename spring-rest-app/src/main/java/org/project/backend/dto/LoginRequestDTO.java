package org.project.backend.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
public class LoginRequestDTO {

    @ApiModelProperty(value = "사용자 이름", example = "user")
    @NotBlank(message = "Username is mandatory")
    private String username;

    @ApiModelProperty(value = "사용자 비밀번호", example = "1234")
    @NotBlank(message = "Password is mandatory")
    private String password;
}
