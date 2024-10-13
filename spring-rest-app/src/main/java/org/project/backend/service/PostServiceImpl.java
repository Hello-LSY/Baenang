package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.project.backend.dto.PostDTO;
import org.project.backend.dto.PostResponseDTO;
import org.project.backend.model.Post;
import org.project.backend.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final LikeService likeService;

    // 모든 게시글과 imageNames를 JPQL로 함께 로드하여 반환
    @Override
    @Transactional(readOnly = true)
    public List<PostResponseDTO> getAllPosts(Long memberId) {
        return postRepository.findAllWithImagesOrderByCreatedAtDesc().stream()
                .map(post -> convertToPostResponseDTO(post, memberId))
                .collect(Collectors.toList());
    }

    // 위치 기반으로 게시글 조회
    @Override
    @Transactional(readOnly = true)
    public List<PostResponseDTO> getPostsNearby(double latitude, double longitude, double distance, Long memberId) {
        List<Post> posts = postRepository.findAllWithinDistance(latitude, longitude, distance);
        return posts.stream()
                .map(post -> convertToPostResponseDTO(post, memberId))
                .collect(Collectors.toList());
    }

    // 개별 게시글과 imageNames를 JPQL로 함께 로드하여 반환
    @Override
    @Transactional(readOnly = true)
    public PostResponseDTO getPostById(Long id, Long memberId) {
        Post post = postRepository.findByIdWithImages(id);
        if (post == null) {
            throw new RuntimeException("Post not found");
        }
        return convertToPostResponseDTO(post, memberId);
    }

    // 게시글 생성 로직
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

    // 게시글 수정 로직
    @Override
    @Transactional
    public PostDTO updatePost(Long id, PostDTO postDTO) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.updatePost(postDTO.getTitle(), postDTO.getContent(), post.getImageNames());

        Post savedPost = postRepository.save(post);
        return convertToPostDTO(savedPost);
    }

    // 게시글 삭제 로직
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
                .imageNames(post.getImageNames() != null ? post.getImageNames() : new ArrayList<>()) // null 체크 추가
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
                .imageNames(post.getImageNames() != null ? post.getImageNames() : new ArrayList<>()) // null 체크 추가
                .likeCount(post.getLikeCount())
                .commentCount(post.getComments().size())
                .hasLiked(hasLiked)
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .memberId(post.getMemberId())
                .build();
    }
}
