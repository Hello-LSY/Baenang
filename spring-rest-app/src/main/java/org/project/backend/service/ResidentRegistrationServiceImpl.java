package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.converter.DocumentConverter;
import org.project.backend.dto.ResidentRegistrationDTO;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.model.Document;
import org.project.backend.model.ResidentRegistration;
import org.project.backend.repository.DocumentRepository;
import org.project.backend.repository.ResidentRegistrationRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ResidentRegistrationServiceImpl implements ResidentRegistrationService{
    private final DocumentRepository documentRepository;
    private final DocumentConverter documentConverter;
    private final ResidentRegistrationRepository residentRegistrationRepository;

//    @Override
//    public ResidentRegistrationDTO createOrUpdateResidentRegistration(Long documentId, ResidentRegistrationDTO residentRegistrationDTO) {
//        Document document = findDocumentById(documentId);
//
//        // 기존에 연결된 주민등록증이 있는지 확인
//        ResidentRegistration existingRR = document.getRRN();
//        if (existingRR != null) {
//            // 기존 주민등록증과의 관계를 끊고 삭제
//            residentRegistrationRepository.delete(existingRR);
//            document = document.toBuilder().DLN(null).build();
//            documentRepository.save(document);
//        }
//
//        // 새로운 주민등록증 생성 및 Document와 연결
//        ResidentRegistration rr = documentConverter.convertToResidentRegistrationEntity(residentRegistrationDTO, document);
//        ResidentRegistration savedrr = residentRegistrationRepository.save(rr);
//
//        // Document에 새로운 주민등록증 연결
//        document = document.toBuilder().RRN(savedrr).build();
//        Document updatedDocument = documentRepository.save(document);
//
//        return documentConverter.convertToResidentRegistrationDTO(updatedDocument.getRRN());
//    }

    @Override
    public ResidentRegistrationDTO getResidentRegistration(Long documentId) {
        ResidentRegistration residentRegistration = findDocumentById(documentId).getRRN();

        if (residentRegistration == null) {
            throw new DocumentNotFoundException("Resident Registration not found for Document ID: " + documentId);
        }

        return documentConverter.convertToResidentRegistrationDTO(residentRegistration);

    }

//    @Override
//    public void deleteResidentRegistrationById(Long documentId) {
//        Document document = findDocumentById(documentId);
//
//        if(document.getRRN() != null) {
//            Long rrId = document.getRRN().getId();
//
//            Document updatedDocument = document.toBuilder().RRN(null).build();
//            documentRepository.save(updatedDocument);
//
//            residentRegistrationRepository.deleteById(rrId);
//        }
//    }

    private Document findDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));
    }
}
