package org.project.backend.repository;

import org.project.backend.model.Like;
import org.project.backend.model.Member;
import org.project.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByPostAndMember(Post post, Member member);
    Optional<Like> findByPostAndMember(Post post, Member member);
}
