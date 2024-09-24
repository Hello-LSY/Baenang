import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('남자'); // 기본값을 '남자'로 설정
  const [birthdate, setBirthdate] = useState('');

  const handleSignup = async () => {
    if (!username || !password || !name || !email || !gender || !birthdate) {
      Alert.alert("Error", "모든 필드를 입력하세요.");
      return;
    }

    try {
      // 서버로 회원가입 요청 보내기
      const response = await axios.post('http://10.0.2.2:8080/api/members', {
        username,
        password,
        name,
        email,
        gender,
        birthdate,
      });

      if (response.status === 201) {
        Alert.alert("Success", "회원가입 성공");
        navigation.navigate('Login'); // 회원가입 후 로그인 화면으로 이동
      } else {
        Alert.alert("Error", "회원가입 실패");
      }
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('Error', '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="이름"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.genderContainer}>
        <Text style={styles.genderLabel}>성별</Text>
        <View style={styles.radioButtonContainer}>
          <TouchableOpacity style={styles.radioButton} onPress={() => setGender('남자')}>
            <View style={[styles.radioOuterCircle, gender === '남자' && styles.radioSelected]}>
              <View style={[styles.radioInnerCircle, gender === '남자' && styles.radioSelectedInner]} />
            </View>
            <Text style={styles.radioText}>남자</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.radioButton} onPress={() => setGender('여자')}>
            <View style={[styles.radioOuterCircle, gender === '여자' && styles.radioSelected]}>
              <View style={[styles.radioInnerCircle, gender === '여자' && styles.radioSelectedInner]} />
            </View>
            <Text style={styles.radioText}>여자</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.input}
        placeholder="생년월일 (YYYY-MM-DD)"
        value={birthdate}
        onChangeText={setBirthdate}
      />
      <Button title="확 인" onPress={handleSignup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  genderContainer: {
    marginVertical: 12,
  },
  genderLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  radioOuterCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cccccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#f0f8ff',
  },
  radioSelected: {
    borderColor: '#2196F3',
  },
  radioSelectedInner: {
    backgroundColor: '#2196F3',
  },
  radioText: {
    fontSize: 16,
  },
});

export default Signup;
