package org.project.backend.service;

import org.project.backend.dto.PostDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface PostService {
    List<PostDTO> getAllPosts();
    PostDTO getPostById(Long id);
    PostDTO createPost(PostDTO postDTO, List<MultipartFile> files) throws IOException;
    PostDTO updatePost(Long id, PostDTO postDTO, List<MultipartFile> files) throws IOException;
    void deletePost(Long id);
}
