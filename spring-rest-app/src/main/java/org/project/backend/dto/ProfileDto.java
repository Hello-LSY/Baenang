package org.project.backend.dto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileDto {
    private Long memberId;
    private Long profileId;  //문서 고유번호

    private String profilePicturePath; // 프로필사진 경로
    private String languageSettings; // 언어 설정
    private String theme; // 테마 모드 설정
}
