package org.project.backend.repository;

import org.project.backend.model.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, Long> {
    Optional<ExchangeRate> findByCurrencyCode(String currencyCode);
}