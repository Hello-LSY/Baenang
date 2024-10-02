package org.project.backend.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    @ApiModelProperty(value = "회원 ID", example = "1")
    private Long memberId;

    @ApiModelProperty(value = "JWT 토큰", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @ApiModelProperty(value = "토큰 타입", example = "Bearer")
    private String type = "Bearer";
}
