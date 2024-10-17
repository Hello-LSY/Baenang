package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.converter.DocumentConverter;
import org.project.backend.dto.ResidentRegistrationDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.model.Document;
import org.project.backend.model.ResidentRegistration;
import org.project.backend.repository.DocumentRepository;
import org.project.backend.repository.ResidentRegistrationRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResidentRegistrationServiceImpl implements ResidentRegistrationService{
    private final DocumentRepository documentRepository;
    private final DocumentConverter documentConverter;
    private final ResidentRegistrationRepository residentRegistrationRepository;

    @Override
    public ResidentRegistrationDTO getResidentRegistration(Long documentId) {
        // Document에서 ResidentRegistration ID를 가져오기
        Long residentRegistrationId = findDocumentById(documentId).getRrnId();

        // ResidentRegistration 엔티티 조회
        ResidentRegistration residentRegistration = residentRegistrationRepository.findById(residentRegistrationId)
                .orElseThrow(() -> new DocumentNotFoundException("Resident Registration not found for Document ID: " + documentId));

        // ResidentRegistration 엔티티를 DTO로 변환
        return documentConverter.convertToResidentRegistrationDTO(residentRegistration);

    }

    @Override
    public ResidentRegistrationDTO getResidentRegistrationById(Long residentRegistrationId) {
        // ID로 ResidentRegistration 조회
        ResidentRegistration residentRegistration = residentRegistrationRepository.findById(residentRegistrationId)
                .orElseThrow(() -> new DocumentNotFoundException("Resident Registration not found with ID: " + residentRegistrationId));

        // ResidentRegistration 엔티티를 DTO로 변환
        return convertToDTO(residentRegistration);
    }

    private Document findDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));
    }

    private ResidentRegistrationDTO convertToDTO(ResidentRegistration residentRegistration) {
        return ResidentRegistrationDTO.builder()
                .id(residentRegistration.getId())
                .rrn(residentRegistration.getRrn())
                .name(residentRegistration.getName())
                .imagePath(residentRegistration.getImagePath())
                .address(residentRegistration.getAddress())
                .issueDate(residentRegistration.getIssueDate())
                .issuer(residentRegistration.getIssuer())
                .build();
    }
}
