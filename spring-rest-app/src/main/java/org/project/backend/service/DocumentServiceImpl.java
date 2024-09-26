package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.converter.DocumentConverter;
import org.project.backend.dto.*;
import org.project.backend.exception.businessCard.BusinessCardNotFoundException;
import org.project.backend.exception.document.DocumentNotFoundException;
import org.project.backend.model.*;
import org.project.backend.repository.DocumentRepository;
import org.project.backend.repository.MemberRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final MemberRepository memberRepository;
    private final DocumentConverter documentConverter;

    //Creat
    @Override
    public DocumentDTO createDocument(Long memberId, DocumentDTO documentDTO) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found for member ID: " + memberId));

        Document document = documentConverter.convertToEntity(documentDTO, null).toBuilder().member(member).build();
        Document savedDocument = documentRepository.save(document);

        return documentConverter.convertToDTO(savedDocument);
    }

    //Read
    @Override
    public DocumentDTO getDocumentByMemberId(Long memberId) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found for member ID: " + memberId));

        return documentConverter.convertToDTO(document);
    }

    @Override
    public DriverLicense getDriverLicenseByMemberId(Long memberId) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found for member ID: " + memberId));
        return document.getDLN();
    }

    @Override
    public ResidentRegistration getResidentRegistrationByMemberId(Long memberId) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found for member ID: " + memberId));
        return document.getRRN();
    }

    @Override
    public Passport getPassportByMemberId(Long memberId) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found for member ID: " + memberId));
        return document.getPN();
    }

    @Override
    public InternationalStudentIdentityCard getISICByMemberId(Long memberId) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found for member ID: " + memberId));
        return document.getISIC();
    }

    @Override
    public String getTICByMemberId(Long memberId) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found for member ID: " + memberId));
        return document.getTicPath();
    }

    @Override
    public String getVCByMemberId(Long memberId) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found for member ID: " + memberId));
        return document.getVcPath();
    }

    @Override
    public String getICByMemberId(Long memberId) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found for member ID: " + memberId));
        return document.getIcPath();
    }

    //Update
    @Override
    public DocumentDTO updateDriverLicense(Long memberId, DriverLicense updatedDriverLicense) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new BusinessCardNotFoundException("Document not found for member ID: " + memberId));

        Document updatedDocument = document.toBuilder()
                .DLN(updatedDriverLicense)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateResidentRegistration(Long memberId, ResidentRegistration updatedResidentRegistration) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new BusinessCardNotFoundException("Document not found for member ID: " + memberId));

        Document updatedDocument = document.toBuilder()
                .RRN(updatedResidentRegistration)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updatePassport(Long memberId, Passport updatedPassport) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new BusinessCardNotFoundException("Document not found for member ID: " + memberId));

        Document updatedDocument = document.toBuilder()
                .PN(updatedPassport)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateISIC(Long memberId, InternationalStudentIdentityCard updatedISIC) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new BusinessCardNotFoundException("Document not found for member ID: " + memberId));

        Document updatedDocument = document.toBuilder()
                .ISIC(updatedISIC)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateTIC(Long memberId, String updatedTicPath) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new BusinessCardNotFoundException("Document not found for member ID: " + memberId));

        Document updatedDocument = document.toBuilder()
                .ticPath(updatedTicPath)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateVC(Long memberId, String updatedVcPath) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new BusinessCardNotFoundException("Document not found for member ID: " + memberId));

        Document updatedDocument = document.toBuilder()
                .vcPath(updatedVcPath)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateIC(Long memberId, String updateIcPath) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new BusinessCardNotFoundException("Document not found for member ID: " + memberId));

        Document updatedDocument = document.toBuilder()
                .icPath(updateIcPath)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public void deleteDocumentByMemberId(Long memberId) {
        Document document = documentRepository.findByMember_Id(memberId)
                .orElseThrow(()->new DocumentNotFoundException("Document not found for member ID: " + memberId));

        documentRepository.delete(document);
    }

}
