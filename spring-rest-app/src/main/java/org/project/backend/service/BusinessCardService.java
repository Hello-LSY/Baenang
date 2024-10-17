package org.project.backend.service;

import org.project.backend.dto.BusinessCardDTO;

public interface BusinessCardService {

    // 회원 ID로 명함 조회
    BusinessCardDTO getBusinessCardByMemberId(Long memberId);

    // 명함 ID로 명함 조회
    BusinessCardDTO getBusinessCardById(String cardId);

    // 명함 생성
    BusinessCardDTO createBusinessCard(Long memberId, BusinessCardDTO businessCardDTO) throws Exception;

    // 명함 수정
    BusinessCardDTO updateBusinessCard(String cardId, BusinessCardDTO businessCardDTO) throws Exception;

}
