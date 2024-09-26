package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.converter.DocumentConverter;
import org.project.backend.dto.PassportDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.model.Document;
import org.project.backend.model.Passport;
import org.project.backend.repository.DocumentRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PassportServiceImpl implements PassportService{

    private final DocumentRepository documentRepository;
    private final DocumentConverter documentConverter;

    @Override
    public PassportDTO createPassport(Long documentId, PassportDTO passportDTO) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(()->new DocumentNotFoundException("Document not found with ID: " + documentId));

        Passport passport = documentConverter.convertToPassportEntity(passportDTO, document);
        document = document.toBuilder().PN(passport).build();

        Document updatedDocument = documentRepository.save(document);

        return documentConverter.convertToPassportDTO(updatedDocument.getPN());
    }

    @Override
    public PassportDTO getPassportById(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));

        Passport passport = document.getPN();

        if (passport == null) {
            throw new DocumentNotFoundException("Passport not found for Document ID: " + documentId);
        }

        return documentConverter.convertToPassportDTO(passport);
    }

    @Override
    public void deletePassportById(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));

        Document updatedDocument = document.toBuilder().PN(null).build();
        documentRepository.save(updatedDocument);
    }
}
