package org.project.backend.service;

import org.project.backend.dto.PassportDTO;

public interface PassportService {
    //create
    PassportDTO createPassport(Long documentId, PassportDTO passportDTO);

    //read
    PassportDTO getPassportById(Long documentId);

    //delete
    void deletePassportById(Long documentId);
}
