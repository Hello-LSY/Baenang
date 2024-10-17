package org.project.backend.repository;

import org.project.backend.model.Document;
import org.project.backend.model.Passport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

public interface PassportRepository extends JpaRepository<Passport, Long > {
    Optional<Passport> findByDocument(Document document);

    // 새로운 RRN(주민등록번호)로 검색하는 메서드 추가
    Optional<Passport> findByRrn(String rrn);

    // 새로운 PN(여권번호)로 검색하는 메서드 추가
    Optional<Passport> findByPn(String pn);

}
