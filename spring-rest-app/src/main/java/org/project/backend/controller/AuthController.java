package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
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
@Api(tags = "Auth API", description = "인증 관련 API") // AuthController 설명 추가
public class AuthController {

    private final AuthService authService;

    @ApiOperation(value = "로그인", notes = "사용자의 ID와 패스워드를 사용하여 로그인합니다.")
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @ApiParam(value = "로그인 요청 데이터", required = true)
            @Valid @RequestBody LoginRequestDTO loginRequest) {
        // AuthService를 이용하여 로그인 처리
        LoginResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}
