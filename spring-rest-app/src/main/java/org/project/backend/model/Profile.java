package org.project.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Table(name = "profile")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "profile_id")
    private Long profileId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", referencedColumnName = "member_id")
    private Member member;

    // 프로필 사진 경로
    @Column(name = "profile_picture_path", nullable = true)
    private String profilePicturePath;

    // 설정 언어
    @Column(name = "language_settings", nullable = false)
    private String languageSettings;

    // 테마 모드
    @Column(name = "theme", nullable = false)
    private String theme;

}
