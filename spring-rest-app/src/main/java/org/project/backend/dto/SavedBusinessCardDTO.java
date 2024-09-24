package org.project.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedBusinessCardDTO {
    private Long id;
    private Long memberId;
    private String businessCardId;
}