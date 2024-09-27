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
    public PassportDTO createOrUpdatePassport(Long documentId, PassportDTO passportDTO) {
        Document document = findDocumentById(documentId);

        Passport existingPassport = document.getPN();
        if(existingPassport != null){
            passportRepository.delete(existingPassport);
            document = document.toBuilder().PN(null).build();
            documentRepository.save(document);
        }


        Passport passport = documentConverter.convertToPassportEntity(passportDTO, document);
        Passport savedPassport = passportRepository.save(passport);

        document = document.toBuilder().PN(savedPassport).build();
        Document updatedDocument = documentRepository.save(document);

        return documentConverter.convertToPassportDTO(updatedDocument.getPN());
    }

    @Override
    public PassportDTO getPassportById(Long documentId) {
        Passport passport = findDocumentById(documentId).getPN();

        if (passport == null) {
            throw new DocumentNotFoundException("Passport not found for Document ID: " + documentId);
        }

        return documentConverter.convertToPassportDTO(passport);
    }

    @Override
    public void deletePassportById(Long documentId) {
        Document document = findDocumentById(documentId);

        if(document.getPN()!=null){
            Long passportId = document.getPN().getId();

            Document updatedDocument = document.toBuilder().PN(null).build();
            documentRepository.save(updatedDocument);

            passportRepository.deleteById(passportId);
        }
    }

    private Document findDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));
    }
}
