package org.project.backend.config;

import lombok.RequiredArgsConstructor;
import org.project.backend.model.Member;
import org.project.backend.repository.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;

/**
 * 애플리케이션 초기 데이터를 설정하는 클래스.
 * 여기서는 테스트용 사용자 계정 'user'를 생성한다.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

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
    }
}
