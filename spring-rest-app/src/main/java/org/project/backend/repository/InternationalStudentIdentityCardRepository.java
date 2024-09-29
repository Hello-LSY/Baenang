package org.project.backend.repository;

import org.project.backend.model.Document;
import org.project.backend.model.InternationalStudentIdentityCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InternationalStudentIdentityCardRepository extends JpaRepository<InternationalStudentIdentityCard, Long > {
    Optional<InternationalStudentIdentityCard> findByDocument(Document document);
}
