package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.CommentDTO;
import org.project.backend.model.Comment;
import org.project.backend.repository.CommentRepository;
import org.project.backend.repository.MemberRepository;
import org.project.backend.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    @Override
    public List<CommentDTO> getCommentsByPost(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        List<CommentDTO> commentDTOs = new ArrayList<>();
        for (Comment comment : comments) {
            commentDTOs.add(convertToDTO(comment));
        }
        return commentDTOs;
    }

    @Override
    public CommentDTO getCommentById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment with id " + id + " not found"));
        return convertToDTO(comment);
    }

    @Override
    public CommentDTO createComment(CommentDTO commentDTO) {
        Comment comment = convertToEntity(commentDTO);
        comment.setCreatedAt(LocalDateTime.now());
        return convertToDTO(commentRepository.save(comment));
    }

    @Override
    public CommentDTO updateComment(Long id, CommentDTO commentDTO) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment with id " + id + " not found"));

        comment = comment.toBuilder()
                .content(commentDTO.getContent())
                .build();

        return convertToDTO(commentRepository.save(comment));
    }

    @Override
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment with id " + id + " not found"));
        commentRepository.deleteById(id);
    }

    // 엔티티를 DTO로 변환
    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setPostId(comment.getPostId()); // getPost() 대신 getPostId() 사용
        dto.setMemberId(comment.getMemberId()); // getMember() 대신 getMemberId() 사용
        return dto;
    }


    // DTO를 엔티티로 변환
    private Comment convertToEntity(CommentDTO dto) {
        return Comment.builder()
                .content(dto.getContent())
                .postId(dto.getPostId())
                .memberId(dto.getMemberId())
                .build();
    }
}
