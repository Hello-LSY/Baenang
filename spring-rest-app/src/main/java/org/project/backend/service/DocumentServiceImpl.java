package org.project.backend.service;

import lombok.RequiredArgsConstructor;
//import org.project.backend.converter.DocumentConverter;
import org.project.backend.dto.*;
import org.project.backend.model.*;
import org.project.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    @Autowired
    private final DocumentRepository documentRepository;
    private final MemberRepository memberRepository;
    private final DriverLicenseRepository driverLicenseRepository;
    private final ResidentRegistrationRepository residentRegistrationRepository;
    private final PassportRepository passportRepository;
    private final InternationalStudentIdentityCardRepository isicRepository;

    // 문서 생성 (현재 로그인한 사용자 기준)
    @Override
    public DocumentDTO createDocumentForLoggedInUser() {
        Long memberId = getCurrentMemberId(); // 로그인한 사용자 memberId 가져오기

        // memberId로 Member 엔티티 조회
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found for ID: " + memberId));

        // 이미 Document가 존재하는지 확인
        if (documentRepository.findByMemberId(memberId).isPresent()) {
            throw new IllegalStateException("Member already has a document.");
        }

        // Document 객체 생성, 나머지 필드는 null로 설정
        Document document = Document.builder()
                .member(member)
                .rrnId(null)
                .dlnId(null)
                .pnId(null)
                .isicId(null)
                .ticPath(null)
                .vcPath(null)
                .icPath(null)
                .build();

        Document savedDocument = documentRepository.save(document);
        return convertToDTO(savedDocument);
    }

    // 문서 읽기 (현재 로그인한 사용자 기준)
    @Override
    public DocumentDTO getDocumentByLoggedInUser() {
        Long memberId = getCurrentMemberId();
        Document document = documentRepository.findDocumentWithAllDetails(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found for member ID: " + memberId));
        return convertToDTO(document);
    }

    // 각 문서 ID 반환 (로그인한 사용자 기준)
    @Override
    public Long getDriverLicenseIdByLoggedInUser() {
        Long memberId = getCurrentMemberId();
        return documentRepository.findDocumentWithAllDetails(memberId)
                .map(Document::getDlnId)
                .orElse(null);
    }

    @Override
    public Long getResidentRegistrationIdByLoggedInUser() {
        Long memberId = getCurrentMemberId();
        return documentRepository.findDocumentWithAllDetails(memberId)
                .map(Document::getRrnId)
                .orElse(null);
    }

    @Override
    public Long getPassportIdByLoggedInUser() {
        Long memberId = getCurrentMemberId();
        return documentRepository.findDocumentWithAllDetails(memberId)
                .map(Document::getPnId)
                .orElse(null);
    }

    @Override
    public Long getISICIdByLoggedInUser() {
        Long memberId = getCurrentMemberId();
        return documentRepository.findDocumentWithAllDetails(memberId)
                .map(Document::getIsicId)
                .orElse(null);
    }

    // 이미지 경로 반환 (로그인한 사용자 기준)
    @Override
    public String getTICByLoggedInUser() {
        Long memberId = getCurrentMemberId();
        return documentRepository.findDocumentWithAllDetails(memberId)
                .map(Document::getTicPath)
                .orElse(null);
    }

    @Override
    public String getVCByLoggedInUser() {
        Long memberId = getCurrentMemberId();
        return documentRepository.findDocumentWithAllDetails(memberId)
                .map(Document::getVcPath)
                .orElse(null);
    }

    @Override
    public String getICByLoggedInUser() {
        Long memberId = getCurrentMemberId();
        return documentRepository.findDocumentWithAllDetails(memberId)
                .map(Document::getIcPath)
                .orElse(null);
    }

    // 문서 ID 업데이트 (로그인한 사용자 기준)
    @Override
    public DocumentDTO updateDriverLicenseForLoggedInUser(Long driverLicenseId) {
        Long memberId = getCurrentMemberId();
        Document document = getDocumentEntityByMemberId(memberId);
        Document updatedDocument = document.toBuilder()
                .dlnId(driverLicenseId)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateResidentRegistrationForLoggedInUser(Long residentRegistrationId) {
        Long memberId = getCurrentMemberId();
        Document document = getDocumentEntityByMemberId(memberId);
        Document updatedDocument = document.toBuilder()
                .rrnId(residentRegistrationId)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updatePassportForLoggedInUser(Long passportId) {
        Long memberId = getCurrentMemberId();
        Document document = getDocumentEntityByMemberId(memberId);
        Document updatedDocument = document.toBuilder()
                .pnId(passportId)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateISICForLoggedInUser(Long isicId) {
        Long memberId = getCurrentMemberId();
        Document document = getDocumentEntityByMemberId(memberId);
        Document updatedDocument = document.toBuilder()
                .isicId(isicId)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    // 이미지 파일 경로 업데이트
    @Override
    public DocumentDTO updateTICForLoggedInUser(String updatedTicPath) {
        Long memberId = getCurrentMemberId();
        Document document = getDocumentEntityByMemberId(memberId);
        Document updatedDocument = document.toBuilder()
                .ticPath(updatedTicPath)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateVCForLoggedInUser(String updatedVcPath) {
        Long memberId = getCurrentMemberId();
        Document document = getDocumentEntityByMemberId(memberId);
        Document updatedDocument = document.toBuilder()
                .vcPath(updatedVcPath)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateICForLoggedInUser(String updatedIcPath) {
        Long memberId = getCurrentMemberId();
        Document document = getDocumentEntityByMemberId(memberId);
        Document updatedDocument = document.toBuilder()
                .icPath(updatedIcPath)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    // 문서 삭제 (로그인한 사용자 기준)
    @Override
    public void deleteDocumentForLoggedInUser() {
        Long memberId = getCurrentMemberId();
        Document document = getDocumentEntityByMemberId(memberId);
        documentRepository.delete(document);
    }

    // Document 엔티티 가져오기
    private Document getDocumentEntityByMemberId(Long memberId) {
        return documentRepository.findByMemberId(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found for member ID: " + memberId));
    }

    // Document 엔티티를 DTO로 변환하는 메서드
    private DocumentDTO convertToDTO(Document document) {
        return DocumentDTO.builder()
                .memberId(document.getMember().getId())
                .documentId(document.getDocumentId())
                .rrnId(document.getRrnId())
                .dlnId(document.getDlnId())
                .pnId(document.getPnId())
                .isicId(document.getIsicId())
                .TIC(document.getTicPath())
                .VC(document.getVcPath())
                .IC(document.getIcPath())
                .build();
    }

    @Override
    public void updateDocumentByRrn(String rrn) {
        // 현재 로그인한 사용자의 memberId 가져오기
        Long memberId = getCurrentMemberId();
        Document document = getDocumentEntityByMemberId(memberId);

        // 새로운 Document 객체를 만들기 위한 빌더 초기화
        Document.DocumentBuilder updatedDocumentBuilder = document.toBuilder();

        // 1. Driver License에서 rrn으로 검색
        driverLicenseRepository.findByRrn(rrn).ifPresent(driverLicense -> {
            updatedDocumentBuilder.dlnId(driverLicense.getId());
        });

        // 2. Resident Registration에서 rrn으로 검색
        residentRegistrationRepository.findByRrn(rrn).ifPresent(residentRegistration -> {
            updatedDocumentBuilder.rrnId(residentRegistration.getId());
        });

        // 3. Passport에서 rrn으로 검색
        passportRepository.findByRrn(rrn).ifPresent(passport -> {
            updatedDocumentBuilder.pnId(passport.getId());
        });

        // 4. International Student Identity Card에서 rrn으로 검색
        isicRepository.findByRrn(rrn).ifPresent(isic -> {
            updatedDocumentBuilder.isicId(isic.getId());
        });

        // 업데이트된 Document 객체 생성
        Document updatedDocument = updatedDocumentBuilder.build();

        // 변경된 document 저장
        documentRepository.save(updatedDocument);
    }

    // 현재 로그인한 사용자의 memberId를 반환하는 메서드
    private Long getCurrentMemberId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            Member member = memberRepository.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("Member not found for username: " + username));
            return member.getId();
        } else {
            throw new IllegalArgumentException("Invalid user authentication.");
        }
    }

}
