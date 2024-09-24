// components/login/Login.js
import React, { useState, useContext } from 'react';

import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../services/AuthContext';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

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
      <View>
        <Image source={require('../../assets/images/Saly-31.png')} />
      </View>
      <Text style={styles.login}>로그인</Text>
      <TextInput
        style={styles.textInput}
        placeholder="ID"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.textInput}
        placeholder="PASSWORD"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>LOGIN</Text>
      </TouchableOpacity>

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
});

export default Login;