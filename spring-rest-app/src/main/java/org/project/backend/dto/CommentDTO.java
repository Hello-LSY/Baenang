package org.project.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long id;
    private String content;
    private String nickname;
    private Long memberId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long postId;
    private String profilePicturePath; // 프로필 사진 경로 추가
}