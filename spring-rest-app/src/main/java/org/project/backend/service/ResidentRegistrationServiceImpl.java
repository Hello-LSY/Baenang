package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.converter.DocumentConverter;
import org.project.backend.dto.ResidentRegistrationDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.model.Document;
import org.project.backend.model.DriverLicense;
import org.project.backend.model.ResidentRegistration;
import org.project.backend.repository.DocumentRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResidentRegistrationServiceImpl implements ResidentRegistrationService{
    private final DocumentRepository documentRepository;
    private final DocumentConverter documentConverter;

    @Override
    public ResidentRegistrationDTO createResidentRegistration(Long documentId, ResidentRegistrationDTO residentRegistrationDTO) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(()->new DocumentNotFoundException("Document not found with ID: " + documentId));

        ResidentRegistration residentRegistration = documentConverter.convertToResidentRegistrationEntity(residentRegistrationDTO, document);
        document = document.toBuilder().RRN(residentRegistration).build();

        Document updatedDocument = documentRepository.save(document);

        return documentConverter.convertToResidentRegistrationDTO(updatedDocument.getRRN());
    }

    @Override
    public ResidentRegistrationDTO getResidentRegistration(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));

        ResidentRegistration residentRegistration = document.getRRN();

        if (residentRegistration == null) {
            throw new DocumentNotFoundException("Resident Registration not found for Document ID: " + documentId);
        }

        return documentConverter.convertToResidentRegistrationDTO(residentRegistration);

    }

    @Override
    public void deleteDriverLicenseById(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));

        Document updatedDocument = document.toBuilder().RRN(null).build();
        documentRepository.save(updatedDocument);
    }
}
