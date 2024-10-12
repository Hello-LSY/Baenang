//package org.project.backend.scheduler;
//
//import org.project.backend.service.DocumentService;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//@Component
//public class TokenExpiryScheduler {
//
//    private final DocumentService documentService;
//
//    public TokenExpiryScheduler(DocumentService documentService) {
//        this.documentService = documentService;
//    }
//
//    // 5분마다 실행하는 스케줄러 (고정 속도)
//    @Scheduled(fixedRate = 300000) // 300000밀리초 = 5분
//    public void checkExpiredTokens() {
//        documentService.checkAndExpireDocumentToken();
//    }
//}
