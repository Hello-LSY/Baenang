// screens/login/Login.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../redux/authState';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, auth } = useAuth(); // useAuth 훅을 통해 login 함수와 auth 상태 가져오기
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const yOffset = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  useEffect(() => {
    if (auth.token) {
      Alert.alert('Success', '로그인 성공');
      navigation.navigate('HomeScreen');
    } else if (auth.error) {
      // auth.error가 객체일 경우 message 필드를 정확하게 가져옴
      let errorMessage = auth.error?.message;
      if (typeof errorMessage === 'object') {
        errorMessage = errorMessage.message || '로그인 실패';
      }
      
      Alert.alert('Error', errorMessage || '로그인 실패');
    }
  }, [auth.token, auth.error, navigation]);
  
  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', '아이디와 비밀번호를 입력하세요.');
      return;
    }
    login(username, password);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>여행의 좋은 추억을 간직해요</Text>
      </View>
      <Animated.View style={{ transform: [{ translateY: yOffset }] }}>
        <Image
          source={require('../../assets/images/baenang_logo.png')}
          style={styles.logo}
        />
      </Animated.View>

      {/* 사용자 입력 */}
      <CustomInput
        style={styles.textInput}
        placeholder="ID"
        value={username}
        onChangeText={setUsername}
      />
      <CustomInput
        style={styles.textInput}
        placeholder="PASSWORD"
        value={password}
        onChangeText={setPassword}
        isPassword={true}
      />

      {/* 로딩 중인 경우 로딩 인디케이터 표시 */}
      {auth.loading ? (
        <ActivityIndicator size="large" color="#87CEFA" />
      ) : (
        <>
          {/* 로그인 버튼 */}
          <CustomButton
            style={styles.loginButton}
            onPress={handleLogin}
            title="로그인"
          />
          <CustomButton
            style={styles.signupButton}
            onPress={() => navigation.navigate('Signup')}
            title="회원가입"
          />
        </>
      )}

      {/* 소셜 로그인 */}
      <View style={styles.socialLoginContainer}>
        <Text style={styles.socialLoginText}>소셜 계정으로 로그인</Text>
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity onPress={() => handleSocialLogin('Naver')}>
            <Image
              source={require('../../assets/icons/naver_login.png')}
              style={styles.socialButton}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleSocialLogin('Kakao')}>
            <Image
              source={require('../../assets/icons/kakao_login.png')}
              style={styles.socialButton}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialLogin('Google')}>
            <Image
              source={require('../../assets/icons/google_login.png')}
              style={styles.socialButton}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#D9EEFF',
  },
  title: {
    fontSize: 14,
    color: '#777777',
  },
  login: {
    fontSize: 18,
    marginBottom: 20,
  },
  textInput: {
    width: '80%',
    borderColor: '#87CEFA',
    color: '#87CEFA',
  },
  loginButton: {
    width: '80%',
    backgroundColor: '#87CEFA',
  },
  signupButton: {
    width: '80%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#87CEFA',
  },
  logo: {
    width: 360,
    height: 180,
  },
  socialLoginContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    margin: 10,
  },
});

export default Login;
