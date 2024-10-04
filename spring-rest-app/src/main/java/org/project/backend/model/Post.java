package org.project.backend.model;

import lombok.Builder;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Entity
@Getter
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private Long memberId;

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

    private int likeCount; // 좋아요 수 필드 추가

    // 생성자
    protected Post() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.likeCount = 0; // 좋아요 수 초기화
    }

    @Builder
    public Post(String title, String content, String nickname, double latitude, double longitude, List<String> imageNames, Long memberId) {
        this.title = title;
        this.content = content;
        this.nickname = nickname;
        this.latitude = latitude;
        this.longitude = longitude;
        this.imageNames = imageNames != null ? new ArrayList<>(imageNames) : new ArrayList<>();
        this.memberId = memberId;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.likeCount = 0;
    }

    // 댓글 추가 메서드
    public void addComment(Comment comment) {
        this.comments.add(comment);
        comment.setPost(this);
    }

    public void incrementLikeCount() {
        this.likeCount += 1;
    }

    public void decrementLikeCount() {
        if (this.likeCount > 0) {
            this.likeCount -= 1;
        }
    }

    // 이미지 파일 이름 추가 메서드
    public void addImageName(String imageName) {
        this.imageNames.add(imageName);
    }

    // 이미지 파일 이름 목록 가져오기 (불변 컬렉션 반환)
    public List<String> getImageNames() {
        return Collections.unmodifiableList(imageNames);
    }

    // 댓글 목록 가져오기 (불변 컬렉션 반환)
    public List<Comment> getComments() {
        return Collections.unmodifiableList(comments);
    }

    // 좋아요 목록 가져오기 (불변 컬렉션 반환)
    public List<Like> getLikes() {
        return Collections.unmodifiableList(likes);
    }

    // updatedAt 필드 업데이트 메서드
    public void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }

    // 게시글 수정 메서드
    public void updatePost(String title, String content, List<String> imageNames) {
        this.title = title;
        this.content = content;
        this.imageNames = imageNames != null ? new ArrayList<>(imageNames) : this.imageNames;
        updateTimestamp(); // 수정 시 updatedAt 업데이트
    }
}
