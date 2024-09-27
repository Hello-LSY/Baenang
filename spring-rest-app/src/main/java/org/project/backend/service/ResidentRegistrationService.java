package org.project.backend.service;

import org.project.backend.dto.ResidentRegistrationDTO;

public interface ResidentRegistrationService {
    //create
    ResidentRegistrationDTO createOrUpdateResidentRegistration(Long documentId, ResidentRegistrationDTO residentRegistrationDTO);

    //read
    ResidentRegistrationDTO getResidentRegistration(Long documentId);

    //delete
    void deleteResidentRegistrationById(Long documentId);
}
