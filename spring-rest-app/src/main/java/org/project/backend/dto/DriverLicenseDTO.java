package org.project.backend.dto;

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
    private Long id;  //운전면허증 고유번호

    @NotNull(message = "Driver License Number is required")
    private String DLN; //운전면허증 번호

    @NotNull(message = "Management Number is required")
    private String managementNumber;  //관리번호

    @NotNull(message = "Resident Registration Number is required")
    @Pattern(regexp = "^\\d{6}-\\d{7}$", message = "Invalid Resident Registration Number format")
    private String RRN;  //주민등록번호

    @NotNull(message = "Address is required")
    private String address;  //주소

    @NotNull(message = "Issue Date is required")
    private LocalDate issueDate;  //발급일

    @NotNull(message = "Expiry Date is required")
    private LocalDate expiryDate;  //만료일

    @NotNull(message = "Image Path is required")
    private String imagePath;  //이미지 경로

    @NotNull(message = "Issuer is required")
    private String issuer;  //발급처
}
