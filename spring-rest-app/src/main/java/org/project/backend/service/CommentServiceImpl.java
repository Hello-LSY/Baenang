package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.CommentDTO;
import org.project.backend.model.Comment;
import org.project.backend.model.Post;
import org.project.backend.repository.CommentRepository;
import org.project.backend.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Override
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream()
                .map(comment -> CommentDTO.builder()
                        .id(comment.getId())
                        .content(comment.getContent())
                        .nickname(comment.getNickname())
                        .createdAt(comment.getCreatedAt())
                        .updatedAt(comment.getUpdatedAt())
                        .postId(comment.getPost().getId())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentDTO addComment(Long postId, CommentDTO commentDTO) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment(commentDTO.getContent(), commentDTO.getNickname());
        post.addComment(comment);

        Comment savedComment = commentRepository.save(comment);
        return CommentDTO.builder()
                .id(savedComment.getId())
                .content(savedComment.getContent())
                .nickname(savedComment.getNickname())
                .createdAt(savedComment.getCreatedAt())
                .updatedAt(savedComment.getUpdatedAt())
                .postId(postId)
                .build();
    }

    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
