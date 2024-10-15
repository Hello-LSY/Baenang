package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.dto.CommentDTO;
import org.project.backend.model.Comment;
import org.project.backend.model.Member;
import org.project.backend.model.Post;
import org.project.backend.model.Profile;
import org.project.backend.repository.CommentRepository;
import org.project.backend.repository.MemberRepository;
import org.project.backend.repository.PostRepository;
import org.project.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final ProfileRepository profileRepository;
    private final MemberRepository memberRepository;

    @Override
    public List<CommentDTO> getCommentsByPostId(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);

        return comments.stream()
                .map(comment -> {
                    // postId로 Post 조회 후 memberId를 이용해 Member 조회
                    Post post = comment.getPost();
                    Long memberId = post.getMemberId();  // Post의 memberId 사용
                    Member member = memberRepository.findById(memberId)
                            .orElseThrow(() -> new RuntimeException("Member not found"));

                    // Member로 Profile 조회
                    Profile profile = profileRepository.findByMember(member).orElse(null);
                    String profilePicturePath = (profile != null) ? profile.getProfilePicturePath() : null;

                    return CommentDTO.builder()
                            .id(comment.getId())
                            .content(comment.getContent())
                            .nickname(comment.getNickname())
                            .createdAt(comment.getCreatedAt())
                            .updatedAt(comment.getUpdatedAt())
                            .postId(post.getId())
                            .profilePicturePath(profilePicturePath)  // 프로필 사진 경로 추가
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentDTO addComment(Long postId, CommentDTO commentDTO) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Builder 패턴을 사용하여 Comment 객체 생성
        Comment comment = Comment.builder()
                .content(commentDTO.getContent())
                .memberId(commentDTO.getMemberId())  // memberId 추가
                .nickname(commentDTO.getNickname())
                .post(post)  // post 설정
                .createdAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);

        Long memberId = post.getMemberId();  // Post에서 memberId 가져옴
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Profile profile = profileRepository.findByMember(member).orElse(null);
        String profilePicturePath = (profile != null) ? profile.getProfilePicturePath() : null;

        return CommentDTO.builder()
                .id(savedComment.getId())
                .content(savedComment.getContent())
                .nickname(savedComment.getNickname())
                .memberId(savedComment.getMemberId())
                .createdAt(savedComment.getCreatedAt())
                .updatedAt(savedComment.getUpdatedAt())
                .postId(postId)
                .profilePicturePath(profile.getProfilePicturePath())  // Profile의 profilePicturePath 설정
                .build();
    }




    @Override
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}
