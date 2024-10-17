package org.project.backend.repository;

import org.project.backend.model.Document;
import org.project.backend.model.ResidentRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResidentRegistrationRepository extends JpaRepository<ResidentRegistration, Long > {
    Optional<ResidentRegistration> findByDocument(Document document);

    // 새로운 RRN(주민등록번호)로 검색하는 메서드 추가
    Optional<ResidentRegistration> findByRrn(String rrn);

}
