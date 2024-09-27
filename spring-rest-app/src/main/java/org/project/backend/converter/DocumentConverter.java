package org.project.backend.converter;

import org.project.backend.dto.*;
import org.project.backend.model.*;
import org.springframework.stereotype.Component;

@Component
public class DocumentConverter {

    public Document convertToEntity(DocumentDTO documentDTO, Document document) {
        return Document.builder()
                .documentId(documentDTO.getDocumentId())

                // 각 DTO를 엔티티로 변환하여 Document에 설정
                .RRN(documentDTO.getRRN() != null ? convertToResidentRegistrationEntity(documentDTO.getRRN(), document) : null)
                .DLN(documentDTO.getDLN() != null ? convertToDriverLicenseEntity(documentDTO.getDLN(), document) : null)
                .PN(documentDTO.getPN() != null ? convertToPassportEntity(documentDTO.getPN(), document) : null)
                .ISIC(documentDTO.getISIC() != null ? convertToISICEntity(documentDTO.getISIC(), document) : null)

                // 이미지 파일 경로 설정
                .ticPath(documentDTO.getTIC())
                .vcPath(documentDTO.getVC())
                .icPath(documentDTO.getIC())
                .build();
    }

    public DriverLicense convertToDriverLicenseEntity(DriverLicenseDTO driverLicenseDTO, Document document) {
        return DriverLicense.builder()
                .document(document)
                .DLN(driverLicenseDTO.getDLN())
                .managementNumber(driverLicenseDTO.getManagementNumber())
                .RRN(driverLicenseDTO.getRRN())
                .address(driverLicenseDTO.getAddress())
                .issueDate(driverLicenseDTO.getIssueDate())
                .expiryDate(driverLicenseDTO.getExpiryDate())
                .imagePath(driverLicenseDTO.getImagePath())
                .issuer(driverLicenseDTO.getIssuer())
                .build();
    }

    public InternationalStudentIdentityCard convertToISICEntity(InternationalStudentIdentityCardDTO isicDTO, Document document) {
        return InternationalStudentIdentityCard.builder()
                .document(document)
                .isic(isicDTO.getISIC())
                .schoolName(isicDTO.getSchoolName())
                .name(isicDTO.getName())
                .birth(isicDTO.getBirth())
                .issueDate(isicDTO.getIssueDate())
                .expiryDate(isicDTO.getExpiryDate())
                .imagePath(isicDTO.getImagePath())
                .build();
    }

    public Passport convertToPassportEntity(PassportDTO passportDTO, Document document) {
        return Passport.builder()
                .document(document)
                .PN(passportDTO.getPN())
                .imagePath(passportDTO.getImagePath())
                .countryCode(passportDTO.getCountryCode())
                .type(passportDTO.getType())
                .surName(passportDTO.getSurName())
                .givenName(passportDTO.getGivenName())
                .koreanName(passportDTO.getKoreanName())
                .birth(passportDTO.getBirth())
                .gender(passportDTO.getGender())
                .nationality(passportDTO.getNationality())
                .authority(passportDTO.getAuthority())
                .issueDate(passportDTO.getIssueDate())
                .expiryDate(passportDTO.getExpiryDate())
                .build();
    }

    public ResidentRegistration convertToResidentRegistrationEntity(ResidentRegistrationDTO rrnDTO, Document document) {
        return ResidentRegistration.builder()
                .document(document)
                .RRN(rrnDTO.getRRN())
                .name(rrnDTO.getName())
                .imagePath(rrnDTO.getImagePath())
                .address(rrnDTO.getAddress())
                .issueDate(rrnDTO.getIssueDate())
                .issuer(rrnDTO.getIssuer())
                .build();
    }

    //Entity -> DTO
    public DocumentDTO convertToDTO(Document document){
        return DocumentDTO.builder()
                .memberId(document.getMember().getId())
                .documentId(document.getDocumentId())
                .RRN(document.getRRN() != null ? convertToResidentRegistrationDTO(document.getRRN()) : null)
                .DLN(document.getDLN() != null ? convertToDriverLicenseDTO(document.getDLN()) : null)
                .PN(document.getPN() != null ? convertToPassportDTO(document.getPN()) : null)
                .ISIC(document.getISIC() != null ? convertToISICDTO(document.getISIC()) : null)
                .TIC(document.getTicPath())
                .VC(document.getVcPath())
                .IC(document.getIcPath())
                .build();
    }

    public DriverLicenseDTO convertToDriverLicenseDTO(DriverLicense driverLicense) {
        return DriverLicenseDTO.builder()
                .id(driverLicense.getDocument().getDocumentId())
                .DLN(driverLicense.getDLN())
                .managementNumber(driverLicense.getManagementNumber())
                .RRN(driverLicense.getRRN())
                .address(driverLicense.getAddress())
                .issueDate(driverLicense.getIssueDate())
                .expiryDate(driverLicense.getExpiryDate())
                .imagePath(driverLicense.getImagePath())
                .issuer(driverLicense.getIssuer())
                .build();
    }

    public InternationalStudentIdentityCardDTO convertToISICDTO(InternationalStudentIdentityCard isic) {
        return InternationalStudentIdentityCardDTO.builder()
                .id(isic.getDocument().getDocumentId())
                .ISIC(isic.getIsic())
                .schoolName(isic.getSchoolName())
                .name(isic.getName())
                .birth(isic.getBirth())
                .issueDate(isic.getIssueDate())
                .expiryDate(isic.getExpiryDate())
                .imagePath(isic.getImagePath())
                .build();
    }

    public PassportDTO convertToPassportDTO(Passport passport) {
        return PassportDTO.builder()
                .id(passport.getDocument().getDocumentId())
                .PN(passport.getPN())
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
                .build();
    }

    public ResidentRegistrationDTO convertToResidentRegistrationDTO(ResidentRegistration rrn) {
        return ResidentRegistrationDTO.builder()
                .id(rrn.getDocument().getDocumentId())
                .RRN(rrn.getRRN())
                .name(rrn.getName())
                .imagePath(rrn.getImagePath())
                .address(rrn.getAddress())
                .issueDate(rrn.getIssueDate())
                .issuer(rrn.getIssuer())
                .build();
    }
}
