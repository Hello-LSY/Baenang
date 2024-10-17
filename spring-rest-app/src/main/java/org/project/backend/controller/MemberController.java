package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.MemberDTO;
import org.project.backend.model.Member;
import org.project.backend.service.MemberServiceImpl;
import org.project.backend.exception.member.GeneralMemberNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
@Api(tags = "Member API", description = "회원 관리 API") // Swagger 컨트롤러 설명
public class MemberController {

    private final MemberServiceImpl memberServiceImpl;

    @ApiOperation(value = "모든 회원 정보 조회", notes = "모든 회원의 정보를 조회합니다.")
    @GetMapping(produces = "application/json")
    public ResponseEntity<List<MemberDTO>> getAllMembers() {
        List<MemberDTO> members = memberServiceImpl.getAllMembers();
        return ResponseEntity.ok(members);  // 성공적으로 조회된 데이터를 반환
    }

    @ApiOperation(value = "회원 ID로 회원 정보 조회", notes = "특정 회원 ID로 회원 정보를 조회합니다.")
    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<MemberDTO> getMemberById(
            @ApiParam(value = "회원 ID", required = true, example = "123")
            @PathVariable Long id) {
        try {
            MemberDTO member = memberServiceImpl.getMemberById(id);
            return ResponseEntity.ok(member);  // 성공적으로 조회된 회원 정보를 반환
        } catch (GeneralMemberNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 회원을 찾지 못했을 때 404 반환
        }
    }

    @ApiOperation(value = "새로운 회원 생성", notes = "새로운 회원을 생성합니다.")
    @PostMapping(produces = "application/json", consumes = "application/json")
    public ResponseEntity<Member> createMember(
            @ApiParam(value = "생성할 회원 정보", required = true)
            @Valid @RequestBody MemberDTO memberDTO) {
        try {
            Member createdMember = memberServiceImpl.createMember(memberDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMember);  // 회원 생성 후 201 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);  // 오류 발생 시 500 반환
        }
    }

    @ApiOperation(value = "회원 정보 업데이트", notes = "회원 ID를 사용하여 기존 회원 정보를 업데이트합니다.")
    @PutMapping(value = "/{id}", produces = "application/json", consumes = "application/json")
    public ResponseEntity<MemberDTO> updateMember(
            @ApiParam(value = "회원 ID", required = true, example = "123")
            @PathVariable Long id,
            @ApiParam(value = "업데이트할 회원 정보", required = true, example = "1")
            @Valid @RequestBody MemberDTO memberDetails) {
        try {
            MemberDTO updatedMember = memberServiceImpl.updateMember(id, memberDetails);
            return ResponseEntity.ok(updatedMember);  // 성공적으로 업데이트된 정보를 반환
        } catch (GeneralMemberNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 회원을 찾지 못했을 때 404 반환
        }
    }

    @ApiOperation(value = "아이디 중복 체크", notes = "입력된 아이디의 중복 여부를 확인합니다.")
    @GetMapping("/check-username")
    public ResponseEntity<Boolean> checkUsernameDuplicate(
            @ApiParam(value = "중복 체크할 아이디", required = true)
            @RequestParam String username) {
        boolean exists = memberServiceImpl.existsByUsername(username);
        return ResponseEntity.ok(exists);
    }

    @ApiOperation(value = "닉네임 중복 체크", notes = "입력된 닉네임의 중복 여부를 확인합니다.")
    @GetMapping("/check-nickname")
    public ResponseEntity<Boolean> checkNicknameDuplicate(
            @ApiParam(value = "중복 체크할 닉네임", required = true)
            @RequestParam String nickname) {
        boolean exists = memberServiceImpl.existsByNickname(nickname);
        return ResponseEntity.ok(exists);
    }

    @ApiOperation(value = "이메일 중복 체크", notes = "이메일 중복 여부를 체크합니다.")
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        boolean exists = memberServiceImpl.existsByEmail(email);
        return ResponseEntity.ok(exists);
    }

    @ApiOperation(value = "회원 삭제", notes = "회원 ID를 사용하여 특정 회원을 삭제합니다.")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMember(
            @ApiParam(value = "회원 ID", required = true, example = "123")
            @PathVariable Long id) {
        try {
            memberServiceImpl.deleteMember(id);
            return ResponseEntity.noContent().build();  // 회원 삭제 후 204 반환
        } catch (GeneralMemberNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member not found");  // 회원을 찾지 못했을 때 404 반환
        }
    }
}
