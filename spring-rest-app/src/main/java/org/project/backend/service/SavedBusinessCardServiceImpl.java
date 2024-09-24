package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.BusinessCardDTO;
import org.project.backend.dto.SavedBusinessCardDTO;
import org.project.backend.model.BusinessCard;
import org.project.backend.model.Member;
import org.project.backend.model.SavedBusinessCard;
import org.project.backend.repository.BusinessCardRepository;
import org.project.backend.repository.MemberRepository;
import org.project.backend.repository.SavedBusinessCardRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class SavedBusinessCardServiceImpl implements SavedBusinessCardService {

    private final SavedBusinessCardRepository savedBusinessCardRepository;
    private final BusinessCardRepository businessCardRepository;
    private final MemberRepository memberRepository;

    @Override
    public SavedBusinessCardDTO saveBusinessCard(Long memberId, String businessCardId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + memberId));

        BusinessCard businessCard = businessCardRepository.findById(businessCardId)
                .orElseThrow(() -> new RuntimeException("Business Card not found with ID: " + businessCardId));

        if (savedBusinessCardRepository.findByMember_IdAndBusinessCardId(memberId, businessCardId).isPresent()) {
            throw new RuntimeException("Business card already saved.");
        }

        SavedBusinessCard savedBusinessCard = SavedBusinessCard.builder()
                .member(member)
                .businessCardId(businessCardId)
                .build();

        SavedBusinessCard savedCard = savedBusinessCardRepository.save(savedBusinessCard);

        return convertToDTO(savedCard);
    }

    @Override
    public List<SavedBusinessCardDTO> getSavedBusinessCardIds(Long memberId) {
        List<SavedBusinessCardDTO> savedBusinessCardDTOList = new ArrayList<>();
        List<SavedBusinessCard> savedBusinessCards = savedBusinessCardRepository.findByMember_Id(memberId);

        for (SavedBusinessCard savedBusinessCard : savedBusinessCards) {
            SavedBusinessCardDTO dto = convertToDTO(savedBusinessCard);
            savedBusinessCardDTOList.add(dto);
        }

        return savedBusinessCardDTOList;
    }

    @Override
    public List<BusinessCardDTO> getSavedBusinessCards(Long memberId) {
        List<SavedBusinessCardDTO> savedBusinessCardDTOList = getSavedBusinessCardIds(memberId);
        List<BusinessCardDTO> businessCardDTOList = new ArrayList<>();

        for (SavedBusinessCardDTO savedCardDTO : savedBusinessCardDTOList) {
            Optional<BusinessCard> optionalBusinessCard = businessCardRepository.findById(savedCardDTO.getBusinessCardId());
            if (optionalBusinessCard.isPresent()) {
                BusinessCard businessCard = optionalBusinessCard.get();
                BusinessCardDTO businessCardDTO = convertToBusinessCardDTO(businessCard);
                businessCardDTOList.add(businessCardDTO);
            }
        }

        return businessCardDTOList;
    }


    private SavedBusinessCardDTO convertToDTO(SavedBusinessCard savedBusinessCard) {
        return SavedBusinessCardDTO.builder()
                .id(savedBusinessCard.getId())
                .memberId(savedBusinessCard.getMember().getId())
                .businessCardId(savedBusinessCard.getBusinessCardId())
                .build();
    }

    private BusinessCardDTO convertToBusinessCardDTO(BusinessCard businessCard) {
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
}
