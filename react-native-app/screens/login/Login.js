// components/login/Login.js
import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../../services/AuthContext';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "아이디와 비밀번호를 입력하세요.");
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
        Alert.alert("Success", "로그인 성공");
        navigation.navigate('Home');
      } else {
        throw new Error('로그인 응답에 필수 정보가 없습니다.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Error', '로그인 실패');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>
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
      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  textInput: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  signupText: {
    color: 'blue',
    marginTop: 15,
  },
};

export default Login;
