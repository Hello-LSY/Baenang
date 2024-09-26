package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.converter.DocumentConverter;
import org.project.backend.dto.InternationalStudentIdentityCardDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.model.Document;
import org.project.backend.model.InternationalStudentIdentityCard;
import org.project.backend.repository.DocumentRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InternationalStudentIdentityCardServiceImpl implements InternationalStudentIdentityCardService{

    private final DocumentRepository documentRepository;
    private final DocumentConverter documentConverter;

    @Override
    public InternationalStudentIdentityCardDTO createInternationalStudentIdentityCard(Long documentId, InternationalStudentIdentityCardDTO isic) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(()->new DocumentNotFoundException("Document not found with ID: " + documentId));

        InternationalStudentIdentityCard internationalStudentIdentityCard = documentConverter.convertToISICEntity(isic, document);
        document = document.toBuilder().ISIC(internationalStudentIdentityCard).build();

        Document updatedDocument = documentRepository.save(document);

        return documentConverter.convertToISICDTO(updatedDocument.getISIC());
    }

    @Override
    public InternationalStudentIdentityCardDTO getInternationalStudentIdentityCard(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(()->new DocumentNotFoundException("Document not found with ID: " + documentId));

        InternationalStudentIdentityCard isic = document.getISIC();

        if(isic==null){
            throw new DocumentNotFoundException("ISIC not found for Document ID: "+documentId);
        }

        return documentConverter.convertToISICDTO(isic);
    }

    @Override
    public void deleteInternationalStudentIdentityCard(Long documentId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));

        Document updatedDocument = document.toBuilder().ISIC(null).build();
        documentRepository.save(updatedDocument);
    }
}
