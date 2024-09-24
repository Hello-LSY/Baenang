package org.project.backend.repository;

import org.project.backend.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DocumentRepository extends JpaRepository<Document, Long > {
    Optional<Document> findByMember_Id(Long memberId);
}
