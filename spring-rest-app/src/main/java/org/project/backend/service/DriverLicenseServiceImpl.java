package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.converter.DocumentConverter;
import org.project.backend.dto.DriverLicenseDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.model.Document;
import org.project.backend.model.DriverLicense;
import org.project.backend.repository.DocumentRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DriverLicenseServiceImpl implements DriverLicenseService{

    private final DocumentRepository documentRepository;
    private final DocumentConverter documentConverter;

    @Override
    public DriverLicenseDTO createDriverLicense(Long documentId, DriverLicenseDTO driverLicenseDTO) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(()->new DocumentNotFoundException("Document not found with ID: " + documentId));

        DriverLicense driverLicense = documentConverter.convertToDriverLicenseEntity(driverLicenseDTO, document);
        document = document.toBuilder().DLN(driverLicense).build();

        Document updatedDocument = documentRepository.save(document);

        return documentConverter.convertToDriverLicenseDTO(updatedDocument.getDLN());
    }

    @Override
    public DriverLicenseDTO getDriverLicenseById(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));

        DriverLicense driverLicense = document.getDLN();

        if (driverLicense == null) {
            throw new DocumentNotFoundException("Driver License not found for Document ID: " + documentId);
        }

        return documentConverter.convertToDriverLicenseDTO(driverLicense);
    }

    @Override
    public void deleteDriverLicenseById(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));

        // 운전면허 삭제 (연관관계를 끊음)
        Document updatedDocument = document.toBuilder().DLN(null).build();
        documentRepository.save(updatedDocument);
    }
}
