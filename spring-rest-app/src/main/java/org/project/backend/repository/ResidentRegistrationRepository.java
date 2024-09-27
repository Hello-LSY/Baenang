package org.project.backend.repository;

import org.project.backend.model.Document;
import org.project.backend.model.ResidentRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResidentRegistrationRepository extends JpaRepository<ResidentRegistration, Long > {
    Optional<ResidentRegistration> findByDocument(Document document);
}
