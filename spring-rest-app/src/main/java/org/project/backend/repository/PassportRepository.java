package org.project.backend.repository;

import org.project.backend.model.Passport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PassportRepository extends JpaRepository<Passport, Long > {
}
