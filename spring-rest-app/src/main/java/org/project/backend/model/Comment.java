package org.project.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;

import javax.persistence.*;

@Entity
@Getter
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    @JsonBackReference
    private Post post;


    // 생성자
    protected Comment() {}

    public Comment(String content) {
        this.content = content;
    }

    public void setPost(Post post) {
        this.post = post;
    }
}
