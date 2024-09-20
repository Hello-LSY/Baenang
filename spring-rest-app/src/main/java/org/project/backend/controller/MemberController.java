package org.project.backend.controller;

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
public class MemberController {

    private final MemberServiceImpl memberServiceImpl;

    // 모든 회원 정보를 조회하는 엔드포인트
    @GetMapping(produces = "application/json")
    public ResponseEntity<List<MemberDTO>> getAllMembers() {
        List<MemberDTO> members = memberServiceImpl.getAllMembers();
        return ResponseEntity.ok(members);  // 성공적으로 조회된 데이터를 반환
    }

    // 특정 ID로 회원 정보를 조회하는 엔드포인트
    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<MemberDTO> getMemberById(@PathVariable Long id) {
        try {
            MemberDTO member = memberServiceImpl.getMemberById(id);
            return ResponseEntity.ok(member);  // 성공적으로 조회된 회원 정보를 반환
        } catch (GeneralMemberNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 회원을 찾지 못했을 때 404 반환
        }
    }

    // 새로운 회원을 생성하는 엔드포인트
    @PostMapping(produces = "application/json", consumes = "application/json")
    public ResponseEntity<Member> createMember(@Valid @RequestBody MemberDTO memberDTO) {
        try {
            Member createdMember = memberServiceImpl.createMember(memberDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMember);  // 회원 생성 후 201 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);  // 오류 발생 시 500 반환
        }
    }

    // 기존 회원 정보를 업데이트하는 엔드포인트
    @PutMapping(value = "/{id}", produces = "application/json", consumes = "application/json")
    public ResponseEntity<MemberDTO> updateMember(@PathVariable Long id, @Valid @RequestBody MemberDTO memberDetails) {
        try {
            MemberDTO updatedMember = memberServiceImpl.updateMember(id, memberDetails);
            return ResponseEntity.ok(updatedMember);  // 성공적으로 업데이트된 정보를 반환
        } catch (GeneralMemberNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 회원을 찾지 못했을 때 404 반환
        }
    }

    // 회원 정보를 삭제하는 엔드포인트
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMember(@PathVariable Long id) {
        try {
            memberServiceImpl.deleteMember(id);
            return ResponseEntity.noContent().build();  // 회원 삭제 후 204 반환
        } catch (GeneralMemberNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Member not found");  // 회원을 찾지 못했을 때 404 반환
        }
    }
}
