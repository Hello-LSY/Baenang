import React, { useState } from 'react';
import {
  View,
  TextInput,
  Alert,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import axios from 'axios';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';
import { BASE_URL } from '../../constants/config';

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('남자');
  const [birthdate, setBirthdate] = useState('');
  const [registrationNumberFirst, setRegistrationNumberFirst] = useState('');
  const [registrationNumberSecond, setRegistrationNumberSecond] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSignup = async () => {
    const cleanedRegistrationNumber = registrationNumberFirst + registrationNumberSecond;

    if (!username || !password || !name || !email || !gender || !birthdate || !cleanedRegistrationNumber || !nickname) {
      Alert.alert('Error', '모든 필드를 입력하세요.');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/members`, {
        username,
        password,
        name,
        email,
        gender,
        birthdate,
        registrationNumber: cleanedRegistrationNumber,
        nickname
      });

      if (response.status === 201) {
        Alert.alert('Success', '회원가입 성공');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', '회원가입 실패');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('Error', '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>회원가입</Text>
          <CustomInput
            label="아이디"
            value={username}
            onChangeText={setUsername}
          />
          <CustomInput
            label="비밀번호"
            value={password}
            onChangeText={setPassword}
            isPassword={true}
          />
          <CustomInput
            label="이름"
            value={name}
            onChangeText={setName}
          />
          <CustomInput
            label="이메일"
            value={email}
            onChangeText={setEmail}
          />
          <CustomInput
            label="닉네임"
            value={nickname}
            onChangeText={setNickname}
          />
          <View style={styles.registrationContainer}>
            <Text style={styles.registrationLabel}>주민등록번호</Text>
            <View style={styles.registrationFields}>
              <TextInput
                style={styles.registrationInput}
                value={registrationNumberFirst}
                onChangeText={(text) => setRegistrationNumberFirst(text.replace(/[^0-9]/g, '').slice(0, 6))}
                keyboardType="numeric"
                maxLength={6}
              />
              <Text style={styles.hyphen}>-</Text>
              <TextInput
                style={styles.registrationInput}
                value={registrationNumberSecond}
                onChangeText={(text) => setRegistrationNumberSecond(text.replace(/[^0-9]/g, '').slice(0, 7))}
                secureTextEntry={true}
                keyboardType="numeric"
                maxLength={7}
              />
            </View>
          </View>

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
          <CustomInput
            label="생년월일"
            value={birthdate}
            onChangeText={setBirthdate}
            isDate={true}
            style={styles.birthdateInput}
          />
        </View>
        <CustomButton title="확 인" onPress={handleSignup} style={styles.validationButton} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
  registrationContainer: {
    marginBottom: 16,
  },
  registrationLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  registrationFields: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  registrationInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 18,
    padding: 8,
    width: 100,
    textAlign: 'center',
  },
  hyphen: {
    fontSize: 18,
    marginHorizontal: 8,
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
