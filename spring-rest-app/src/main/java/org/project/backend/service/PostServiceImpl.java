package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.PostDTO;
import org.project.backend.model.Post;
import org.project.backend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    @Value("${file.upload-dir}")
    private String UPLOAD_DIR;

    @Override
    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(post -> convertToPostDTO(post))
                .collect(Collectors.toList());
    }

    @Override
    public PostDTO getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return convertToPostDTO(post);
    }

    @Override
    @Transactional
    public PostDTO createPost(PostDTO postDTO, List<MultipartFile> files) throws IOException {
        List<String> imageNames = saveFiles(files);

        Post post = Post.builder()
                .title(postDTO.getTitle())
                .content(postDTO.getContent())
                .nickname(postDTO.getNickname())
                .latitude(postDTO.getLatitude())
                .longitude(postDTO.getLongitude())
                .imageNames(imageNames)
                .build();

        Post savedPost = postRepository.save(post);

        return convertToPostDTO(savedPost);
    }

    @Override
    @Transactional
    public PostDTO updatePost(Long id, PostDTO postDTO, List<MultipartFile> files) throws IOException {
        // 기존 게시글 조회
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 새 이미지 파일 저장
        List<String> imageNames = saveFiles(files);

        // 필드 업데이트 (null 체크 및 기존 값 유지)
        post.updatePost(postDTO.getTitle(), postDTO.getContent(), !imageNames.isEmpty() ? imageNames : post.getImageNames());

        // 변경사항 저장
        Post savedPost = postRepository.save(post);

        return convertToPostDTO(savedPost);
    }

    private List<String> saveFiles(List<MultipartFile> files) throws IOException {
        List<String> imageNames = new ArrayList<>();
        Path uploadPath = Paths.get(UPLOAD_DIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        for (int i = 0; i < Math.min(files.size(), 3); i++) {
            MultipartFile file = files.get(i);

            if (!file.isEmpty()) {
                String originalFilename = file.getOriginalFilename();
                String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                String filename = UUID.randomUUID().toString() + extension;

                Path destinationPath = uploadPath.resolve(filename);
                Files.copy(file.getInputStream(), destinationPath);

                imageNames.add(filename);
            }
        }

        return imageNames;
    }

    private PostDTO convertToPostDTO(Post post) {
        return PostDTO.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .nickname(post.getNickname())
                .latitude(post.getLatitude())
                .longitude(post.getLongitude())
                .imageNames(post.getImageNames().stream()
                        .map(imageName -> "/uploads/" + imageName)
                        .collect(Collectors.toList()))
                .likeCount(post.getLikes().size())
                .commentCount(post.getComments().size())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}
