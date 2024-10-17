package org.project.backend.service;

import org.project.backend.dto.LoginRequestDTO;
import org.project.backend.dto.LoginResponseDTO;
import org.springframework.security.core.Authentication;

public interface AuthService {
    LoginResponseDTO login(LoginRequestDTO loginRequest); // 로그인 메서드 정의
    Authentication authenticate(LoginRequestDTO loginRequest); // 인증 메서드 정의
}
