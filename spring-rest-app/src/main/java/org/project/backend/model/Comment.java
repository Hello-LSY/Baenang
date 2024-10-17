package org.project.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private String nickname;
    private Long memberId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "post_id")
    @JsonBackReference
    private Post post;

    public Comment(String content, Long memberId, String nickname) {
        this.content = content;
        this.memberId = memberId;
        this.nickname = nickname;
        this.createdAt = LocalDateTime.now();
    }

    public void setPost(Post post) {
        this.post = post;
    }

    public void update(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }
}
