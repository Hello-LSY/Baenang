package org.project.backend.scheduler;

import lombok.RequiredArgsConstructor;
import org.project.backend.service.ExchangeRateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ExchangeRateScheduler {

    private static final Logger logger = LoggerFactory.getLogger(ExchangeRateScheduler.class);
    private final ExchangeRateService exchangeRateService;

    // 매일 오전 11시 5분에 실행되는 스케줄러
    @Scheduled(cron = "0 5 11 * * ?")
    public void updateDailyExchangeRates() {
        try {
            // 오늘 날짜를 yyyyMMdd 형식으로 가져오기
            String todayDate = java.time.LocalDate.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd"));

            // 'AP01'은 API 데이터 타입에 맞게 변경 필요
            exchangeRateService.saveExchangeRates(todayDate, "AP01");

            logger.info("Successfully updated exchange rates for date: {}", todayDate);
        } catch (Exception e) {
            logger.error("Failed to update exchange rates: {}", e.getMessage(), e);
        }
    }
}
