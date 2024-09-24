package org.project.backend.repository;

import org.project.backend.model.SavedBusinessCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedBusinessCardRepository extends JpaRepository<SavedBusinessCard, Long> {

    // BusinessCardId로 SavedBusinessCard 조회
    List<SavedBusinessCard> findByBusinessCardId(String businessCardId);

    // 특정 Member와 BusinessCardId에 해당하는 SavedBusinessCard 조회
    Optional<SavedBusinessCard> findByMember_IdAndBusinessCardId(Long memberId, String businessCardId);

    // 특정 회원의 저장된 명함 목록 조회
    List<SavedBusinessCard> findByMember_Id(Long memberId);
}
