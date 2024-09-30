package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.BusinessCardDTO;
import org.project.backend.exception.businessCard.BusinessCardNotFoundException;
import org.project.backend.exception.businessCard.BusinessCardMemberNotFoundException;
import org.project.backend.model.BusinessCard;
import org.project.backend.model.Member;
import org.project.backend.repository.BusinessCardRepository;
import org.project.backend.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
@Service
@RequiredArgsConstructor
public class BusinessCardServiceImpl implements BusinessCardService {

    private final BusinessCardRepository businessCardRepository;
    private final MemberRepository memberRepository;

    @Override
    public BusinessCardDTO getBusinessCardByMemberId(Long memberId) {
        BusinessCard businessCard = businessCardRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new BusinessCardNotFoundException("BusinessCard not found for member ID: " + memberId));
        return convertToDTO(businessCard);
    }

    @Override
    public BusinessCardDTO getBusinessCardById(String cardId) {
        BusinessCard businessCard = businessCardRepository.findById(cardId)
                .orElseThrow(() -> new BusinessCardNotFoundException("BusinessCard not found with ID: " + cardId));
        return convertToDTO(businessCard);
    }

    @Override
    public BusinessCardDTO createBusinessCard(Long memberId, BusinessCardDTO businessCardDTO) throws Exception {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessCardMemberNotFoundException("Member not found with ID: " + memberId));

        if (businessCardRepository.findByMember_Id(memberId).isPresent()) {
            throw new RuntimeException("Member already has a business card");
        }

        String cardId = UUID.randomUUID().toString();

        BusinessCard businessCard = BusinessCard.builder()
                .cardId(cardId)
                .member(member)
                .name(businessCardDTO.getName())
                .country(businessCardDTO.getCountry())
                .email(businessCardDTO.getEmail())
                .sns(businessCardDTO.getSns())
                .introduction(businessCardDTO.getIntroduction())
                .imageUrl(businessCardDTO.getImageUrl()) // 프론트엔드에서 전달된 이미지 URL
                .build();

        BusinessCard savedBusinessCard = businessCardRepository.save(businessCard);
        return convertToDTO(savedBusinessCard);
    }

    @Override
    public BusinessCardDTO updateBusinessCard(String cardId, BusinessCardDTO businessCardDTO) throws Exception {
        BusinessCard businessCard = businessCardRepository.findById(cardId)
                .orElseThrow(() -> new BusinessCardNotFoundException("BusinessCard not found with ID: " + cardId));

        // 기존 엔티티를 업데이트하기 위해 새로운 엔티티를 빌더 패턴으로 생성
        BusinessCard updatedBusinessCard = businessCard.toBuilder()
                .name(businessCardDTO.getName())
                .country(businessCardDTO.getCountry())
                .email(businessCardDTO.getEmail())
                .sns(businessCardDTO.getSns())
                .introduction(businessCardDTO.getIntroduction())
                .imageUrl(businessCardDTO.getImageUrl())  // 새로운 이미지 URL 갱신
                .build();

        businessCardRepository.save(updatedBusinessCard);
        return convertToDTO(updatedBusinessCard);
    }

    // DTO 변환 메서드
    private BusinessCardDTO convertToDTO(BusinessCard businessCard) {
        return BusinessCardDTO.builder()
                .cardId(businessCard.getCardId())
                .memberId(businessCard.getMember().getId())
                .name(businessCard.getName())
                .country(businessCard.getCountry())
                .email(businessCard.getEmail())
                .sns(businessCard.getSns())
                .introduction(businessCard.getIntroduction())
                .imageUrl(businessCard.getImageUrl()) // 이미지 URL 반환
                .build();
    }
}
