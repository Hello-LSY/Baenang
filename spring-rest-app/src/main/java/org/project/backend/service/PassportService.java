package org.project.backend.service;

import org.project.backend.dto.PassportDTO;

public interface PassportService {
    //read
    PassportDTO getPassportById(Long pnId);
}
