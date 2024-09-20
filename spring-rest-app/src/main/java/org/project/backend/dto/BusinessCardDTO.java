package org.project.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessCardDTO {

    private String cardId;
    private Long memberId;
    private String name;
    private String country;
    private String email;
    private String sns;
    private String introduction;
    private String qr;
}
