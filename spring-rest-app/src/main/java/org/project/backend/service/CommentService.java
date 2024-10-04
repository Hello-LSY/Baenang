package org.project.backend.service;

import org.project.backend.dto.CommentDTO;

import java.util.List;

public interface CommentService {
    List<CommentDTO> getCommentsByPostId(Long postId);
    CommentDTO addComment(Long postId, CommentDTO commentDTO);
    void deleteComment(Long id);
}
