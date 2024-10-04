import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Svg, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import DefaultProfileImage from '../assets/icons/profile-placeholder.png';

const BUTTON_SIZE = 50;
const IMAGE_SIZE = 40;

const AnimatedView = Animated.createAnimatedComponent(View);

const ProfileButton = ({ onPress, imageSource = DefaultProfileImage }) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <TouchableOpacity style={styles.profileButton} onPress={onPress}>
      <View style={styles.imageContainer}>
        <AnimatedView style={[styles.gradientCircleContainer, animatedStyle]}>
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
        <Image source={imageSource} style={styles.profileIcon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gradientCircleContainer: {
    position: 'absolute',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
  },
  profileIcon: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    resizeMode: 'cover',
  },
});

export default ProfileButton;
