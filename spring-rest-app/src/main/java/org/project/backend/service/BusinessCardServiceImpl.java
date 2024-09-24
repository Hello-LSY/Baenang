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

import javax.transaction.Transactional;

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

        String cardId = java.util.UUID.randomUUID().toString();

        BusinessCard businessCard = convertToEntity(businessCardDTO)
                .toBuilder()
                .cardId(cardId)
                .member(member)
                .build();

        BusinessCard savedBusinessCard = businessCardRepository.save(businessCard);
        return convertToDTO(savedBusinessCard);
    }

    @Override
    public BusinessCardDTO updateBusinessCard(String cardId, BusinessCardDTO businessCardDTO) {
        BusinessCard businessCard = businessCardRepository.findById(cardId)
                .orElseThrow(() -> new BusinessCardNotFoundException("BusinessCard not found with ID: " + cardId));

        businessCard.update(
                businessCardDTO.getName(),
                businessCardDTO.getCountry(),
                businessCardDTO.getEmail(),
                businessCardDTO.getSns(),
                businessCardDTO.getIntroduction()
        );

        BusinessCard updatedBusinessCard = businessCardRepository.save(businessCard);
        return convertToDTO(updatedBusinessCard);
    }

    @Transactional
    @Override
    public void deleteBusinessCard(String cardId) {
        BusinessCard businessCard = businessCardRepository.findById(cardId)
                .orElseThrow(() -> new BusinessCardNotFoundException("BusinessCard not found with ID: " + cardId));

        // Member에서 연관 관계 해제 메서드 호출
        Member member = businessCard.getMember();
        if (member != null) {
            member.removeBusinessCard(); // Member에서 연관관계 해제
            memberRepository.save(member); // 변경 사항 저장
        }

        // BusinessCard 삭제
        businessCardRepository.delete(businessCard); // DB에서 BusinessCard 완전히 삭제
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
                .build();
    }

    // 엔티티 변환 메서드
    private BusinessCard convertToEntity(BusinessCardDTO dto) {
        return BusinessCard.builder()
                .cardId(dto.getCardId())
                .name(dto.getName())
                .country(dto.getCountry())
                .email(dto.getEmail())
                .sns(dto.getSns())
                .introduction(dto.getIntroduction())
                .build();
    }
}