import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('남자'); // 기본값을 '남자'로 설정
  const [birthdate, setBirthdate] = useState('');

  const handleSignup = async () => {
    if (!username || !password || !name || !email || !gender || !birthdate) {
      Alert.alert('Error', '모든 필드를 입력하세요.');
      return;
    }

    try {
      // 서버로 회원가입 요청 보내기
      console.log(email);
      const response = await axios.post('http://10.0.2.2:8080/api/members', {
        username,
        password,
        name,
        email,
        gender,
        birthdate,
      });

      if (response.status === 201) {
        Alert.alert('Success', '회원가입 성공');
        navigation.navigate('Login'); // 회원가입 후 로그인 화면으로 이동
      } else {
        Alert.alert('Error', '회원가입 실패');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('Error', '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>회원가입</Text>
        {/* <TextInput
        style={styles.input}
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
      /> */}
        <CustomInput
          label="아이디"
          value={username}
          onChangeText={setUsername}
        />
        {/* <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      /> */}
        <CustomInput
          label="비밀번호"
          value={password}
          onChangeText={setPassword}
          isPassword={true}
        />
        <CustomInput
          style={styles.input}
          label="이름"
          value={name}
          onChangeText={setName}
        />
        <CustomInput
          label="이메일"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.genderContainer}>
          <Text style={styles.genderLabel}>성별</Text>
          <View style={styles.radioButtonContainer}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setGender('남자')}
            >
              <View
                style={[
                  styles.radioOuterCircle,
                  gender === '남자' && styles.radioSelected,
                ]}
              >
                <View
                  style={[
                    styles.radioInnerCircle,
                    gender === '남자' && styles.radioSelectedInner,
                  ]}
                />
              </View>
              <Text style={styles.radioText}>남자</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => setGender('여자')}
            >
              <View
                style={[
                  styles.radioOuterCircle,
                  gender === '여자' && styles.radioSelected,
                ]}
              >
                <View
                  style={[
                    styles.radioInnerCircle,
                    gender === '여자' && styles.radioSelectedInner,
                  ]}
                />
              </View>
              <Text style={styles.radioText}>여자</Text>
            </TouchableOpacity>
          </View>
        </View>
        <CustomInput
          label="생년월일"
          value={birthdate}
          onChangeText={setBirthdate}
          isDate={true}
          style={styles.birthdateInput}
        />
      </View>
      <CustomButton
        title="확 인"
        onPress={handleSignup}
        style={styles.validationButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f8ff',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
    borderColor: '#87CEFA',
  },
  radioSelectedInner: {
    backgroundColor: '#87CEFA',
  },
  radioText: {
    fontSize: 16,
  },
  birthdateInput: {},
  validationButton: {
    width: '40%',
    marginTop: 30,
    backgroundColor: '#87CEFA',
  },
});

export default Signup;
