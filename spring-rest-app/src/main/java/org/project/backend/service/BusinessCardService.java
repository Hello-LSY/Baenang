// BusinessCardService.java
package org.project.backend.service;

import org.project.backend.dto.BusinessCardDTO;

import javax.crypto.SecretKey;

public interface BusinessCardService {
    BusinessCardDTO getBusinessCardByMemberId(Long memberId);
    BusinessCardDTO getBusinessCardById(String cardId);
    BusinessCardDTO createBusinessCard(Long memberId, BusinessCardDTO businessCardDTO) throws Exception;
    BusinessCardDTO updateBusinessCard(String cardId, BusinessCardDTO businessCardDTO);
    void deleteBusinessCard(String cardId);

}
