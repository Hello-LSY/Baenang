package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.converter.DocumentConverter;
import org.project.backend.dto.DriverLicenseDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.model.Document;
import org.project.backend.model.DriverLicense;
import org.project.backend.repository.DocumentRepository;
import org.project.backend.repository.DriverLicenseRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DriverLicenseServiceImpl implements DriverLicenseService{

    private final DocumentRepository documentRepository;
    private final DocumentConverter documentConverter;
    private final DriverLicenseRepository driverLicenseRepository;

    @Override
    public DriverLicenseDTO createDriverLicense(Long documentId, DriverLicenseDTO driverLicenseDTO) {
        Document document = findDocumentById(documentId);

        DriverLicense driverLicense = documentConverter.convertToDriverLicenseEntity(driverLicenseDTO, document);
        DriverLicense savedDriverLicense = driverLicenseRepository.save(driverLicense);

        document = document.toBuilder().DLN(driverLicense).build();
        Document updatedDocument = documentRepository.save(document);

        return documentConverter.convertToDriverLicenseDTO(updatedDocument.getDLN());
    }

    @Override
    public DriverLicenseDTO getDriverLicenseById(Long documentId) {
        DriverLicense driverLicense = findDocumentById(documentId).getDLN();

        if (driverLicense == null) {
            throw new DocumentNotFoundException("Driver License not found for Document ID: " + documentId);
        }

        return documentConverter.convertToDriverLicenseDTO(driverLicense);
    }

    @Override
    public void deleteDriverLicenseById(Long documentId) {
        Document document = findDocumentById(documentId);

        // 운전면허 삭제 (연관관계를 끊음)
        Document updatedDocument = document.toBuilder().DLN(null).build();
        documentRepository.save(updatedDocument);
    }

    private Document findDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));
    }
}
