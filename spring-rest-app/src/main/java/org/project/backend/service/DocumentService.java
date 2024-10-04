package org.project.backend.service;

import org.project.backend.dto.DocumentDTO;
import org.project.backend.model.DriverLicense;
import org.project.backend.model.InternationalStudentIdentityCard;
import org.project.backend.model.Passport;
import org.project.backend.model.ResidentRegistration;

public interface DocumentService {
//    //create
//    DocumentDTO createDocument(Long memberId);
//
//    //read
//    DocumentDTO getDocumentByMemberId(Long memberId);
//    DriverLicense getDriverLicenseByMemberId(Long memberId);
//    ResidentRegistration getResidentRegistrationByMemberId(Long memberId);
//    Passport getPassportByMemberId(Long memberId);
//    InternationalStudentIdentityCard getISICByMemberId(Long memberId);
//    String getTICByMemberId(Long memberId);
//    String getVCByMemberId(Long memberId);
//    String getICByMemberId(Long memberId);
//
//    //update
//    DocumentDTO updateDriverLicense(Long memberId, DriverLicense updatedDriverLicense);
//    DocumentDTO updateResidentRegistration(Long memberId, ResidentRegistration updatedResidentRegistration);
//    DocumentDTO updatePassport(Long memberId, Passport updatedPassport);
//    DocumentDTO updateISIC(Long memberId, InternationalStudentIdentityCard updatedISIC);
//    DocumentDTO updateTIC(Long memberId, String updatedTicPath);
//    DocumentDTO updateVC(Long memberId, String updatedVcPath);
//    DocumentDTO updateIC(Long memberId, String updateIcPath);
//
//    //delete
//    void deleteDocumentByMemberId(Long memberId);


//    // 문서 생성 (Member ID로 새로운 Document 생성)
//    DocumentDTO createDocument(Long memberId);
//
//    // 문서 읽기 (Member ID로 Document 및 세부 정보 가져오기)
//    DocumentDTO getDocumentByMemberId(Long memberId);
//
//    // 각 문서 ID를 반환하는 메서드 (DriverLicense, ResidentRegistration, Passport, InternationalStudentIdentityCard 등)
//    Long getDriverLicenseIdByMemberId(Long memberId);
//
//    Long getResidentRegistrationIdByMemberId(Long memberId);
//
//    Long getPassportIdByMemberId(Long memberId);
//
//    Long getISICIdByMemberId(Long memberId);
//
//    // 이미지 경로 반환
//    String getTICByMemberId(Long memberId);
//
//    String getVCByMemberId(Long memberId);
//
//    String getICByMemberId(Long memberId);
//
//    // 문서 ID 업데이트 (인증이 성공했을 때 문서 ID 업데이트)
//    DocumentDTO updateDriverLicense(Long memberId, Long driverLicenseId);
//
//    DocumentDTO updateResidentRegistration(Long memberId, Long residentRegistrationId);
//
//    DocumentDTO updatePassport(Long memberId, Long passportId);
//
//    DocumentDTO updateISIC(Long memberId, Long isicId);
//
//    // 이미지 파일 경로 업데이트
//    DocumentDTO updateTIC(Long memberId, String updatedTicPath);
//
//    DocumentDTO updateVC(Long memberId, String updatedVcPath);
//
//    DocumentDTO updateIC(Long memberId, String updatedIcPath);
//
//    // 문서 삭제
//    void deleteDocumentByMemberId(Long memberId);

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

}
