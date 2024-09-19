package org.project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.LikeDTO;
import org.project.backend.service.LikeServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeServiceImpl likeServiceImpl;

    // 게시글에 좋아요를 추가하는 엔드포인트
    @PostMapping(produces = "application/json", consumes = "application/json")
    public ResponseEntity<Void> likePost(@RequestBody LikeDTO likeDTO) {
        try {
            likeServiceImpl.likePost(likeDTO);
            return ResponseEntity.ok().build();  // 좋아요 성공 시 200 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // 오류 발생 시 500 반환
        }
    }

    // 특정 게시글의 좋아요 개수를 조회하는 엔드포인트
    @GetMapping(value = "/count/{postId}", produces = "application/json")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long postId) {
        try {
            Long likeCount = likeServiceImpl.getLikeCount(postId);
            return ResponseEntity.ok(likeCount);  // 성공적으로 조회된 좋아요 개수 반환
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // 게시글을 찾지 못했을 때 404 반환
        }
    }
}
