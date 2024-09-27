package org.project.backend.repository;

import org.project.backend.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long > {
    Optional<Document> findByMember_Id(Long memberId);

    @Query("SELECT d FROM Document d LEFT JOIN FETCH d.DLN LEFT JOIN FETCH d.RRN LEFT JOIN FETCH d.PN LEFT JOIN FETCH d.ISIC WHERE d.member.id = :memberId")
    Optional<Document> findDocumentWithAllDetails(@Param("memberId") Long memberId);
}
