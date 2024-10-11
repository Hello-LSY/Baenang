package org.project.backend.repository;

import org.project.backend.model.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {
    List<ExchangeRate> findByCurrencyCode(String currencyCode);
    List<ExchangeRate> findByRecordedAtBetween(LocalDateTime start, LocalDateTime end);
    Optional<ExchangeRate> findByCurrencyCodeAndRecordedAt(String currencyCode, LocalDateTime recordedAt);
}