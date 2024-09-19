package org.project.backend.service;

import org.project.backend.dto.LikeDTO;

public interface LikeService {
    void likePost(LikeDTO likeDTO);
    Long getLikeCount(Long postId);
}

