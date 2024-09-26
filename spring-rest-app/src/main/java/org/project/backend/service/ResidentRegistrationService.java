package org.project.backend.service;

import org.project.backend.dto.ResidentRegistrationDTO;

public interface ResidentRegistrationService {
    //create
    ResidentRegistrationDTO createResidentRegistration(Long documentId, ResidentRegistrationDTO residentRegistrationDTO);

    //read
    ResidentRegistrationDTO getResidentRegistration(Long documentId);

    //delete
    void deleteDriverLicenseById(Long documentId);
}
