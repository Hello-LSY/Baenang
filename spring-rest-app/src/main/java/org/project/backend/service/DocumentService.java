package org.project.backend.service;

import org.project.backend.dto.DocumentDTO;
import org.project.backend.model.DriverLicense;
import org.project.backend.model.InternationalStudentIdentityCard;
import org.project.backend.model.Passport;
import org.project.backend.model.ResidentRegistration;

public interface DocumentService {
    //create
    DocumentDTO createDocument(Long memberId, DocumentDTO documentDTO);

    //read
    DocumentDTO getDocumentByMemberId(Long memberId);
    DriverLicense getDriverLicenseByMemberId(Long memberId);
    ResidentRegistration getResidentRegistrationByMemberId(Long memberId);
    Passport getPassportByMemberId(Long memberId);
    InternationalStudentIdentityCard getISICByMemberId(Long memberId);
    String getTICByMemberId(Long memberId);
    String getVCByMemberId(Long memberId);
    String getICByMemberId(Long memberId);

    //update
    DocumentDTO updateDriverLicense(Long memberId, DriverLicense updatedDriverLicense);
    DocumentDTO updateResidentRegistration(Long memberId, ResidentRegistration updatedResidentRegistration);
    DocumentDTO updatePassport(Long memberId, Passport updatedPassport);
    DocumentDTO updateISIC(Long memberId, InternationalStudentIdentityCard updatedISIC);
    DocumentDTO updateTIC(Long memberId, String updatedTicPath);
    DocumentDTO updateVC(Long memberId, String updatedVcPath);
    DocumentDTO updateIC(Long memberId, String updateIcPath);

    //delete
    void deleteDocumentByMemberId(Long memberId);
}
