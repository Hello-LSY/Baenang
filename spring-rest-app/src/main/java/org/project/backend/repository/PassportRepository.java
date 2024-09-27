package org.project.backend.repository;

import org.project.backend.model.Document;
import org.project.backend.model.Passport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PassportRepository extends JpaRepository<Passport, Long > {
    Optional<Passport> findByDocument(Document document);
}
