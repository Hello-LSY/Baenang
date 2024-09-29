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

import javax.transaction.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final MemberRepository memberRepository;
    private final DocumentConverter documentConverter;

    private Member findMemberById(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found for member ID: " + memberId));
    }

    private Document findDocumentByMemberId(Long memberId) {
        return documentRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new DocumentNotFoundException("Document not found for member ID: " + memberId));
    }

    //Creat
    @Override
    public DocumentDTO createDocument(Long memberId) {
        Member member = findMemberById(memberId);

        // 이미 Document가 존재하는지 확인
        if (documentRepository.findByMember_Id(memberId).isPresent()) {
            throw new IllegalStateException("Member already has a document.");
        }

        /// Document 객체 생성, 나머지 필드는 null로 설정
        Document document = Document.builder()
                .member(member)
                .DLN(null)  // 나머지 필드를 null로 설정
                .RRN(null)
                .PN(null)
                .ISIC(null)
                .ticPath(null)
                .vcPath(null)
                .icPath(null)
                .build();

        Document savedDocument = documentRepository.save(document);

        return documentConverter.convertToDTO(savedDocument);
    }

    //Read
    @Override
    public DocumentDTO getDocumentByMemberId(Long memberId) {
        Document document = findDocumentByMemberId(memberId);
        return documentConverter.convertToDTO(document);
    }

    @Override
    public DriverLicense getDriverLicenseByMemberId(Long memberId) {
        Document document = findDocumentByMemberId(memberId);
        return document.getDLN();
    }

    @Override
    public ResidentRegistration getResidentRegistrationByMemberId(Long memberId) {
        Document document = findDocumentByMemberId(memberId);
        return document.getRRN();
    }

    @Override
    public Passport getPassportByMemberId(Long memberId) {
        Document document = findDocumentByMemberId(memberId);
        return document.getPN();
    }

    @Override
    public InternationalStudentIdentityCard getISICByMemberId(Long memberId) {
        Document document = findDocumentByMemberId(memberId);
        return document.getISIC();
    }

    @Override
    public String getTICByMemberId(Long memberId) {
        Document document = findDocumentByMemberId(memberId);
        return document.getTicPath();
    }

    @Override
    public String getVCByMemberId(Long memberId) {
        Document document = findDocumentByMemberId(memberId);
        return document.getVcPath();
    }

    @Override
    public String getICByMemberId(Long memberId) {
        Document document = findDocumentByMemberId(memberId);
        return document.getIcPath();
    }

    //Update
    @Override
    public DocumentDTO updateDriverLicense(Long memberId, DriverLicense updatedDriverLicense) {
        Document document = findDocumentByMemberId(memberId);

        Document updatedDocument = document.toBuilder()
                .DLN(updatedDriverLicense)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateResidentRegistration(Long memberId, ResidentRegistration updatedResidentRegistration) {
        Document document = findDocumentByMemberId(memberId);

        Document updatedDocument = document.toBuilder()
                .RRN(updatedResidentRegistration)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updatePassport(Long memberId, Passport updatedPassport) {
        Document document = findDocumentByMemberId(memberId);

        Document updatedDocument = document.toBuilder()
                .PN(updatedPassport)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateISIC(Long memberId, InternationalStudentIdentityCard updatedISIC) {
        Document document = findDocumentByMemberId(memberId);

        Document updatedDocument = document.toBuilder()
                .ISIC(updatedISIC)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateTIC(Long memberId, String updatedTicPath) {
        Document document = findDocumentByMemberId(memberId);

        Document updatedDocument = document.toBuilder()
                .ticPath(updatedTicPath)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateVC(Long memberId, String updatedVcPath) {
        Document document = findDocumentByMemberId(memberId);

        Document updatedDocument = document.toBuilder()
                .vcPath(updatedVcPath)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateIC(Long memberId, String updateIcPath) {
        Document document = findDocumentByMemberId(memberId);

        Document updatedDocument = document.toBuilder()
                .icPath(updateIcPath)
                .build();

        documentRepository.save(updatedDocument);
        return documentConverter.convertToDTO(updatedDocument);
    }

    @Override
    public void deleteDocumentByMemberId(Long memberId) {
        // (1) memberId로 Document를 조회
        Document document = findDocumentByMemberId(memberId);

        if (document != null) {
            // (2) 기존 객체의 연관된 데이터를 null로 설정한 새로운 Document 객체 생성
            Document updatedDocument = document.toBuilder()
                    .DLN(null)   // 운전면허 정보 삭제
                    .PN(null)    // 여권 정보 삭제
                    .RRN(null)   // 주민등록증 정보 삭제
                    .ISIC(null)  // 국제학생증 정보 삭제
                    .build();

            // (3) 연관된 데이터 해제 후 Document 삭제
            documentRepository.delete(updatedDocument);
        } else {
            throw new DocumentNotFoundException("Document not found for member ID: " + memberId);
        }
    }
}
