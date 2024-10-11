package org.project.backend.repository;

import org.project.backend.model.Profile;
import org.project.backend.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {

    // 로그인한 사용자(Member) 기준으로 프로필을 조회하는 메서드
    Optional<Profile> findByMember(Member member);
}
