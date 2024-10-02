package org.project.backend.dto;

import io.swagger.annotations.ApiModelProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentDTO {
    @ApiModelProperty(value = "회원 ID", example = "1")
    private Long memberId;

    @ApiModelProperty(value = "문서 고유번호", example = "100")
    private Long documentId;

    @ApiModelProperty(value = "주민등록 정보", example = "{...}") // DTO를 포함한 설명
    private ResidentRegistrationDTO RRN;

    @ApiModelProperty(value = "운전면허 정보", example = "{...}")
    private DriverLicenseDTO DLN;

    @ApiModelProperty(value = "여권 정보", example = "{...}")
    private PassportDTO PN;

    @ApiModelProperty(value = "국제학생증 정보", example = "{...}")
    private InternationalStudentIdentityCardDTO ISIC;

    @ApiModelProperty(value = "여행 보험 증명서", example = "https://example.com/travelInsurance.jpg")
    private String TIC;

    @ApiModelProperty(value = "예방 접종 증명서", example = "https://example.com/vaccineCertificate.jpg")
    private String VC;

    @ApiModelProperty(value = "출입국 사실 증명서", example = "https://example.com/immigrationCertificate.jpg")
    private String IC;
}