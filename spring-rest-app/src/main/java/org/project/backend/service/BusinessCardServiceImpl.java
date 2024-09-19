// BusinessCardServiceImpl.java
package org.project.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.BusinessCardDTO;
import org.project.backend.model.BusinessCard;
import org.project.backend.model.Member;
import org.project.backend.repository.BusinessCardRepository;
import org.project.backend.repository.MemberRepository;
import org.project.backend.service.BusinessCardService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BusinessCardServiceImpl implements BusinessCardService {

    private final BusinessCardRepository businessCardRepository;
    private final MemberRepository memberRepository;

    @Override
    public BusinessCardDTO getBusinessCardByMemberId(Long memberId) {
        BusinessCard businessCard = businessCardRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new RuntimeException("BusinessCard not found"));
        return convertToDTO(businessCard);
    }

    @Override
    public BusinessCardDTO getBusinessCardById(Long cardId) {
        BusinessCard businessCard = businessCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("BusinessCard not found"));
        return convertToDTO(businessCard);
    }

    @Override
    public BusinessCardDTO createBusinessCard(Long memberId, BusinessCardDTO businessCardDTO) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (businessCardRepository.findByMember_Id(memberId).isPresent()) {
            throw new RuntimeException("Member already has a business card");
        }

        BusinessCard businessCard = convertToEntity(businessCardDTO);
        businessCard.setMember(member);
        BusinessCard savedBusinessCard = businessCardRepository.save(businessCard);
        return convertToDTO(savedBusinessCard);
    }

    @Override
    public BusinessCardDTO updateBusinessCard(Long cardId, BusinessCardDTO businessCardDTO) {
        BusinessCard businessCard = businessCardRepository.findById(cardId)
                .orElseThrow(() -> new RuntimeException("BusinessCard not found"));
        businessCard.setName(businessCardDTO.getName());
        businessCard.setCountry(businessCardDTO.getCountry());
        businessCard.setEmail(businessCardDTO.getEmail());
        businessCard.setSns(businessCardDTO.getSns());
        businessCard.setIntroduction(businessCardDTO.getIntroduction());
        businessCard.setQr(businessCardDTO.getQr());
        BusinessCard updatedBusinessCard = businessCardRepository.save(businessCard);
        return convertToDTO(updatedBusinessCard);
    }

    @Override
    public void deleteBusinessCard(Long cardId) {
        businessCardRepository.deleteById(cardId);
    }

    // BusinessCard 엔티티를 BusinessCardDTO로 변환
    private BusinessCardDTO convertToDTO(BusinessCard businessCard) {
        BusinessCardDTO dto = new BusinessCardDTO();
        dto.setCardId(businessCard.getCardId());
        dto.setMemberId(businessCard.getMember().getId()); // 엔티티의 Member 참조를 이용해 MemberID 설정
        dto.setName(businessCard.getName());
        dto.setCountry(businessCard.getCountry());
        dto.setEmail(businessCard.getEmail());
        dto.setSns(businessCard.getSns());
        dto.setIntroduction(businessCard.getIntroduction());
        dto.setQr(businessCard.getQr());
        return dto;
    }

    // BusinessCardDTO를 BusinessCard 엔티티로 변환
    private BusinessCard convertToEntity(BusinessCardDTO dto) {
        BusinessCard businessCard = new BusinessCard();
        businessCard.setCardId(dto.getCardId());
        businessCard.setName(dto.getName());
        businessCard.setCountry(dto.getCountry());
        businessCard.setEmail(dto.getEmail());
        businessCard.setSns(dto.getSns());
        businessCard.setIntroduction(dto.getIntroduction());
        businessCard.setQr(dto.getQr());
        return businessCard;
    }
}
