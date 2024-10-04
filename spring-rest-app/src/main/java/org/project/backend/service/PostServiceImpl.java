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
        return postRepository.findAll().stream()
                .map(post -> convertToPostResponseDTO(post, memberId)) // 좋아요 상태 계산
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
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.updatePost(
                postDTO.getTitle(),
                postDTO.getContent(),
                postDTO.getImageNames() != null && !postDTO.getImageNames().isEmpty()
                        ? postDTO.getImageNames()
                        : post.getImageNames()
        );

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
