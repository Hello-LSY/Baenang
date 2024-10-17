package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.converter.DocumentConverter;
import org.project.backend.dto.PassportDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.model.Document;
import org.project.backend.model.Passport;
import org.project.backend.repository.DocumentRepository;
import org.project.backend.repository.PassportRepository;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PassportServiceImpl implements PassportService{

    private final DocumentRepository documentRepository;
    private final DocumentConverter documentConverter;
    private final PassportRepository passportRepository;


    @Override
    public PassportDTO getPassportById(Long pnId) {
        // Passport 엔티티 조회
        Passport passport = passportRepository.findById(pnId)
                .orElseThrow(() -> new DocumentNotFoundException("Passport not found with ID: " + pnId));

        // Passport 엔티티를 DTO로 변환하여 반환
        return documentConverter.convertToPassportDTO(passport);
    }

    private Document findDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));
    }
}
