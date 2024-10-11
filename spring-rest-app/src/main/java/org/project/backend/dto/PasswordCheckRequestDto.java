package org.project.backend.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel(description = "비밀번호 확인을 위한 요청 DTO")
public class PasswordCheckRequestDto {
    @ApiModelProperty(value = "사용자 비밀번호", required = true, example = "yourPassword123")
    private String password;

    // Getter and Setter
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}