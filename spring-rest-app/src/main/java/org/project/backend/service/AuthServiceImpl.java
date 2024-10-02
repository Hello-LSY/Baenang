package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.LoginRequestDTO;
import org.project.backend.dto.LoginResponseDTO;
import org.project.backend.model.Member;
import org.project.backend.repository.MemberRepository;
import org.project.backend.security.jwt.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final MemberRepository memberRepository;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        try {
            // 인증 처리
            Authentication authentication = authenticate(loginRequest);

            // JWT 토큰 생성
            String token = jwtTokenProvider.generateToken(authentication);

            // 사용자 정보 조회
            Member member = memberRepository.findByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            // 응답 객체 반환 (memberId 포함)
            return new LoginResponseDTO(member.getId(),token, "Bearer");
        } catch (AuthenticationException e) {
            throw new UsernameNotFoundException("Invalid username/password");
        }
    }

    @Override
    public Authentication authenticate(LoginRequestDTO loginRequest) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
    }
}
