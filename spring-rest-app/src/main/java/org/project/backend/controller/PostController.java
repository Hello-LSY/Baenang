package org.project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.PostDTO;
import org.project.backend.service.PostServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostServiceImpl postServiceImpl;

    // 모든 게시글을 조회하는 엔드포인트
    @GetMapping(produces = "application/json")
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<PostDTO> posts = postServiceImpl.getAllPosts();
        return ResponseEntity.ok(posts);  // 성공적으로 조회된 게시글 리스트 반환
    }

    // 특정 ID로 게시글을 조회하는 엔드포인트
    @GetMapping(value = "/{id}", produces = "application/json")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        try {
            PostDTO post = postServiceImpl.getPostById(id);
            return ResponseEntity.ok(post);  // 성공적으로 조회된 게시글 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 게시글을 찾지 못했을 때 404 반환
        }
    }

    // 새로운 게시글을 생성하는 엔드포인트
    @PostMapping(produces = "application/json", consumes = "application/json")
    public ResponseEntity<PostDTO> createPost(@Valid @RequestBody PostDTO postDTO) {
        try {
            PostDTO createdPost = postServiceImpl.createPost(postDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);  // 게시글 생성 후 201 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);  // 오류 발생 시 500 반환
        }
    }

    // 기존 게시글을 업데이트하는 엔드포인트
    @PutMapping(value = "/{id}", produces = "application/json", consumes = "application/json")
    public ResponseEntity<PostDTO> updatePost(@PathVariable Long id, @Valid @RequestBody PostDTO postDTO) {
        try {
            PostDTO updatedPost = postServiceImpl.updatePost(id, postDTO);
            return ResponseEntity.ok(updatedPost);  // 성공적으로 업데이트된 게시글 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 게시글을 찾지 못했을 때 404 반환
        }
    }

    // 게시글을 삭제하는 엔드포인트
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        try {
            postServiceImpl.deletePost(id);
            return ResponseEntity.noContent().build();  // 게시글 삭제 후 204 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");  // 게시글을 찾지 못했을 때 404 반환
        }
    }
}
