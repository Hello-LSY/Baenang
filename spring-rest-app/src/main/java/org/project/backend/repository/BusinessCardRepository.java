package org.project.backend.repository;

import org.project.backend.model.BusinessCard;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BusinessCardRepository extends JpaRepository<BusinessCard, String > {
    Optional<BusinessCard> findByMember_Id(Long memberId);
}
