package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.LikeDTO;
import org.project.backend.model.Like;
import org.project.backend.repository.LikeRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;

    @Override
    public void likePost(LikeDTO likeDTO) {
        Like like = likeRepository.findByPostIdAndMemberId(likeDTO.getPostId(), likeDTO.getMemberId())
                .orElse(null);

        if (like != null) {
            likeRepository.delete(like); // 좋아요 취소
        } else {
            Like newLike = Like.builder()
                    .postId(likeDTO.getPostId())
                    .memberId(likeDTO.getMemberId())
                    .build();
            likeRepository.save(newLike); // 좋아요 추가
        }
    }

    @Override
    public Long getLikeCount(Long postId) {
        return likeRepository.countByPostId(postId);
    }
}
