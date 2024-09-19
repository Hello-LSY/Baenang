package org.project.backend.dto;

import lombok.*;

@Getter
@Setter
public class BusinessCardDTO  {

    private Long cardId;
    private Long memberId;
    private String name;
    private String country;
    private String email;
    private String sns;
    private String introduction;
    private String qr;
}
