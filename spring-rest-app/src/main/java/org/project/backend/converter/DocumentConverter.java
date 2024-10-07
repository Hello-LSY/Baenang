package org.project.backend.converter;

import org.project.backend.dto.*;
import org.project.backend.model.*;
import org.springframework.stereotype.Component;

@Component
public class DocumentConverter {

    // DTO를 엔티티로 변환하는 메서드
    public Document convertToEntity(DocumentDTO documentDTO, Document document) {
        return Document.builder()
                .documentId(documentDTO.getDocumentId())

                // 각 ID를 Document에 설정
                .rrnId(documentDTO.getRrnId())
                .dlnId(documentDTO.getDlnId())
                .pnId(documentDTO.getPnId())
                .isicId(documentDTO.getIsicId())

                // 이미지 파일 경로 설정
                .ticPath(documentDTO.getTIC())
                .vcPath(documentDTO.getVC())
                .icPath(documentDTO.getIC())

                .token(document.getToken()) // 토큰 추가
                .tokenExpiry(document.getTokenExpiry()) // 토큰 만료 시간 추가
                .build();
    }

    // 엔티티 -> DTO 변환 메서드
    public DocumentDTO convertToDTO(Document document) {
        return DocumentDTO.builder()
                .memberId(document.getMember().getId())
                .documentId(document.getDocumentId())

                // 각 ID를 DTO로 변환
                .rrnId(document.getRrnId())
                .dlnId(document.getDlnId())
                .pnId(document.getPnId())
                .isicId(document.getIsicId())

                // 이미지 파일 경로
                .TIC(document.getTicPath())
                .VC(document.getVcPath())
                .IC(document.getIcPath())
                .build();
    }

    // DriverLicense 엔티티 -> DriverLicenseDTO 변환
    public DriverLicenseDTO convertToDriverLicenseDTO(DriverLicense driverLicense) {
        return DriverLicenseDTO.builder()
                .id(driverLicense.getId()) // DriverLicense의 고유 ID
                .dln(driverLicense.getDln())
                .managementNumber(driverLicense.getManagementNumber())
                .rrn(driverLicense.getRrn())
                .address(driverLicense.getAddress())
                .issueDate(driverLicense.getIssueDate())
                .expiryDate(driverLicense.getExpiryDate())
                .imagePath(driverLicense.getImagePath())
                .issuer(driverLicense.getIssuer())
                .build();
    }

    // InternationalStudentIdentityCard 엔티티 -> InternationalStudentIdentityCardDTO 변환
    public InternationalStudentIdentityCardDTO convertToISICDTO(InternationalStudentIdentityCard isic) {
        return InternationalStudentIdentityCardDTO.builder()
                .id(isic.getId()) // InternationalStudentIdentityCard의 고유 ID
                .isic(isic.getIsic())
                .schoolName(isic.getSchoolName())
                .name(isic.getName())
                .birth(isic.getBirth())
                .issueDate(isic.getIssueDate())
                .expiryDate(isic.getExpiryDate())
                .imagePath(isic.getImagePath())
                .rrn(isic.getRrn())
                .build();
    }

    // Passport 엔티티 -> PassportDTO 변환
    public PassportDTO convertToPassportDTO(Passport passport) {
        return PassportDTO.builder()
                .id(passport.getId()) // Passport의 고유 ID
                .pn(passport.getPn())
                .imagePath(passport.getImagePath())
                .countryCode(passport.getCountryCode())
                .type(passport.getType())
                .surName(passport.getSurName())
                .givenName(passport.getGivenName())
                .koreanName(passport.getKoreanName())
                .birth(passport.getBirth())
                .gender(passport.getGender())
                .nationality(passport.getNationality())
                .authority(passport.getAuthority())
                .issueDate(passport.getIssueDate())
                .expiryDate(passport.getExpiryDate())
                .rrn(passport.getRrn())
                .build();
    }

    // ResidentRegistration 엔티티 -> ResidentRegistrationDTO 변환
    public ResidentRegistrationDTO convertToResidentRegistrationDTO(ResidentRegistration rrn) {
        return ResidentRegistrationDTO.builder()
                .id(rrn.getId()) // ResidentRegistration의 고유 ID
                .rrn(rrn.getRrn())
                .name(rrn.getName())
                .imagePath(rrn.getImagePath())
                .address(rrn.getAddress())
                .issueDate(rrn.getIssueDate())
                .issuer(rrn.getIssuer())
                .build();
    }
}
