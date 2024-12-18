package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.MemberDTO;
import org.project.backend.exception.member.InvalidMemberDataException;
import org.project.backend.exception.member.GeneralMemberNotFoundException;
import org.project.backend.model.Member;
import org.project.backend.repository.MemberRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<MemberDTO> getAllMembers() {
        return memberRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Member findByUsername(String username) {
        return memberRepository.findByUsername(username)
                .orElseThrow(() -> new GeneralMemberNotFoundException("Member not found with username: " + username));
    }

    @Override
    public MemberDTO getMemberById(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new GeneralMemberNotFoundException("Member with id " + id + " not found"));
        return convertToDTO(member);
    }

    @Override
    public Member createMember(MemberDTO memberDTO) {
        validateMemberData(memberDTO);

        if (memberRepository.existsByEmail(memberDTO.getEmail())) {
            throw new InvalidMemberDataException("등록된 이메일이 존재합니다.");
        }
        // 비밀번호 암호화
        memberDTO.setPassword(passwordEncoder.encode(memberDTO.getPassword()));
        Member member = convertToEntity(memberDTO);
        return memberRepository.save(member);
    }

    @Override
    public MemberDTO updateMember(Long id, MemberDTO memberDetails) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new GeneralMemberNotFoundException("Member with id " + id + " not found"));

        // Builder 패턴을 통해 엔티티의 상태를 변경
        member = member.toBuilder()
                .username(memberDetails.getUsername())
                .fullName(memberDetails.getFullName())
                .nickname(memberDetails.getNickname())
                .gender(memberDetails.getGender())
                .password(memberDetails.getPassword() != null && !memberDetails.getPassword().isEmpty() ?
                        passwordEncoder.encode(memberDetails.getPassword()) : member.getPassword())
                .build();

        return convertToDTO(memberRepository.save(member));
    }

    @Override
    public void deleteMember(Long id) {
        Member member = memberRepository.findById(id)
                .orElseThrow(() -> new GeneralMemberNotFoundException("Member with id " + id + " not found"));
        memberRepository.deleteById(id);
    }

    private void validateMemberData(MemberDTO memberDTO) {
        if (memberDTO == null || memberDTO.getUsername() == null) {
            throw new InvalidMemberDataException("Invalid Member Data");
        }

        if (memberRepository.existsByUsername(memberDTO.getUsername())) {
            throw new InvalidMemberDataException("Member with the same username already exists");
        }
    }

    public boolean existsByUsername(String username) {
        return memberRepository.existsByUsername(username);
    }

    public boolean existsByNickname(String nickname) {
        return memberRepository.existsByNickname(nickname);
    }

    public boolean existsByEmail(String email) {
        return memberRepository.existsByEmail(email);
    }


    private MemberDTO convertToDTO(Member member) {
        return MemberDTO.builder()
                .id(member.getId())
                .username(member.getUsername())
                .fullName(member.getFullName())
                .nickname(member.getNickname())
                .gender(member.getGender())
                .build();
    }

    private Member convertToEntity(MemberDTO dto) {
        return Member.builder()
                .username(dto.getUsername())
                .password(dto.getPassword()) // 암호화된 비밀번호를 그대로 사용
                .fullName(dto.getFullName())
                .nickname(dto.getNickname())
                .gender(dto.getGender())
                .birthdate(dto.getBirthdate())
                .email(dto.getEmail())
                .registrationNumber(dto.getRegistrationNumber())
                .build();
    }
}
