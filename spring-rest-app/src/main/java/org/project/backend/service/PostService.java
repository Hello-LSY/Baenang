package org.project.backend.service;

import org.project.backend.dto.PostDTO;
import org.project.backend.dto.PostResponseDTO;

import java.util.List;

public interface PostService {
    List<PostResponseDTO> getAllPosts(Long memberId); // memberId를 받아서 좋아요 상태를 확인
    PostResponseDTO getPostById(Long id, Long memberId); // 특정 게시글을 조회하면서 좋아요 상태 확인
    PostDTO createPost(PostDTO postDTO);
    PostDTO updatePost(Long id, PostDTO postDTO);
    void deletePost(Long id);
}
