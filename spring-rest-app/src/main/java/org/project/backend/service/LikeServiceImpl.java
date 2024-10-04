package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.model.Like;
import org.project.backend.model.Member;
import org.project.backend.model.Post;
import org.project.backend.repository.LikeRepository;
import org.project.backend.repository.MemberRepository;
import org.project.backend.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional
    public void likePost(Long postId, Long memberId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // 좋아요가 이미 있는지 확인
        if (!likeRepository.existsByPostAndMember(post, member)) {
            Like like = new Like(post, member);
            likeRepository.save(like);
            post.incrementLikeCount();
            postRepository.save(post);  // 변경 사항 저장

            // 로그 추가
            System.out.println("Like created successfully for postId: " + postId + " and memberId: " + memberId);
        } else {
            throw new RuntimeException("Already liked");
        }
    }



    @Override
    @Transactional
    public void unlikePost(Long postId, Long memberId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        // Like가 존재하는지 먼저 확인
        Optional<Like> likeOptional = likeRepository.findByPostAndMember(post, member);
        if (likeOptional.isPresent()) {
            likeRepository.delete(likeOptional.get());
            post.decrementLikeCount();
            postRepository.save(post);  // 변경 사항 저장
        } else {
            throw new RuntimeException("Like not found");
        }
    }



    @Override
    public boolean hasLiked(Long postId, Long memberId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다."));

        return likeRepository.existsByPostAndMember(post, member);
    }
}
