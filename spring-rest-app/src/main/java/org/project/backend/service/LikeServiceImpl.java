package org.project.backend.service;

import lombok.RequiredArgsConstructor;
import org.project.backend.model.Like;
import org.project.backend.model.Member;
import org.project.backend.model.Post;
import org.project.backend.repository.LikeRepository;
import org.project.backend.repository.MemberRepository;
import org.project.backend.repository.PostRepository;
import org.project.backend.service.LikeService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    @Override
    public void likePost(Long postId, Long memberId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (!likeRepository.existsByPostAndMember(post, member)) {
            Like like = new Like(post, member);
            likeRepository.save(like);
        } else {
            throw new RuntimeException("Already liked");
        }
    }

    @Override
    public void unlikePost(Long postId, Long memberId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Like like = likeRepository.findByPostAndMember(post, member)
                .orElseThrow(() -> new RuntimeException("Like not found"));
        likeRepository.delete(like);
    }

    @Override
    public boolean hasLiked(Long postId, Long memberId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        return likeRepository.existsByPostAndMember(post, member);
    }
}
