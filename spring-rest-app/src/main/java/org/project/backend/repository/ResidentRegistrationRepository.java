package org.project.backend.repository;

import org.project.backend.model.ResidentRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResidentRegistrationRepository extends JpaRepository<ResidentRegistration, Long > {
}
