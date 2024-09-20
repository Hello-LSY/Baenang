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
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class BusinessCardServiceImpl implements BusinessCardService {

    private final BusinessCardRepository businessCardRepository;
    private final MemberRepository memberRepository;
    private final QRCodeGenerator qrCodeGenerator;

    @Override
    public BusinessCardDTO getBusinessCardByMemberId(Long memberId) {
        BusinessCard businessCard = businessCardRepository.findByMember_Id(memberId)
                .orElseThrow(() -> new BusinessCardNotFoundException("BusinessCard not found for member ID: " + memberId));
        return convertToDTO(businessCard);
    }

    @Override
    public BusinessCardDTO getBusinessCardById(String cardId) {  // String 타입으로 변경
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

        // UUID로 cardId 생성 및 QR 코드 파일 이름 미리 생성
        String cardId = java.util.UUID.randomUUID().toString();
        String qrFileName = "qr_" + cardId + ".png";

        // BusinessCard 엔티티 생성
        BusinessCard businessCard = convertToEntity(businessCardDTO)
                .toBuilder()
                .cardId(cardId)  // 생성된 UUID를 cardId로 설정
                .qr(qrFileName)  // QR 파일명을 미리 설정
                .member(member)
                .build();

        // BusinessCard를 DB에 저장
        BusinessCard savedBusinessCard = businessCardRepository.save(businessCard);

        // QR 코드에 넣을 텍스트 생성
        String qrText = generateQRCodeText(savedBusinessCard);

        // QR 코드 생성 및 파일 경로 저장
        try {
            qrCodeGenerator.generateQRCode(qrText, qrFileName); // QR 코드 생성
        } catch (Exception e) {
            throw new RuntimeException("QR 코드 생성에 실패했습니다: " + e.getMessage());
        }

        return convertToDTO(savedBusinessCard);
    }



    @Override
    public BusinessCardDTO updateBusinessCard(String cardId, BusinessCardDTO businessCardDTO) {  // String 타입으로 변경
        BusinessCard businessCard = businessCardRepository.findById(cardId)
                .orElseThrow(() -> new BusinessCardNotFoundException("BusinessCard not found with ID: " + cardId));

        // update 메서드를 통해 상태 변경
        businessCard.update(
                businessCardDTO.getName(),
                businessCardDTO.getCountry(),
                businessCardDTO.getEmail(),
                businessCardDTO.getSns(),
                businessCardDTO.getIntroduction(),
                businessCardDTO.getQr()
        );

        BusinessCard updatedBusinessCard = businessCardRepository.save(businessCard);
        return convertToDTO(updatedBusinessCard);
    }

    @Override
    public void deleteBusinessCard(String cardId) {  // String 타입으로 변경
        if (!businessCardRepository.existsById(cardId)) {
            throw new BusinessCardNotFoundException("BusinessCard not found with ID: " + cardId);
        }
        businessCardRepository.deleteById(cardId);
    }

    // QR 코드에 넣을 텍스트 생성
    private String generateQRCodeText(BusinessCard businessCard) {
        try {
            // JSON 형식의 명함 정보 생성
            ObjectMapper objectMapper = new ObjectMapper();
            BusinessCardDTO businessCardDTO = convertToDTO(businessCard);
            return objectMapper.writeValueAsString(businessCardDTO);
        } catch (Exception e) {
            throw new RuntimeException("QR process error: " + e.getMessage());
        }
    }

    private BusinessCardDTO convertToDTO(BusinessCard businessCard) {
        return BusinessCardDTO.builder()
                .cardId(businessCard.getCardId())  // String 타입
                .memberId(businessCard.getMember().getId())
                .name(businessCard.getName())
                .country(businessCard.getCountry())
                .email(businessCard.getEmail())
                .sns(businessCard.getSns())
                .introduction(businessCard.getIntroduction())
                .qr(businessCard.getQr())
                .build();
    }

    private BusinessCard convertToEntity(BusinessCardDTO dto) {
        return BusinessCard.builder()
                .cardId(dto.getCardId())  // String 타입
                .name(dto.getName())
                .country(dto.getCountry())
                .email(dto.getEmail())
                .sns(dto.getSns())
                .introduction(dto.getIntroduction())
                .qr(dto.getQr())
                .build();
    }
}
