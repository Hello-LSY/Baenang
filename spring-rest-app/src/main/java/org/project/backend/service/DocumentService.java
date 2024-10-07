package org.project.backend.service;

import org.project.backend.dto.DocumentDTO;
import org.project.backend.model.DriverLicense;
import org.project.backend.model.InternationalStudentIdentityCard;
import org.project.backend.model.Passport;
import org.project.backend.model.ResidentRegistration;

public interface DocumentService {

    // 문서 생성 (로그인한 사용자 기준으로 새로운 Document 생성)
    DocumentDTO createDocumentForLoggedInUser();

    // 문서 읽기 (로그인한 사용자 기준으로 Document 및 세부 정보 가져오기)
    DocumentDTO getDocumentByLoggedInUser();

    // 각 문서 ID를 반환하는 메서드 (DriverLicense, ResidentRegistration, Passport, InternationalStudentIdentityCard 등)
    Long getDriverLicenseIdByLoggedInUser();
    Long getResidentRegistrationIdByLoggedInUser();
    Long getPassportIdByLoggedInUser();
    Long getISICIdByLoggedInUser();

    // 이미지 경로 반환
    String getTICByLoggedInUser();
    String getVCByLoggedInUser();
    String getICByLoggedInUser();

    // 문서 ID 업데이트 (인증이 성공했을 때 문서 ID 업데이트, 로그인한 사용자 기준)
    DocumentDTO updateDriverLicenseForLoggedInUser(Long driverLicenseId);
    DocumentDTO updateResidentRegistrationForLoggedInUser(Long residentRegistrationId);
    DocumentDTO updatePassportForLoggedInUser(Long passportId);
    DocumentDTO updateISICForLoggedInUser(Long isicId);

    // 이미지 파일 경로 업데이트
    DocumentDTO updateTICForLoggedInUser(String updatedTicPath);
    DocumentDTO updateVCForLoggedInUser(String updatedVcPath);
    DocumentDTO updateICForLoggedInUser(String updatedIcPath);

    // 문서 삭제
    void deleteDocumentForLoggedInUser();

    // 주민등록번호로 문서 ID 업데이트하는 메서드 추가
    void updateDocumentByRrn(String rrn);

    // 이메일 인증 요청 메서드 (이름, 주민등록번호, 이메일 기반)
    void requestVerification(String name, String rrn, String email);

    // 이메일 인증 코드 확인 및 문서 ID 업데이트
    String verifyAndUpdateDocuments(String name, String rrn, String email, String code);

    // 토큰 만료 체크 및 문서 토큰 삭제
    void checkAndExpireDocumentToken();
}
