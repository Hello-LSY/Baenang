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
public class DriverLicenseDTO {
    @ApiModelProperty(value = "운전면허증 ID", example = "12345")
    private Long id;  //운전면허증 고유번호

    @ApiModelProperty(value = "운전면허증 번호", example = "DL123456789")
    @NotNull(message = "Driver License Number is required")
    private String DLN; //운전면허증 번호

    @ApiModelProperty(value = "관리 번호", example = "MGT-0012345")
    @NotNull(message = "Management Number is required")
    private String managementNumber;  //관리번호

    @ApiModelProperty(value = "주민등록번호", example = "900101-1234567")
    @NotNull(message = "Resident Registration Number is required")
    @Pattern(regexp = "^\\d{6}-\\d{7}$", message = "Invalid Resident Registration Number format")
    private String RRN;  //주민등록번호

    @ApiModelProperty(value = "주소", example = "Seoul, South Korea")
    @NotNull(message = "Address is required")
    private String address;  //주소

    @ApiModelProperty(value = "발급일", example = "2020-01-01")
    @NotNull(message = "Issue Date is required")
    private LocalDate issueDate;  //발급일

    @ApiModelProperty(value = "만료일", example = "2030-01-01")
    @NotNull(message = "Expiry Date is required")
    private LocalDate expiryDate;  //만료일

    @ApiModelProperty(value = "이미지 경로", example = "https://example.com/license-image.jpg")
    @NotNull(message = "Image Path is required")
    private String imagePath;  //이미지 경로

    @ApiModelProperty(value = "발급처", example = "Seoul Traffic Office")
    @NotNull(message = "Issuer is required")
    private String issuer;  //발급처
}
