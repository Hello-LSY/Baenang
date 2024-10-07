package org.project.backend.service;

import org.project.backend.dto.ResidentRegistrationDTO;

public interface ResidentRegistrationService {

    //read
    ResidentRegistrationDTO getResidentRegistration(Long documentId);

    // 주민등록증 정보 조회 메서드
    ResidentRegistrationDTO getResidentRegistrationById(Long residentRegistrationId);

}
