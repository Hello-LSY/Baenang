package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.web.bind.annotation.*;
import org.project.backend.service.InquiryService;
import org.project.backend.model.Inquiry;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
@Api(tags = "문의 API", description = "문의 관리 API")
public class InquiryController {


    private final InquiryService inquiryService;

    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping
    public ResponseEntity<Inquiry> createInquiry(@RequestBody Inquiry inquiry) {
        Inquiry createdInquiry = inquiryService.createInquiry(inquiry);
        return ResponseEntity.ok(createdInquiry);
    }

    @ApiOperation(value = "모든 문의 조회", notes = "모든 문의를 조회합니다.")
    @GetMapping
    public ResponseEntity<List<Inquiry>> getAllInquiries() {
        List<Inquiry> inquiries = inquiryService.getAllInquiries();
        System.out.println("Inquiries: " + inquiries);
        return ResponseEntity.ok(inquiries);
    }

    @ApiOperation(value = "ID로 문의 조회", notes = "특정 ID로 문의를 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<Inquiry> getInquiryById(@PathVariable Long id) {
        return ResponseEntity.ok(inquiryService.getInquiryById(id));
    }

    @ApiOperation(value = "문의 수정", notes = "특정 ID의 문의 정보를 수정합니다.")
    @PutMapping("/{id}")
    public ResponseEntity<Inquiry> updateInquiry(@PathVariable Long id, @RequestBody Inquiry inquiry) {
        Inquiry updatedInquiry = inquiryService.updateInquiry(id, inquiry);
        return ResponseEntity.ok(updatedInquiry);
    }

    @ApiOperation(value = "문의 삭제", notes = "특정 ID의 문의를 삭제합니다.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInquiry(@PathVariable Long id) {
        inquiryService.deleteInquiry(id);
        return ResponseEntity.noContent().build();
    }
}

