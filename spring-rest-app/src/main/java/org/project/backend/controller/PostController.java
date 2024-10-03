package org.project.backend.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.RequiredArgsConstructor;
import org.project.backend.dto.PostDTO;
import org.project.backend.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@Api(tags = "Post API", description = "게시글 관련 API")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @ApiOperation(value = "게시글 생성", notes = "게시글과 이미지를 서버에 업로드하고 게시글을 생성합니다.")
    @PostMapping("/create")
    public ResponseEntity<PostDTO> createPost(
            @ApiParam(value = "게시글 정보", required = true) @RequestPart("post") PostDTO postDTO,
            @ApiParam(value = "업로드할 이미지 파일 (최대 3개)") @RequestPart("files") List<MultipartFile> files) {

        try {
            PostDTO createdPost = postService.createPost(postDTO, files);
            return ResponseEntity.ok(createdPost);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDTO> updatePost(
            @PathVariable Long id,
            @RequestPart("post") PostDTO postDTO,
            @RequestPart("files") List<MultipartFile> files) {
        try {
            PostDTO updatedPost = postService.updatePost(id, postDTO, files);
            return ResponseEntity.ok(updatedPost);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @ApiOperation(value = "모든 게시글 조회", notes = "모든 게시글을 조회합니다.")
    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @ApiOperation(value = "게시글 조회", notes = "게시글 ID로 게시글을 조회합니다.")
    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }



    @ApiOperation(value = "게시글 삭제", notes = "게시글 ID로 게시글을 삭제합니다.")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
