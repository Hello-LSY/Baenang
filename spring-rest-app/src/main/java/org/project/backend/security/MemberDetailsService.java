package org.project.backend.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.project.backend.model.Member;
import org.project.backend.repository.MemberRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * 사용자 세부 정보를 로드하는 서비스 클래스.
 * Spring Security의 UserDetailsService를 구현하여 사용자 인증 정보를 제공한다.
 * Spring Security로 로그인 구현하려면 반 필수적으로 구현해야함
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MemberDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    /**
     * 사용자 이름으로 사용자 세부 정보를 로드한다.
     *
     * @param username 사용자 이름
     * @return UserDetails 객체, 사용자 이름, 암호화된 비밀번호, 권한 정보 포함
     * @throws UsernameNotFoundException 사용자 이름이 존재하지 않을 때 예외 발생
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 사용자 이름으로 Member 객체를 조회하거나 예외를 던진다.
        Member member = memberRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // 로그에 사용자 이름을 기록
//        log.debug("Loaded user: {}", member.getUsername());

        // Member 객체 자체를 반환 (UserDetails 인터페이스를 구현하므로 가능)
        return member;
    }
}
