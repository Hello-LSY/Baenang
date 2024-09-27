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
public class ResidentRegistrationDTO {
    private Long id;  //주민등록증 고유번호

    @NotNull(message = "Resident Registration Number is required")
    @Pattern(regexp = "^\\d{6}-\\d{7}$", message = "Invalid Resident Registration Number format")
    private String RRN;   //주민등록증 번호

    @NotNull(message = "Name is required")
    private String name; //사용자 이름

    @NotNull(message = "Image path is required")
    private String imagePath; //이미지경로

    @NotNull(message = "Address is required")
    private String address;  //주소

    @NotNull(message = "Issue Date is required")
    private LocalDate issueDate;  //발급일

    @NotNull(message = "Issuer is required")
    private String issuer;  //발급처
}
