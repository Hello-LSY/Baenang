package org.project.backend.config;

import lombok.RequiredArgsConstructor;
import org.project.backend.model.*;
import org.project.backend.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import java.time.LocalDate;

/**
 * 애플리케이션 초기 데이터를 설정하는 클래스.
 * 여기서는 테스트용 사용자 계정 'user'를 생성한다.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final DocumentRepository documentRepository;
    private final ResidentRegistrationRepository residentRegistrationRepository;
    private final DriverLicenseRepository driverLicenseRepository;
    private final InternationalStudentIdentityCardRepository isicRepository;
    private final PassportRepository passportRepository;

    /**
     * MemberRepository와 PasswordEncoder를 주입받아 초기화한다.
     *
     * @param memberRepository Member 엔티티를 처리하는 레포지토리
     * @param passwordEncoder 비밀번호를 암호화하기 위한 인코더
     */

    /**
     * 애플리케이션 시작 시 테스트용 사용자 'user'를 데이터베이스에 생성하는 메서드.
     * 사용자가 존재하지 않을 경우에만 생성되며, 비밀번호는 암호화되어 저장된다.
     */
    @PostConstruct
    @Transactional
    public void init() {
        // 'user'라는 이름의 사용자가 이미 존재하지 않을 경우에만 생성
        if (memberRepository.findByUsername("user").isEmpty()) {
            Member member = Member.builder()
                    .username("user")
                    .password(passwordEncoder.encode("1234")) // 비밀번호 암호화
                    .build();
            memberRepository.save(member); // 데이터베이스에 사용자 저장
            System.out.println("임시 사용자 'user'가 생성되었습니다.");
            System.out.println("암호화된 비밀번호: " + member.getPassword());
        }

        // 생성된 'user'의 ID를 통해 Member 객체 가져오기
        Member member = memberRepository.findByUsername("user").orElseThrow(() -> new IllegalArgumentException("사용자가 존재하지 않습니다."));

        // Document 객체가 존재하지 않는 경우 생성
        if (documentRepository.findByMemberId(member.getId()).isEmpty()) {
            Document document = Document.builder()
                    .member(member)
                    .build();

            documentRepository.save(document); // Document 저장

            System.out.println("Document가 생성되었습니다.");
        }

        // 생성된 Document 객체 가져오기
        Document document = documentRepository.findByMemberId(member.getId())
                .orElseThrow(() -> new IllegalArgumentException("Document가 존재하지 않습니다."));

        // ResidentRegistration 객체가 존재하지 않는 경우 생성
        if (residentRegistrationRepository.findByRrn("991231-2763531").isEmpty()) {
            ResidentRegistration residentRegistration = ResidentRegistration.builder()
//                    .document(document)  // Document 객체 설정
                    .rrn("991231-2763531")  // 주민등록증 번호
                    .name("홍길동")  // 이름
                    .imagePath("/images/resident_registration.png") // 이미지 경로
                    .address("서울특별시 마포구 성암로 4층") // 주소
                    .issueDate(LocalDate.of(2009, 7, 13))  // 발급일
                    .issuer("서울특별시 마포구청장") // 발급처
                    .build();

            // ResidentRegistration 객체 저장
            residentRegistrationRepository.save(residentRegistration);

//            document = document.toBuilder().(residentRegistration).build();
            document = document.toBuilder()
                    .rrnId(residentRegistration.getId()) // 주민등록증 ID 설정
                    .build();
            documentRepository.save(document);

            System.out.println("주민등록증이 생성되었습니다. ID: " + residentRegistration.getId());
        }

        // DriverLicense 객체가 존재하지 않는 경우 생성
        if (driverLicenseRepository.findByRrn("991231-2763531").isEmpty()) {
            DriverLicense driverLicense = DriverLicense.builder()
//                    .document(document) // Document 객체 설정
                    .dln("21-19-174133-01")  // 운전면허증 번호
                    .managementNumber("8H1X3Y") // 관리 번호
                    .rrn("991231-2763531") // 주민등록번호
                    .address("서울특별시 마포구 성암로 4층") // 주소
                    .issueDate(LocalDate.of(2020, 1, 1)) // 발급일
                    .expiryDate(LocalDate.of(2030, 1, 1)) // 만료일
                    .imagePath("/images/license.png") // 이미지 경로
                    .issuer("서울지방경찰청") // 발급처
                    .build();

            // ResidentRegistration 객체 저장
            driverLicenseRepository.save(driverLicense);

//            document = document.toBuilder().DLN(driverLicense).build();
            document = document.toBuilder()
                    .dlnId(driverLicense.getId()) // 운전면허증 ID 설정
                    .build();
            documentRepository.save(document);

            System.out.println("운전면허증이 생성되었습니다. ID: " + driverLicense.getId());
        }

        if (isicRepository.findByRrn("991231-2763531").isEmpty()) {
            InternationalStudentIdentityCard isic = InternationalStudentIdentityCard.builder()
//                    .document(document) // Document 객체 설정
                    .isic("S123456789012X") // 국제학생증 카드 번호
                    .schoolName("Hankook University") // 학교 이름
                    .name("홍길동")
                    .rrn("991231-2763531") // 성명
                    .birth(LocalDate.of(1999, 12, 31)) // 생년월일
                    .issueDate(LocalDate.of(2022, 1, 1)) // 발급년월
                    .expiryDate(LocalDate.of(2024, 1, 1)) // 만료년월
                    .imagePath("/images/isic_card.png") // 이미지 경로
                    .build();

            isicRepository.save(isic);

//            document = document.toBuilder().ISIC(isic).build();
            document = document.toBuilder()
                    .isicId(isic.getId()) // ISIC ID 설정
                    .build();
            documentRepository.save(document);

            System.out.println("국제학생증이 생성되었습니다. ID: " + isic.getId());
        }

        if (passportRepository.findByPn("M123456789").isEmpty()) {
            Passport passport = Passport.builder()
//                    .document(document)  // Document 객체 설정
                    .pn("M123456789")  // 여권 번호
                    .imagePath("/images/passport.png")  // 이미지 경로
                    .countryCode("KOR")  // 국가 코드
                    .type("P")  // 여권 종류
                    .surName("Hong")  // 성 (영문)
                    .givenName("Gildong")  // 이름 (영문)
                    .koreanName("홍길동")  // 한글 성명
                    .rrn("991231-2763531")
                    .birth(LocalDate.of(1999, 12, 31))  // 생년월일
                    .gender('F')  // 성별
                    .nationality("South Korean")  // 국적
                    .authority("Ministry of Foreign Affairs")  // 발행 관청
                    .issueDate(LocalDate.of(2022, 1, 1))  // 발급일
                    .expiryDate(LocalDate.of(2032, 1, 1))  // 만료일
                    .build();

            passportRepository.save(passport);

//            document = document.toBuilder().PN(passport).build();
            document = document.toBuilder()
                    .pnId(passport.getId()) // 여권 ID 설정
                    .build();
            documentRepository.save(document);

            System.out.println("여권이 생성되었습니다. ID: " + passport.getId());
        }
    }
}
