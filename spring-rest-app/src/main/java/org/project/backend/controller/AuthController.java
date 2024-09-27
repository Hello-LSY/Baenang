package org.project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.LoginRequestDTO;
import org.project.backend.dto.LoginResponseDTO;
import org.project.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        // AuthService를 이용하여 로그인 처리
        LoginResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}
