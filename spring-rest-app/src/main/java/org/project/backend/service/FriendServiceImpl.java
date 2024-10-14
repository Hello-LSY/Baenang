package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.model.BusinessCard;
import org.project.backend.model.Member;
import org.project.backend.model.SavedBusinessCard;
import org.project.backend.repository.BusinessCardRepository;
import org.project.backend.repository.MemberRepository;
import org.project.backend.repository.SavedBusinessCardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendServiceImpl implements FriendService {

    private final SavedBusinessCardRepository savedBusinessCardRepository;
    private final BusinessCardRepository businessCardRepository;
    private final MemberRepository memberRepository;

    @Override
    public void addFriendByBusinessCardId(Long memberId, String businessCardId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        BusinessCard businessCard = businessCardRepository.findById(businessCardId)
                .orElseThrow(() -> new RuntimeException("Business card not found"));

        // 이미 친구로 추가된 명함인지 확인
        if (savedBusinessCardRepository.findByMember_IdAndBusinessCardId(memberId, businessCardId).isPresent()) {
            throw new RuntimeException("This business card is already saved");
        }

        // SavedBusinessCard 빌더를 이용해 엔티티 생성
        SavedBusinessCard savedBusinessCard = SavedBusinessCard.builder()
                .member(member)
                .businessCardId(businessCardId)
                .build();

        // 엔티티 저장
        savedBusinessCardRepository.save(savedBusinessCard);
    }

    @Override
    public List<BusinessCard> getFriendsList(Long memberId) {
        List<SavedBusinessCard> savedBusinessCards = savedBusinessCardRepository.findByMember_Id(memberId);
        return savedBusinessCards.stream()
                .map(savedCard -> businessCardRepository.findById(savedCard.getBusinessCardId())
                        .orElseThrow(() -> new RuntimeException("Business card not found")))
                .collect(Collectors.toList());
    }

    @Override
    public void removeFriendByBusinessCardId(Long memberId, String businessCardId) {
        SavedBusinessCard savedBusinessCard = savedBusinessCardRepository.findByMember_IdAndBusinessCardId(memberId, businessCardId)
                .orElseThrow(() -> new RuntimeException("Friend not found"));

        savedBusinessCardRepository.delete(savedBusinessCard);
    }
}