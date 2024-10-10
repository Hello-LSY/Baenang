package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.DocumentDTO;
import org.project.backend.model.Document;
import org.project.backend.model.Member;
import org.project.backend.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final MemberRepository memberRepository;
    private final DriverLicenseRepository driverLicenseRepository;
    private final ResidentRegistrationRepository residentRegistrationRepository;
    private final PassportRepository passportRepository;
    private final InternationalStudentIdentityCardRepository isicRepository;
    private final MailService mailService;

    // 문서 생성 (현재 로그인한 사용자 기준)
    @Override
    public DocumentDTO createDocumentForLoggedInUser() {
        Long memberId = getCurrentMemberId(); // 로그인한 사용자 ID 가져오기
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found for ID: " + memberId));

        if (documentRepository.findByMemberId(memberId).isPresent()) {
            throw new IllegalStateException("Member already has a document.");
        }

        Document document = Document.builder()
                .member(member)
                .rrnId(null)
                .dlnId(null)
                .pnId(null)
                .isicId(null)
                .ticPath(null)
                .vcPath(null)
                .icPath(null)
                .token(null)
                .tokenExpiry(null)
                .build();

        Document savedDocument = documentRepository.save(document);
        return convertToDTO(savedDocument);
    }

    // 문서 읽기 (현재 로그인한 사용자 기준)
    @Override
    public DocumentDTO getDocumentByLoggedInUser() {
        Long memberId = getCurrentMemberId();

        // 로그인한 사용자의 문서 존재 여부 확인
        Optional<Document> optionalDocument = documentRepository.findDocumentWithAllDetails(memberId);

        // 문서가 없으면 자동으로 생성
        if (optionalDocument.isEmpty()) {
            createDocumentForLoggedInUser();
            // 문서 생성 후 다시 조회
            optionalDocument = documentRepository.findDocumentWithAllDetails(memberId);
        }

        // 문서가 있으면 반환, 없으면 예외 처리
        Document document = optionalDocument
                .orElseThrow(() -> new IllegalArgumentException("Document not found for member ID: " + memberId));

        return convertToDTO(document);
    }

    // 각 문서 ID 반환 (로그인한 사용자 기준)
    @Override
    public Long getDriverLicenseIdByLoggedInUser() {
        Document document = getDocumentEntityByLoggedInUser();
        return document.getDlnId();
    }

    @Override
    public Long getResidentRegistrationIdByLoggedInUser() {
        Document document = getDocumentEntityByLoggedInUser();
        return document.getRrnId();
    }

    @Override
    public Long getPassportIdByLoggedInUser() {
        Document document = getDocumentEntityByLoggedInUser();
        return document.getPnId();
    }

    @Override
    public Long getISICIdByLoggedInUser() {
        Document document = getDocumentEntityByLoggedInUser();
        return document.getIsicId();
    }

    // 이미지 경로 반환
    @Override
    public String getTICByLoggedInUser() {
        Document document = getDocumentEntityByLoggedInUser();
        return document.getTicPath();
    }

    @Override
    public String getVCByLoggedInUser() {
        Document document = getDocumentEntityByLoggedInUser();
        return document.getVcPath();
    }

    @Override
    public String getICByLoggedInUser() {
        Document document = getDocumentEntityByLoggedInUser();
        return document.getIcPath();
    }

    // 문서 ID 업데이트 (로그인한 사용자 기준)
    @Override
    public DocumentDTO updateDriverLicenseForLoggedInUser(Long driverLicenseId) {
        Document document = getDocumentEntityByLoggedInUser();
        Document updatedDocument = document.toBuilder()
                .dlnId(driverLicenseId)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateResidentRegistrationForLoggedInUser(Long residentRegistrationId) {
        Document document = getDocumentEntityByLoggedInUser();
        Document updatedDocument = document.toBuilder()
                .rrnId(residentRegistrationId)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updatePassportForLoggedInUser(Long passportId) {
        Document document = getDocumentEntityByLoggedInUser();
        Document updatedDocument = document.toBuilder()
                .pnId(passportId)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateISICForLoggedInUser(Long isicId) {
        Document document = getDocumentEntityByLoggedInUser();
        Document updatedDocument = document.toBuilder()
                .isicId(isicId)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    // 이미지 파일 경로 업데이트
    @Override
    public DocumentDTO updateTICForLoggedInUser(String updatedTicPath) {
        Document document = getDocumentEntityByLoggedInUser();
        Document updatedDocument = document.toBuilder()
                .ticPath(updatedTicPath)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateVCForLoggedInUser(String updatedVcPath) {
        Document document = getDocumentEntityByLoggedInUser();
        Document updatedDocument = document.toBuilder()
                .vcPath(updatedVcPath)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    @Override
    public DocumentDTO updateICForLoggedInUser(String updatedIcPath) {
        Document document = getDocumentEntityByLoggedInUser();
        Document updatedDocument = document.toBuilder()
                .icPath(updatedIcPath)
                .build();
        documentRepository.save(updatedDocument);
        return convertToDTO(updatedDocument);
    }

    // 문서 삭제 (로그인한 사용자 기준)
    @Override
    public void deleteDocumentForLoggedInUser() {
        Document document = getDocumentEntityByLoggedInUser();
        documentRepository.delete(document);
    }

    // 주민등록번호로 문서 ID 업데이트
    @Override
    public void updateDocumentByRrn(String rrn) {
        Long memberId = getCurrentMemberId();
        Document document = getDocumentEntityByLoggedInUser();

        Document.DocumentBuilder updatedDocumentBuilder = document.toBuilder();

        driverLicenseRepository.findByRrn(rrn).ifPresent(driverLicense -> {
            updatedDocumentBuilder.dlnId(driverLicense.getId());
        });

        residentRegistrationRepository.findByRrn(rrn).ifPresent(residentRegistration -> {
            updatedDocumentBuilder.rrnId(residentRegistration.getId());
        });

        passportRepository.findByRrn(rrn).ifPresent(passport -> {
            updatedDocumentBuilder.pnId(passport.getId());
        });

        isicRepository.findByRrn(rrn).ifPresent(isic -> {
            updatedDocumentBuilder.isicId(isic.getId());
        });

        Document updatedDocument = updatedDocumentBuilder.build();
        documentRepository.save(updatedDocument);
    }

    // 이메일 인증 요청 메서드
    @Override
    public void requestVerification(String fullName, String rrn, String email) {
        // 현재 로그인한 사용자 정보 가져오기
        Long memberId = getCurrentMemberId(); // 로그인한 사용자 ID 가져오기
        Member currentMember = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Logged-in user not found"));

        // 로그인한 사용자의 이름과 주민등록번호가 입력된 값과 일치하는지 확인
        if (!currentMember.getFullName().equals(fullName) || !currentMember.getRegistrationNumber().equals(rrn)) {
            throw new IllegalArgumentException("Logged-in user's fullName and rrn do not match the provided information.");
        }

        // 이름과 주민등록번호로 멤버 찾기 (실제 로직에서는 불필요할 수 있음)
        Member member = memberRepository.findByFullNameAndRegistrationNumber(fullName, rrn)
                .orElseThrow(() -> new IllegalArgumentException("No member found with the provided name and rrn"));

        // 인증 코드 생성 및 이메일 전송
        String verificationCode = UUID.randomUUID().toString();
        verificationCodes.put(email, verificationCode);
        verificationExpiryTimes.put(email, LocalDateTime.now().plusMinutes(5));

        String subject = "Document Verification Code";
        String message = "Your verification code is: " + verificationCode;
        mailService.sendMail(email, subject, message);
    }

    // 이메일 인증 코드 확인 및 문서 ID 업데이트
    @Override
    public String verifyAndUpdateDocuments(String fullName, String rrn, String email, String code) {
        // 인증 코드가 유효한지 확인
        if (!verificationCodes.containsKey(email) || !verificationCodes.get(email).equals(code)) {
            throw new IllegalArgumentException("Invalid or expired verification code");
        }

        // 인증 코드의 유효 기간을 확인
        if (verificationExpiryTimes.get(email).isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification code has expired");
        }

        // 인증 성공 시 토큰 생성
        String token = UUID.randomUUID().toString();
        Member member = memberRepository.findByFullNameAndRegistrationNumber(fullName, rrn)
                .orElseThrow(() -> new IllegalArgumentException("No member found with the provided name and rrn"));

        // 사용자와 연결된 문서 조회
        Document document = documentRepository.findByMemberId(member.getId())
                .orElseThrow(() -> new IllegalArgumentException("Document not found for member"));

        // 문서 ID 업데이트 (rrn 값에 기반한 검색)
        Document.DocumentBuilder updatedDocumentBuilder = document.toBuilder();

        driverLicenseRepository.findByRrn(rrn).ifPresent(driverLicense -> {
            updatedDocumentBuilder.dlnId(driverLicense.getId());
        });

        residentRegistrationRepository.findByRrn(rrn).ifPresent(residentRegistration -> {
            updatedDocumentBuilder.rrnId(residentRegistration.getId());
        });

        passportRepository.findByRrn(rrn).ifPresent(passport -> {
            updatedDocumentBuilder.pnId(passport.getId());
        });

        isicRepository.findByRrn(rrn).ifPresent(isic -> {
            updatedDocumentBuilder.isicId(isic.getId());
        });

        // 토큰과 만료 시간 설정
        Document updatedDocument = updatedDocumentBuilder
                .token(token)
                .tokenExpiry(LocalDateTime.now().plusMinutes(60))
                .build();

        // 업데이트된 문서 저장
        documentRepository.save(updatedDocument);

        // 인증 코드 및 만료 시간 삭제
        verificationCodes.remove(email);
        verificationExpiryTimes.remove(email);

        return token;
    }

    // 토큰 만료 체크 및 문서 토큰 삭제
    @Override
    public void checkAndExpireDocumentToken() {
        List<Document> documents = documentRepository.findAll();
        for (Document document : documents) {
            if (document.getTokenExpiry() != null && document.getTokenExpiry().isBefore(LocalDateTime.now())) {
                Document updatedDocument = document.toBuilder()
                        .dlnId(null)
                        .rrnId(null)
                        .pnId(null)
                        .isicId(null)
                        .token(null)
                        .tokenExpiry(null)
                        .build();
                documentRepository.save(updatedDocument);
            }
        }
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
                .token(document.getToken()) // 토큰 추가
                .tokenExpiry(document.getTokenExpiry()) // 토큰 만료 시간 추가
                .build();
    }

    // 로그인한 사용자의 Document 엔티티 가져오기
    private Document getDocumentEntityByLoggedInUser() {
        Long memberId = getCurrentMemberId();
        return documentRepository.findDocumentWithAllDetails(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found for member ID: " + memberId));
    }

    // 현재 로그인한 사용자의 memberId를 반환하는 메서드
    private Long getCurrentMemberId() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return memberRepository.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("Member not found for username: " + username))
                    .getId();
        } else {
            throw new IllegalArgumentException("Invalid user authentication.");
        }
    }

    // 인증 코드 및 만료 시간 관리
    private final Map<String, String> verificationCodes = new HashMap<>();
    private final Map<String, LocalDateTime> verificationExpiryTimes = new HashMap<>();
}
