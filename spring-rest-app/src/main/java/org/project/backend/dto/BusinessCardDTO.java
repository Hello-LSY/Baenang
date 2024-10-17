package org.project.backend.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessCardDTO {

    @ApiModelProperty(value = "명함 ID", example = "1234-5678")
    private String cardId;

    @ApiModelProperty(value = "회원 ID", example = "1")
    private Long memberId;

    @ApiModelProperty(value = "이름", example = "John Doe")
    private String name;

    @ApiModelProperty(value = "국가", example = "South Korea")
    private String country;

    @ApiModelProperty(value = "이메일", example = "john.doe@example.com")
    private String email;

    @ApiModelProperty(value = "SNS 계정", example = "@johndoe")
    private String sns;

    @ApiModelProperty(value = "소개", example = "Experienced software engineer with a passion for developing innovative programs.")
    private String introduction;

    @ApiModelProperty(value = "이미지 URL", example = "https://example.com/johndoe.jpg")
    private String imageUrl;
}