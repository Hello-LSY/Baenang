// BusinessCardService.java
package org.project.backend.service;

import org.project.backend.dto.BusinessCardDTO;

public interface BusinessCardService {
    BusinessCardDTO getBusinessCardByMemberId(Long memberId);
    BusinessCardDTO getBusinessCardById(Long cardId);
    BusinessCardDTO createBusinessCard(Long memberId, BusinessCardDTO businessCardDTO);
    BusinessCardDTO updateBusinessCard(Long cardId, BusinessCardDTO businessCardDTO);
    void deleteBusinessCard(Long cardId);
}
