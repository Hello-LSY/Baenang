package org.project.backend.dto;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class CommentDTO {

    private Long id;

    @NotBlank(message = "Content is mandatory")
    private String content;

    private Long postId;

    private Long memberId;
}
