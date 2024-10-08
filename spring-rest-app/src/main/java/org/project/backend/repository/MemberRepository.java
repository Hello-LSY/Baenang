package org.project.backend.repository;

import org.project.backend.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByUsername(String username);  // 사용자 이름으로 회원 찾기
    boolean existsByUsername(String username); // 이름이 중복되는지 확인
    Optional<Member> findByFullNameAndRegistrationNumber(String name, String registrationNumber);  // 이름과 주민등록번호로 회원 찾기
}
