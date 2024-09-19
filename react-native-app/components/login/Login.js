import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import qs from 'qs';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const loginHandler = async () => {
    if (!username || !password) {
      Alert.alert("Error", "id와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const response = await axios.post(
        'http://10.0.2.2:8080/login',
        qs.stringify({ username, password }),  // 데이터를 URL-encoded 형식으로 변환
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },  // Content-Type을 x-www-form-urlencoded로 설정
        }
      );
      const token = response.data.token;
      onLoginSuccess(token);
      Alert.alert("Success", "로그인 완료");
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

export default Login;

const styles = StyleSheet.create({
  inputContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
});
