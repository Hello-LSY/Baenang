package org.project.backend.repository;

import org.project.backend.model.BusinessCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusinessCardRepository extends JpaRepository<BusinessCard, Long> {
    Optional<BusinessCard> findByMember_Id(Long memberId);
}
