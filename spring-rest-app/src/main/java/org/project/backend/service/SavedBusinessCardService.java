package org.project.backend.service;

import org.project.backend.dto.BusinessCardDTO;
import org.project.backend.dto.SavedBusinessCardDTO;

import java.util.List;

public interface SavedBusinessCardService {
    SavedBusinessCardDTO saveBusinessCard(Long memberId, String businessCardId);
    List<SavedBusinessCardDTO> getSavedBusinessCardIds(Long memberId);
    List<BusinessCardDTO> getSavedBusinessCards(Long memberId);
}
