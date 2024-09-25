package org.project.backend.service;

import org.project.backend.exception.InquiryNotFoundException;
import org.project.backend.repository.InquiryRepository;
import org.project.backend.model.Inquiry;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
public class InquiryService {

    private final InquiryRepository inquiryRepository;

    public InquiryService(InquiryRepository inquiryRepository) {
        this.inquiryRepository = inquiryRepository;
    }

    @Transactional
    public Inquiry createInquiry(Inquiry inquiry) {
        return inquiryRepository.save(inquiry);
    }

    public List<Inquiry> getAllInquiries() {
        return inquiryRepository.findAll();
    }

    public Inquiry getInquiryById(Long id) {
        return inquiryRepository.findById(id).orElseThrow(() -> new RuntimeException("Inquiry not found"));
    }

    @Transactional
    public Inquiry updateInquiry(Long id, Inquiry newInquiry) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquiry not found"));

        // toBuilder() 패턴 사용으로 필드를 수정
        Inquiry updatedInquiry = inquiry.toBuilder()
                .title(newInquiry.getTitle())
                .content(newInquiry.getContent())
                .writer(newInquiry.getWriter())
                .build();

        return inquiryRepository.save(updatedInquiry);
    }

    //예외 처리 추가
    public void deleteInquiry(Long id) {
        if (!inquiryRepository.existsById(id)) {
            throw new InquiryNotFoundException(id);
        }
        inquiryRepository.deleteById(id);
    }
}
