package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.PostDTO;
import org.project.backend.dto.PostResponseDTO;
import org.project.backend.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@Api(tags = "Post API", description = "게시글 관련 API")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @ApiOperation(value = "게시글 생성", notes = "게시글을 생성합니다.")
    @PostMapping("/create")
    public ResponseEntity<PostDTO> createPost(
            @ApiParam(value = "게시글 정보", required = true) @RequestBody PostDTO postDTO) {
        try {
            PostDTO createdPost = postService.createPost(postDTO);
            return ResponseEntity.ok(createdPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @ApiOperation(value = "게시글 수정", notes = "게시글을 수정합니다.")
    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long id,
            @ApiParam(value = "게시글 정보", required = true) @RequestBody PostDTO postDTO) {
        try {
            PostDTO updatedPost = postService.updatePost(id, postDTO);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @ApiOperation(value = "모든 게시글 조회", notes = "모든 게시글을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<PostResponseDTO>> getAllPosts(@RequestParam Long memberId) {
        List<PostResponseDTO> posts = postService.getAllPosts(memberId);
        return ResponseEntity.ok(posts);
    }

    @ApiOperation(value = "게시글 조회", notes = "게시글 ID로 게시글을 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDTO> getPostById(@PathVariable Long id, @RequestParam Long memberId) {
        PostResponseDTO postResponseDTO = postService.getPostById(id, memberId);
        return ResponseEntity.ok(postResponseDTO);
    }

    @ApiOperation(value = "게시글 삭제", notes = "게시글 ID로 게시글을 삭제합니다.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }

    @ApiOperation(value = "가까운 게시글 조회", notes = "위치와 거리를 기준으로 가까운 게시글을 조회합니다.")
    @GetMapping("/nearby")
    public ResponseEntity<List<PostResponseDTO>> getPostsNearby(
            @ApiParam(value = "위도", required = true) @RequestParam("latitude") double latitude,
            @ApiParam(value = "경도", required = true) @RequestParam("longitude") double longitude,
            @ApiParam(value = "조회 거리(km)", required = true) @RequestParam("distance") double distance,
            @ApiParam(value = "회원 ID", required = true) @RequestParam("memberId") Long memberId) {

        // 유효한 위도와 경도 값인지 확인
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        List<PostResponseDTO> posts = postService.getPostsNearby(latitude, longitude, distance, memberId);
        return ResponseEntity.ok(posts);
    }
}
