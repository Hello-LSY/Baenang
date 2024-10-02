// components/login/Login.js
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
} from 'react-native';
import { useAuth } from '../../redux/authState';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, auth } = useAuth();

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
      navigation.navigate('Home');
    } else if (auth.error) {
      Alert.alert('Error', auth.error || '로그인 실패');
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

  signupText: {
    color: '#87CEFA',
    fontSize: 16,
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
