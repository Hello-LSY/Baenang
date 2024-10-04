package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.PostDTO;
import org.project.backend.dto.PostResponseDTO;
import org.project.backend.model.Post;
import org.project.backend.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final LikeService likeService; // LikeService 추가

    @Override
    @Transactional(readOnly = true)
    public List<PostResponseDTO> getAllPosts(Long memberId) {
        // 최신 게시글이 상단에 오도록 내림차순 정렬된 게시글 목록을 가져옴
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(post -> convertToPostResponseDTO(post, memberId))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponseDTO getPostById(Long id, Long memberId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return convertToPostResponseDTO(post, memberId); // 좋아요 상태 계산
    }

    @Override
    @Transactional
    public PostDTO createPost(PostDTO postDTO) {
        Post post = Post.builder()
                .title(postDTO.getTitle())
                .content(postDTO.getContent())
                .nickname(postDTO.getNickname())
                .latitude(postDTO.getLatitude())
                .longitude(postDTO.getLongitude())
                .imageNames(postDTO.getImageNames())
                .memberId(postDTO.getMemberId())
                .build();

        Post savedPost = postRepository.save(post);
        return convertToPostDTO(savedPost);
    }

    @Override
    @Transactional
    public PostDTO updatePost(Long id, PostDTO postDTO) {
        // 게시글 조회
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 제목과 내용만 업데이트
        post.updatePost(
                postDTO.getTitle(),
                postDTO.getContent(),
                post.getImageNames()  // 기존 이미지 리스트 그대로 유지
        );

        // 업데이트된 게시글 저장
        Post savedPost = postRepository.save(post);
        return convertToPostDTO(savedPost);
    }


    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    // Post를 PostDTO로 변환
    private PostDTO convertToPostDTO(Post post) {
        return PostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .nickname(post.getNickname())
                .latitude(post.getLatitude())
                .longitude(post.getLongitude())
                .imageNames(post.getImageNames().stream()
                        .map(imageName -> "/uploads/" + imageName)
                        .collect(Collectors.toList()))
                .likeCount(post.getLikeCount())
                .commentCount(post.getComments().size())
                .memberId(post.getMemberId())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    // Post를 PostResponseDTO로 변환하면서 좋아요 여부 추가
    private PostResponseDTO convertToPostResponseDTO(Post post, Long memberId) {
        boolean hasLiked = likeService.hasLiked(post.getId(), memberId);
        return PostResponseDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .nickname(post.getNickname())
                .latitude(post.getLatitude())
                .longitude(post.getLongitude())
                .imageNames(post.getImageNames().stream()
                        .map(imageName -> "/uploads/" + imageName)
                        .collect(Collectors.toList()))
                .likeCount(post.getLikeCount())
                .commentCount(post.getComments().size())
                .hasLiked(hasLiked)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .memberId(post.getMemberId())
                .build();
    }
}
