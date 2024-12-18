package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.project.backend.service.InquiryService;
import org.project.backend.model.Inquiry;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/inquiries")
@Api(tags = "Chatbot API", description = "챗봇 관련 API")
public class ChatbotController {
    private final InquiryService inquiryService;

    // InquiryService를 생성자 주입 방식으로 주입
    public ChatbotController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @ApiOperation(value = "태그를 기반으로 챗봇 응답을 반환", notes = "태그에 따라 챗봇의 기본 응답을 반환합니다.")
    @GetMapping(value = "/chatbot", produces = "application/json; charset=UTF-8")
    public ResponseEntity<Map<String, String>> chatbot(
            @ApiParam(value = "챗봇 태그", required = true, example = "hello")
            @RequestParam String tag) {
        Map<String, String> response = new HashMap<>();

        if (tag == null  || tag.trim().isEmpty()) {
            response.put("error", "태그 파라미터가 없습니다.");
            return ResponseEntity.badRequest().body(response);
        }

        if ("hello".equals(tag)) {
            response.put("message", "안녕하세요! 무엇을 도와드릴까요?");
            return ResponseEntity.ok(response);
        } else if ("help".equals(tag)) {
            response.put("message", "어떻게 도와드릴까요?");
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "다른 질문을 해 주세요!");
            return ResponseEntity.badRequest().body(response);
        }
    }
@ApiOperation(value = "모든 문의 조회", notes = "모든 사용자의 문의 정보를 반환합니다.")
    @GetMapping(produces = "application/json; charset=UTF-8")
    public ResponseEntity<List<Inquiry>> getAllInquiries() {
        List<Inquiry> inquiries = inquiryService.getAllInquiries();
        return ResponseEntity.ok(inquiries);
    }
}