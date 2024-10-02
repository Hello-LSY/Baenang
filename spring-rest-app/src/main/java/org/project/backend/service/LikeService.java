package org.project.backend.service;

public interface LikeService {
    void likePost(Long postId, Long memberId);
    void unlikePost(Long postId, Long memberId);
    boolean hasLiked(Long postId, Long memberId);
}
