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
    public DriverLicenseDTO getDriverLicenseById(Long dlnId) {
        // DriverLicense 엔티티 조회
        DriverLicense driverLicense = driverLicenseRepository.findById(dlnId)
                .orElseThrow(() -> new DocumentNotFoundException("Driver License not found with ID: " + dlnId));

        // DriverLicense 엔티티를 DTO로 변환하여 반환
        return documentConverter.convertToDriverLicenseDTO(driverLicense);
    }

    private Document findDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));
    }
}
