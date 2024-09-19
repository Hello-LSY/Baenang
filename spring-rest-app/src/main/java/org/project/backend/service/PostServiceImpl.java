package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.PostDTO;
import org.project.backend.model.Member;
import org.project.backend.model.Post;
import org.project.backend.repository.MemberRepository;
import org.project.backend.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    @Override
    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PostDTO getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post with id " + id + " not found"));
        return convertToDTO(post);
    }

    @Override
    public PostDTO createPost(PostDTO postDTO) {
        Member member = memberRepository.findById(postDTO.getMemberId())
                .orElseThrow(() -> new RuntimeException("Member with id " + postDTO.getMemberId() + " not found"));

        // Post 엔터티 생성 시 builder 패턴으로 데이터를 전달
        Post post = Post.builder()
                .title(postDTO.getTitle())
                .content(postDTO.getContent())
                .imagePath(postDTO.getImagePath())
                .memberId(member.getId())  // setter 대신 DTO에서 받은 값으로 처리
                .createdAt(LocalDateTime.now())
                .build();

        Post savedPost = postRepository.save(post);
        return convertToDTO(savedPost);
    }

    @Override
    public PostDTO updatePost(Long id, PostDTO postDetails) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post with id " + id + " not found"));

        post = post.toBuilder()
                .title(postDetails.getTitle())
                .content(postDetails.getContent())
                .imagePath(postDetails.getImagePath())
                .build();

        return convertToDTO(postRepository.save(post));
    }

    @Override
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post with id " + id + " not found"));
        postRepository.deleteById(id);
    }

    // 엔티티를 DTO로 변환하는 메서드
    private PostDTO convertToDTO(Post post) {
        return PostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .imagePath(post.getImagePath())
                .memberId(post.getMemberId())
                .build();
    }

    // DTO를 엔티티로 변환하는 메서드
    private Post convertToEntity(PostDTO dto) {
        return Post.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .imagePath(dto.getImagePath())
                .memberId(dto.getMemberId())
                .build();
    }
}
