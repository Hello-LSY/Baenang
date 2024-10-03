package org.project.backend.model;

import lombok.Builder;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Lob
    private String content;

    private String nickname;

    private double latitude;
    private double longitude;

    @ElementCollection  // 이미지 파일 이름을 리스트로 저장
    private List<String> imageNames = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes = new ArrayList<>();

    // 생성자
    protected Post() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @Builder
    public Post(Long id, String title, String content, String nickname, double latitude, double longitude, List<String> imageNames) {
        this.id = id; // 기존 id를 유지할 수 있도록 빌더에서 설정 가능
        this.title = title;
        this.content = content;
        this.nickname = nickname;
        this.latitude = latitude;
        this.longitude = longitude;
        this.imageNames = imageNames != null ? imageNames : new ArrayList<>();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // 댓글 추가 메서드
    public void addComment(Comment comment) {
        this.comments.add(comment);
        comment.setPost(this);
    }

    // 좋아요 추가 메서드
    public void addLike(Like like) {
        this.likes.add(like);
    }

    // 좋아요 삭제 메서드
    public void removeLike(Like like) {
        this.likes.remove(like);
    }

    // 이미지 파일 이름 추가 메서드
    public void addImageName(String imageName) {
        this.imageNames.add(imageName);
    }

    public List<String> getImageNames() {
        return imageNames;
    }

    // updatedAt 필드 업데이트 메서드
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }

    // 게시글 수정 메서드
    public void updatePost(String title, String content, List<String> imageNames) {
        this.title = title;
        this.content = content;
        this.imageNames = imageNames != null ? imageNames : this.imageNames;
        updateTimestamp(); // 수정 시 updatedAt 업데이트
    }
}
