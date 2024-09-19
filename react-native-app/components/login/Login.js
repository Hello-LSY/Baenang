import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import qs from 'qs';  // URL-encoded 포맷을 사용하기 위해 qs 모듈 사용
import AsyncStorage from '@react-native-async-storage/async-storage';  // 토큰 저장용

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async () => {
    if (!username || !password) {
      Alert.alert("Error", "아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const response = await axios.post(
        'http://10.0.2.2:8080/login',  // API 엔드포인트
        qs.stringify({ username, password }),  // 데이터를 URL-encoded 형식으로 변환
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },  // URL-encoded 형식으로 보냄
        }
      );
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);  // 토큰을 AsyncStorage에 저장
      onLoginSuccess(token);  // 로그인 성공 시 호출
      Alert.alert("Success", "로그인 성공");
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error);
      Alert.alert("Error", "로그인 실패");
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={loginHandler} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
});

export default Login;
