package org.project.backend.repository;

import org.project.backend.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long > {

    // 회원 ID로 Document 검색
    Optional<Document> findByMemberId(Long memberId);

    // 회원 ID로 Document를 검색하며, 모든 세부 정보(문서 ID들)를 포함
    @Query("SELECT d FROM Document d WHERE d.member.id = :memberId")
    Optional<Document> findDocumentWithAllDetails(@Param("memberId") Long memberId);
}
