package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.converter.DocumentConverter;
import org.project.backend.dto.InternationalStudentIdentityCardDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.model.Document;
import org.project.backend.model.InternationalStudentIdentityCard;
import org.project.backend.repository.DocumentRepository;
import org.project.backend.repository.InternationalStudentIdentityCardRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InternationalStudentIdentityCardServiceImpl implements InternationalStudentIdentityCardService{

    private final DocumentRepository documentRepository;
    private final DocumentConverter documentConverter;
    private final InternationalStudentIdentityCardRepository isicRepository;

    @Override
    public InternationalStudentIdentityCardDTO createOrUpdateISIC(Long documentId, InternationalStudentIdentityCardDTO isicDTO) {
        Document document = findDocumentById(documentId);

        InternationalStudentIdentityCard existingISIC = document.getISIC();
        if(existingISIC != null){
            isicRepository.delete(existingISIC);
            document = document.toBuilder().ISIC(null).build();
            documentRepository.save(document);
        }

        InternationalStudentIdentityCard isic = documentConverter.convertToISICEntity(isicDTO, document);
        InternationalStudentIdentityCard savedISIC = isicRepository.save(isic);

        document = document.toBuilder().ISIC(savedISIC).build();
        Document updatedDocument = documentRepository.save(document);

        return documentConverter.convertToISICDTO(updatedDocument.getISIC());
    }

    @Override
    public InternationalStudentIdentityCardDTO getISICById(Long documentId) {
        InternationalStudentIdentityCard isic = findDocumentById(documentId).getISIC();

        if(isic==null){
            throw new DocumentNotFoundException("ISIC not found for Document ID: "+documentId);
        }

        return documentConverter.convertToISICDTO(isic);
    }

    @Override
    public void deleteISICById(Long documentId) {
        Document document = findDocumentById(documentId);

        if(document.getISIC() != null){
            Long isicId = document.getISIC().getId();

            Document updatedDocument = document.toBuilder().ISIC(null).build();
            documentRepository.save(updatedDocument);

            isicRepository.deleteById(isicId);
        }
    }

    private Document findDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));
    }
}
