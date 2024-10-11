package org.project.backend.service;

import org.project.backend.dto.ProfileDto;
import org.project.backend.model.Profile;
import org.project.backend.model.Member;
import org.project.backend.repository.ProfileRepository;
import org.project.backend.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 현재 로그인한 사용자의 정보를 가져오는 메서드
    private Member getLoggedInUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return memberRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
    }

    @Override
    @Transactional
    public ProfileDto createProfileForLoggedInUser(ProfileDto profileDto) {
        Member loggedInUser = getLoggedInUser();

        Profile profile = Profile.builder()
                .member(loggedInUser)
                .profilePicturePath(profileDto.getProfilePicturePath())
                .languageSettings(profileDto.getLanguageSettings())
                .theme(profileDto.getTheme())
                .build();

        profileRepository.save(profile);

        profileDto.setProfileId(profile.getProfileId());
        profileDto.setMemberId(loggedInUser.getId());
        return profileDto;
    }

    @Override
    @Transactional
    public ProfileDto getProfileByLoggedInUser() {
        Member loggedInUser = getLoggedInUser();
        Optional<Profile> optionalProfile = profileRepository.findByMember(loggedInUser);

        // 프로필이 존재하지 않으면 자동 생성
        if (optionalProfile.isEmpty()) {
            ProfileDto newProfileDto = new ProfileDto();
            newProfileDto.setMemberId(loggedInUser.getId());
            newProfileDto.setLanguageSettings("korean");  // 기본 언어 설정
            newProfileDto.setTheme("light");  // 기본 테마 설정
            return createProfileForLoggedInUser(newProfileDto);
        }

        Profile profile = optionalProfile.get();
        return ProfileDto.builder()
                .profileId(profile.getProfileId())
                .memberId(loggedInUser.getId())
                .profilePicturePath(profile.getProfilePicturePath())
                .languageSettings(profile.getLanguageSettings())
                .theme(profile.getTheme())
                .build();
    }

    @Override
    @Transactional
    public ProfileDto updateProfileForLoggedInUser(ProfileDto profileDto) {
        Member loggedInUser = getLoggedInUser();
        Profile profile = profileRepository.findByMember(loggedInUser)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다."));

        profile = profile.toBuilder()
                .profilePicturePath(profileDto.getProfilePicturePath())
                .languageSettings(profileDto.getLanguageSettings())
                .theme(profileDto.getTheme())
                .build();

        profileRepository.save(profile);
        return profileDto;
    }

    @Override
    @Transactional
    public ProfileDto updateProfilePictureForLoggedInUser(String profilePicturePath) {
        Member loggedInUser = getLoggedInUser();
        Profile profile = profileRepository.findByMember(loggedInUser)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다."));

        profile = profile.toBuilder()
                .profilePicturePath(profilePicturePath)
                .build();

        profileRepository.save(profile);

        return ProfileDto.builder()
                .profileId(profile.getProfileId())
                .memberId(loggedInUser.getId())
                .profilePicturePath(profile.getProfilePicturePath())
                .languageSettings(profile.getLanguageSettings())
                .theme(profile.getTheme())
                .build();
    }

    @Override
    @Transactional
    public void deleteProfileForLoggedInUser() {
        Member loggedInUser = getLoggedInUser();
        Profile profile = profileRepository.findByMember(loggedInUser)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다."));

        profileRepository.delete(profile);
    }

    @Override
    @Transactional(readOnly = true)
    public String getLanguageSettingsByLoggedInUser() {
        Member loggedInUser = getLoggedInUser();
        Profile profile = profileRepository.findByMember(loggedInUser)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다."));

        return profile.getLanguageSettings();
    }

    @Override
    @Transactional
    public String getThemeByLoggedInUser() {
        Member loggedInUser = getLoggedInUser();
        Profile profile = profileRepository.findByMember(loggedInUser)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다."));

        return profile.getTheme();
    }

    @Override
    @Transactional
    public ProfileDto updateLanguageSettingsForLoggedInUser(String languageSettings) {
        Member loggedInUser = getLoggedInUser();
        Profile profile = profileRepository.findByMember(loggedInUser)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다."));

        profile = profile.toBuilder()
                .languageSettings(languageSettings)
                .build();

        profileRepository.save(profile);

        return ProfileDto.builder()
                .profileId(profile.getProfileId())
                .memberId(loggedInUser.getId())
                .profilePicturePath(profile.getProfilePicturePath())
                .languageSettings(profile.getLanguageSettings())
                .theme(profile.getTheme())
                .build();
    }

    @Override
    @Transactional
    public ProfileDto updateThemeForLoggedInUser(String theme) {
        Member loggedInUser = getLoggedInUser();
        Profile profile = profileRepository.findByMember(loggedInUser)
                .orElseThrow(() -> new IllegalArgumentException("프로필을 찾을 수 없습니다."));

        profile = profile.toBuilder()
                .theme(theme)
                .build();

        profileRepository.save(profile);

        return ProfileDto.builder()
                .profileId(profile.getProfileId())
                .memberId(loggedInUser.getId())
                .profilePicturePath(profile.getProfilePicturePath())
                .languageSettings(profile.getLanguageSettings())
                .theme(profile.getTheme())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean checkPassword(String password) {
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("비밀번호가 비어있습니다.");
        }

        Member loggedInUser = getLoggedInUser();
        return passwordEncoder.matches(password, loggedInUser.getPassword());
    }
}
