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

//    @Override
//    public InternationalStudentIdentityCardDTO createOrUpdateISIC(Long documentId, InternationalStudentIdentityCardDTO isicDTO) {
//        Document document = findDocumentById(documentId);
//
//        InternationalStudentIdentityCard existingISIC = document.getISIC();
//        if(existingISIC != null){
//            isicRepository.delete(existingISIC);
//            document = document.toBuilder().ISIC(null).build();
//            documentRepository.save(document);
//        }
//
//        InternationalStudentIdentityCard isic = documentConverter.convertToISICEntity(isicDTO, document);
//        InternationalStudentIdentityCard savedISIC = isicRepository.save(isic);
//
//        document = document.toBuilder().ISIC(savedISIC).build();
//        Document updatedDocument = documentRepository.save(document);
//
//        return documentConverter.convertToISICDTO(updatedDocument.getISIC());
//    }

//    @Override
//    public InternationalStudentIdentityCardDTO getISICById(Long documentId) {
//        // Document에서 ISIC ID 가져오기
//        Long isicId = findDocumentById(documentId).getIsicId();
//
//        if (isicId == null) {
//            throw new DocumentNotFoundException("ISIC not found for Document ID: " + documentId);
//        }
//
//        // ISIC 엔티티 조회
//        InternationalStudentIdentityCard isic = isicRepository.findById(isicId)
//                .orElseThrow(() -> new DocumentNotFoundException("ISIC not found with ID: " + isicId));
//
//        // ISIC 엔티티를 DTO로 변환하여 반환
//        return documentConverter.convertToISICDTO(isic);
//    }

    @Override
    public InternationalStudentIdentityCardDTO getISICById(Long isicId) {
        // ISIC 엔티티 조회
        InternationalStudentIdentityCard isic = isicRepository.findById(isicId)
                .orElseThrow(() -> new DocumentNotFoundException("ISIC not found with ID: " + isicId));

        // ISIC 엔티티를 DTO로 변환하여 반환
        return documentConverter.convertToISICDTO(isic);
    }

    private Document findDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));
    }
}
