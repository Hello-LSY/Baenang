package org.project.backend.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResidentRegistrationDTO {
    private Long id;  //주민등록증 고유번호

    @NotNull(message = "Resident Registration Number is required")
    @Pattern(regexp = "^\\d{6}-\\d{7}$", message = "Invalid Resident Registration Number format")
    @ApiModelProperty(value = "주민등록증 번호", example = "123456-1234567")
    private String RRN;   //주민등록증 번호

    @NotNull(message = "Name is required")
    @ApiModelProperty(value = "사용자 이름", example = "홍길동")
    private String name; //사용자 이름

    @NotNull(message = "Image path is required")
    @ApiModelProperty(value = "이미지 경로", example = "/images/resident_registration.jpg")
    private String imagePath; //이미지경로

    @NotNull(message = "Address is required")
    @ApiModelProperty(value = "주소", example = "서울시 종로구 1-1")
    private String address;  //주소

    @NotNull(message = "Issue Date is required")
    @ApiModelProperty(value = "발급일", example = "2020-01-01")
    private LocalDate issueDate;  //발급일

    @NotNull(message = "Issuer is required")
    @ApiModelProperty(value = "발급처", example = "서울특별시청")
    private String issuer;  //발급처
}
