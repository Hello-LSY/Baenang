// components/login/Login.js
<<<<<<< HEAD
import React, { useState, useContext, useEffect, useRef } from 'react';
=======
import React, { useState, useContext } from 'react';
>>>>>>> dev

import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
<<<<<<< HEAD
  Animated,
  Easing,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../services/AuthContext';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
=======
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../services/AuthContext';
>>>>>>> dev

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
<<<<<<< HEAD
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
    outputRange: [0, 20],
  });
=======
>>>>>>> dev

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', '아이디와 비밀번호를 입력하세요.');
      return;
    }

    try {
      const response = await axios.post(
        'http://10.0.2.2:8080/login',
        { username, password },
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        }
      );

      const { token, memberId } = response.data;

      if (token && memberId) {
        await login(token, memberId);
        Alert.alert('Success', '로그인 성공');
        navigation.navigate('Home');
      } else {
        throw new Error('로그인 응답에 필수 정보가 없습니다.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', '로그인 실패');
    }
  };
  const handleSocialLogin = (platform) => {
    // 소셜 로그인 로직 구현
    console.log(`${platform} 로그인 시도`);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>여행의 좋은 추억을 간직해요</Text>
      </View>
<<<<<<< HEAD
      <Animated.View style={{ transform: [{ translateY: yOffset }] }}>
        <Image
          source={require('../../assets/images/baenang_logo.png')}
          style={styles.logo}
        />
      </Animated.View>
      <Text style={styles.login}>로그인</Text>
      <CustomInput
=======
      <View>
        <Image source={require('../../assets/images/Saly-31.png')} />
      </View>
      <Text style={styles.login}>로그인</Text>
      <TextInput
>>>>>>> dev
        style={styles.textInput}
        placeholder="ID"
        value={username}
        onChangeText={setUsername}
      />
<<<<<<< HEAD
      <CustomInput
=======
      <TextInput
>>>>>>> dev
        style={styles.textInput}
        placeholder="PASSWORD"
        value={password}
        onChangeText={setPassword}
<<<<<<< HEAD
        isPassword={true}
      />
      <CustomButton
        style={styles.loginButton}
        onPress={handleLogin}
        title="로그인"
      />
=======
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>
>>>>>>> dev

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>회원가입</Text>
      </TouchableOpacity>
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
<<<<<<< HEAD
    borderColor: '#87CEFA',
    color: '#87CEFA',
  },
  loginButton: {
    fontSize: 16,
    width: '40%',
=======
    borderWidth: 1,
    borderColor: '#87CEFA',
    borderRadius: 100,
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    color: '#87CEFA',
  },
  loginButton: {
    backgroundColor: '#87CEFA',
    borderRadius: 50,
    width: '40%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 15,
    paddingVertical: 10,
>>>>>>> dev
  },
  signupText: {
    color: '#87CEFA',
    marginTop: 15,
    fontSize: 16,
  },
  socialLoginContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  socialLoginText: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 10,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialButton: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
<<<<<<< HEAD
  logo: {
    width: 360,
    height: 180,
  },
});

export default Login;
=======
});

export default Login;
>>>>>>> dev
