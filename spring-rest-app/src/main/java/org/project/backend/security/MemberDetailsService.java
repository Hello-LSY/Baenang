package org.project.backend.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.project.backend.model.Member;
import org.project.backend.repository.MemberRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;

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
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Member 객체에서 권한 정보를 가져온다.
        Collection<? extends GrantedAuthority> authorities = member.getAuthorities();

        // 로그에 사용자 이름과 비밀번호를 기록 (디버그용)
        log.debug("Loaded user: {}, password: {}", member.getUsername(), member.getPassword());

        // Spring Security의 User 객체를 생성하여 반환
        return new User(
                member.getUsername(),
                member.getPassword(), // 암호화된 비밀번호 사용
                authorities
        );
    }
}
