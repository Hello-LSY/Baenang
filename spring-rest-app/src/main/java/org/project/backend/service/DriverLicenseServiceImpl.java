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

//    @Override
//    public DriverLicenseDTO createOrUpdateDriverLicense(Long documentId, DriverLicenseDTO driverLicenseDTO) {
//        Document document = findDocumentById(documentId);
//
//        // 기존에 연결된 운전면허증이 있는지 확인
//        DriverLicense existingDriverLicense = document.getDLN();
//        if (existingDriverLicense != null) {
//            // 기존 운전면허증과의 관계를 끊고 삭제
//            driverLicenseRepository.delete(existingDriverLicense);
//            document = document.toBuilder().DLN(null).build();
//            documentRepository.save(document);
//        }
//
//        // 새로운 운전면허증 생성 및 Document와 연결
//        DriverLicense driverLicense = documentConverter.convertToDriverLicenseEntity(driverLicenseDTO, document);
//        DriverLicense savedDriverLicense = driverLicenseRepository.save(driverLicense);
//
//        // Document에 새로운 운전면허증 연결
//        document = document.toBuilder().DLN(savedDriverLicense).build();
//        Document updatedDocument = documentRepository.save(document);
//
//        return documentConverter.convertToDriverLicenseDTO(updatedDocument.getDLN());
//    }

    @Override
    public DriverLicenseDTO getDriverLicenseById(Long documentId) {
        DriverLicense driverLicense = findDocumentById(documentId).getDLN();

        if (driverLicense == null) {
            throw new DocumentNotFoundException("Driver License not found for Document ID: " + documentId);
        }

        return documentConverter.convertToDriverLicenseDTO(driverLicense);
    }

//    @Override
//    public void deleteDriverLicenseById(Long documentId) {
//        // (1) Document에서 DriverLicense를 가져옴
//        Document document = findDocumentById(documentId);
//
//        // (2) DriverLicense가 존재하는지 확인
//        if (document.getDLN() != null) {
//            Long driverLicenseId = document.getDLN().getId(); // 삭제할 DriverLicense의 ID 저장
//
//            // (3) DriverLicense 연결 해제 (toBuilder를 사용하여 새로운 Document 생성)
//            Document updatedDocument = document.toBuilder().DLN(null).build();
//            documentRepository.save(updatedDocument); // 변경된 Document 저장
//
//            // (4) DriverLicense 엔티티 삭제
//            driverLicenseRepository.deleteById(driverLicenseId);
//        }
//    }

    private Document findDocumentById(Long documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found with ID: " + documentId));
    }
}
