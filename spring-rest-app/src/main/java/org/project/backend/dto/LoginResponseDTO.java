package org.project.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String token;
    private String type = "Bearer";
    private Long memberId;
    private String nickname;
    private String registrationNumber;
    private String email;
}
