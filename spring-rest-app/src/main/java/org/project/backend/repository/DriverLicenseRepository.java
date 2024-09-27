package org.project.backend.repository;

import org.project.backend.model.Document;
import org.project.backend.model.DriverLicense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverLicenseRepository extends JpaRepository<DriverLicense, Long > {
    Optional<DriverLicense> findByDocument(Document document);
}
