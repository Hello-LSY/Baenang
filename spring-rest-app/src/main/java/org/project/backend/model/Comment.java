package org.project.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private String nickname;  // 댓글 작성자 닉네임
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    @JsonBackReference
    private Post post;

    // 생성자
    protected Comment() {}

    public Comment(String content, String nickname) {
        this.content = content;
        this.nickname = nickname;
        this.createdAt = LocalDateTime.now();
    }

    public void setPost(Post post) {
        this.post = post;
    }

    // 댓글 수정 시 호출되는 메서드
    public void update(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }
}
