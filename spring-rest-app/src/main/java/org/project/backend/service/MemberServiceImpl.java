package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.MemberDTO;
import org.project.backend.exception.member.InvalidMemberDataException;
import org.project.backend.exception.member.MemberNotFoundException;
import org.project.backend.model.Member;
import org.project.backend.repository.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<MemberDTO> getAllMembers() {
        List<Member> members = memberRepository.findAll();
        List<MemberDTO> memberDTOs = new ArrayList<>();
        for (Member member : members) {
            memberDTOs.add(convertToDTO(member));
        }
        return memberDTOs;
    }

    @Override
    public Member findByUsername(String username) {
        return memberRepository.findByUsername(username)
                .orElseThrow(() -> new MemberNotFoundException("Member not found with username: " + username));
    }

    @Override
    public MemberDTO getMemberById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member with id " + id + " not found"));
        return convertToDTO(member);
    }

    @Override
    public Member createMember(MemberDTO memberDTO) {
        if (memberDTO == null || memberDTO.getUsername() == null) {
            throw new InvalidMemberDataException("Invalid Member Data");
        }

        if (memberRepository.existsByUsername(memberDTO.getUsername())) {
            throw new InvalidMemberDataException("Member with the same name already exists");
        }

        // 비밀번호 암호화 후 저장
        memberDTO.setPassword(passwordEncoder.encode(memberDTO.getPassword()));
        Member member = convertToEntity(memberDTO);
        return memberRepository.save(member);
    }

    @Override
    public MemberDTO updateMember(Long id, MemberDTO memberDetails) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member with id " + id + " not found"));

        // 이름 업데이트
        member = member.toBuilder()
                .username(memberDetails.getUsername())
                .build();

        // 비밀번호가 있을 경우, 암호화하여 업데이트
        if (memberDetails.getPassword() != null && !memberDetails.getPassword().isEmpty()) {
            member = member.toBuilder()
                    .password(passwordEncoder.encode(memberDetails.getPassword()))
                    .build();
        }

        return convertToDTO(memberRepository.save(member));
    }

    @Override
    public void deleteMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new MemberNotFoundException("Member with id " + id + " not found"));
        memberRepository.deleteById(id);
    }

    // 엔티티를 DTO로 변환
    private MemberDTO convertToDTO(Member member) {
        MemberDTO dto = new MemberDTO();
        dto.setId(member.getId());
        dto.setUsername(member.getUsername());
        return dto;
    }

    // DTO를 엔티티로 변환
    private Member convertToEntity(MemberDTO dto) {
        return Member.builder()
                .username(dto.getUsername())
                .password(dto.getPassword()) // 암호화된 비밀번호를 그대로 사용
                .build();
    }
}
