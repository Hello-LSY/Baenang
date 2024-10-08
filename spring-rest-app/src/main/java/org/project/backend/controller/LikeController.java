package org.project.backend.controller;

import lombok.RequiredArgsConstructor;
import org.project.backend.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/post/{postId}/member/{memberId}")
    public ResponseEntity<Void> likePost(@PathVariable Long postId, @PathVariable Long memberId) {
        likeService.likePost(postId, memberId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/post/{postId}/member/{memberId}")
    public ResponseEntity<Void> unlikePost(@PathVariable Long postId, @PathVariable Long memberId) {
        likeService.unlikePost(postId, memberId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/post/{postId}/member/{memberId}")
    public ResponseEntity<Boolean> hasLiked(@PathVariable Long postId, @PathVariable Long memberId) {
        boolean hasLiked = likeService.hasLiked(postId, memberId);
        return ResponseEntity.ok(hasLiked);
    }
}
