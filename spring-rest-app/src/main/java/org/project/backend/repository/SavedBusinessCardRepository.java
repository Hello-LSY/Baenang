package org.project.backend.repository;

import org.project.backend.model.SavedBusinessCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedBusinessCardRepository extends JpaRepository<SavedBusinessCard, Long> {
    List<SavedBusinessCard> findByMember_Id(Long memberId);
    Optional<SavedBusinessCard> findByMember_IdAndBusinessCardId(Long memberId, String businessCardId);
}