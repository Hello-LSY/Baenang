package org.project.backend.repository;

import org.project.backend.model.Travelcertificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelcertificateRepository extends JpaRepository<Travelcertificate, Long> {
    List<Travelcertificate> findByUsername(String username);
}
