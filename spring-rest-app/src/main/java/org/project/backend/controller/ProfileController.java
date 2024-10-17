package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.PasswordCheckRequestDto;
import org.project.backend.dto.ProfileDto;
import org.project.backend.model.Member;
import org.project.backend.repository.MemberRepository;
import org.project.backend.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@Api(tags = "Profile API", description = "프로필 관리 API")
public class ProfileController {

    private final ProfileService profileService;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    // (1) 로그인한 사용자 기준으로 프로필 정보 조회 (없으면 자동 생성)
    @ApiOperation(value = "로그인한 사용자의 프로필 정보 조회 및 자동 생성", notes = "로그인한 사용자의 고유 프로필 정보를 조회하고, 없으면 자동으로 생성합니다.")
    @GetMapping("/get")
    public ResponseEntity<ProfileDto> getOrCreateProfileForLoggedInUser() {
        try {
            ProfileDto profileDto = profileService.getProfileByLoggedInUser();
            return ResponseEntity.ok(profileDto);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // (2) 로그인한 사용자 기준으로 프로필 업데이트
    @ApiOperation(value = "로그인한 사용자의 프로필 업데이트", notes = "로그인한 사용자의 고유 프로필 정보를 업데이트합니다.")
    @PutMapping("/update")
    public ResponseEntity<ProfileDto> updateProfileForLoggedInUser(@RequestBody ProfileDto profileDto) {
        try {
            ProfileDto updatedProfile = profileService.updateProfileForLoggedInUser(profileDto);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // (3) 로그인한 사용자 기준으로 비밀번호 확인
    @ApiOperation(value = "로그인한 사용자의 비밀번호 확인", notes = "로그인한 사용자의 비밀번호를 확인합니다.")
    @PostMapping("/check-password")
    public ResponseEntity<Boolean> checkPassword(
            @ApiParam(value = "비밀번호 확인 요청", required = true)
            @RequestBody PasswordCheckRequestDto request) {
        try {
            String password = request.getPassword();
            if (password == null || password.isEmpty()) {
                return ResponseEntity.badRequest().body(false);
            }

            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Member member = memberRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            boolean isMatch = passwordEncoder.matches(password, member.getPassword());
            return ResponseEntity.ok(isMatch);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(false);
        }
    }
}
