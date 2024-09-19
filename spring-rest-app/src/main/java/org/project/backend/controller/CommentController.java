package org.project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.CommentDTO;
import org.project.backend.service.CommentServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentServiceImpl commentServiceImpl;

    // 특정 게시글의 모든 댓글을 조회하는 엔드포인트
    @GetMapping(value = "/post/{postId}", produces = "application/json")
    public ResponseEntity<List<CommentDTO>> getCommentsByPost(@PathVariable Long postId) {
        List<CommentDTO> comments = commentServiceImpl.getCommentsByPost(postId);
        return ResponseEntity.ok(comments);  // 성공적으로 조회된 댓글 리스트 반환
    }

    // 특정 ID로 댓글을 조회하는 엔드포인트
    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable Long id) {
        try {
            CommentDTO comment = commentServiceImpl.getCommentById(id);
            return ResponseEntity.ok(comment);  // 성공적으로 조회된 댓글 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 댓글을 찾지 못했을 때 404 반환
        }
    }

    // 새로운 댓글을 생성하는 엔드포인트
    @PostMapping(produces = "application/json", consumes = "application/json")
    public ResponseEntity<CommentDTO> createComment(@Valid @RequestBody CommentDTO commentDTO) {
        try {
            CommentDTO createdComment = commentServiceImpl.createComment(commentDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);  // 댓글 생성 후 201 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);  // 오류 발생 시 500 반환
        }
    }

    // 기존 댓글을 업데이트하는 엔드포인트
    @PutMapping(value = "/{id}", produces = "application/json", consumes = "application/json")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable Long id, @Valid @RequestBody CommentDTO commentDTO) {
        try {
            CommentDTO updatedComment = commentServiceImpl.updateComment(id, commentDTO);
            return ResponseEntity.ok(updatedComment);  // 성공적으로 업데이트된 댓글 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 댓글을 찾지 못했을 때 404 반환
        }
    }

    // 댓글을 삭제하는 엔드포인트
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteComment(@PathVariable Long id) {
        try {
            commentServiceImpl.deleteComment(id);
            return ResponseEntity.noContent().build();  // 댓글 삭제 후 204 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found");  // 댓글을 찾지 못했을 때 404 반환
        }
    }
}
