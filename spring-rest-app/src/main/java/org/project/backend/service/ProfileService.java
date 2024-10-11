package org.project.backend.service;

import org.project.backend.dto.ProfileDto;
import org.project.backend.model.Profile;

public interface ProfileService {

    // 로그인한 사용자 기준으로 새로운 프로필 생성
    ProfileDto createProfileForLoggedInUser(ProfileDto profileDto);

    // 로그인한 사용자 기준으로 프로필 가져오기
    ProfileDto getProfileByLoggedInUser();

    // 로그인한 사용자 기준으로 프로필 업데이트
    ProfileDto updateProfileForLoggedInUser(ProfileDto profileDto);

    // 프로필 이미지 경로 업데이트
    ProfileDto updateProfilePictureForLoggedInUser(String profilePicturePath);

    // 로그인한 사용자 기준으로 프로필 삭제
    void deleteProfileForLoggedInUser();

    // 설정 언어 가져오기
    String getLanguageSettingsByLoggedInUser();

    // 테마 모드 가져오기
    String getThemeByLoggedInUser();

    // 설정 언어 업데이트
    ProfileDto updateLanguageSettingsForLoggedInUser(String languageSettings);

    // 테마 모드 업데이트
    ProfileDto updateThemeForLoggedInUser(String theme);

    // 비밀번호 확인 메서드 추가
    boolean checkPassword(String password);
}
