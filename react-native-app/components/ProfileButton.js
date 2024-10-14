import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Svg, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { fetchProfile } from '../redux/profileSlice';
import { useDispatch, useSelector } from 'react-redux';
import DefaultProfileImage from '../assets/icons/default-profile.png';
import { S3_URL } from '../constants/config'; // S3 URL 상수

const AnimatedView = Animated.createAnimatedComponent(View);

const ProfileButton = ({
  onPress,
  imageSource = DefaultProfileImage,
  size = 50,
}) => {
  const BUTTON_SIZE = size;
  const IMAGE_SIZE = size * 0.8; // 이미지 크기를 버튼 크기의 80%로 설정

  const rotation = useSharedValue(0);
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.profile); // 프로필 상태에서 profile 정보 가져옴
  const [profilePicture, setProfilePicture] = useState(DefaultProfileImage); // 기본 이미지를 초기 값으로 설정

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
    dispatch(fetchProfile());
  }, []);

  useEffect(() => {
    // 프로필 이미지 경로가 있으면 해당 경로로 설정
    if (profile?.profilePicturePath) {
      setProfilePicture({ uri: `${S3_URL}/${profile.profilePicturePath}` }); // URL 경로로 이미지 불러옴
    } else {
      setProfilePicture(DefaultProfileImage); // 없으면 기본 이미지 설정
    }
  }, [profile]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <TouchableOpacity
      style={[
        styles.profileButton,
        { width: BUTTON_SIZE, height: BUTTON_SIZE },
      ]}
      onPress={onPress}
    >
      <View
        style={[
          styles.imageContainer,
          { width: BUTTON_SIZE, height: BUTTON_SIZE },
        ]}
      >
        <AnimatedView
          style={[
            styles.gradientCircleContainer,
            animatedStyle,
            { width: BUTTON_SIZE, height: BUTTON_SIZE },
          ]}
        >
          <Svg width={BUTTON_SIZE} height={BUTTON_SIZE}>
            <Defs>
              <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#133FDB" />
                <Stop offset="100%" stopColor="rgba(183, 0, 77, 0.3)" />
              </LinearGradient>
            </Defs>
            <Circle
              cx={BUTTON_SIZE / 2}
              cy={BUTTON_SIZE / 2}
              r={BUTTON_SIZE / 2 - 2}
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
            />
          </Svg>
        </AnimatedView>
        <Image
          source={profilePicture} // 동적으로 변경된 이미지 경로 사용
          style={[
            styles.profileIcon,
            {
              width: IMAGE_SIZE,
              height: IMAGE_SIZE,
              borderRadius: IMAGE_SIZE / 2,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gradientCircleContainer: {
    position: 'absolute',
  },
  profileIcon: {
    resizeMode: 'cover',
  },
});

export default ProfileButton;
