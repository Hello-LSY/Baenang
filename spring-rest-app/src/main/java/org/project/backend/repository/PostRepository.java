package org.project.backend.repository;

import org.project.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.imageNames WHERE (6371 * acos(cos(radians(:latitude)) * cos(radians(p.latitude)) * cos(radians(p.longitude) - radians(:longitude)) + sin(radians(:latitude)) * sin(radians(p.latitude)))) <= :distance ORDER BY p.createdAt DESC")
    List<Post> findAllWithinDistance(@Param("latitude") double latitude, @Param("longitude") double longitude, @Param("distance") double distance);

    // JPQL로 imageNames를 함께 로드하는 쿼리 (개별 게시글 조회 시)
    @Query("SELECT p FROM Post p LEFT JOIN FETCH p.imageNames WHERE p.id = :id")
    Post findByIdWithImages(@Param("id") Long id);

    // JPQL로 모든 게시글 조회 시 imageNames를 함께 로드하는 쿼리
    @Query("SELECT DISTINCT p FROM Post p LEFT JOIN FETCH p.imageNames ORDER BY p.createdAt DESC")
    List<Post> findAllWithImagesOrderByCreatedAtDesc();

}
