package org.project.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String nickname;
    private double latitude;
    private double longitude;
    private List<String> imageNames;
    private int likeCount;
    private int commentCount;
    private boolean hasLiked;  // 사용자가 해당 게시글을 좋아했는지 여부
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long memberId;
    private String profilePicturePath;  // 프로필 사진 경로 추가
}
