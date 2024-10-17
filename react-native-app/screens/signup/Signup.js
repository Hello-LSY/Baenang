import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import Toast from 'react-native-toast-message'; // Toast import
import { BASE_URL } from '../../constants/config'; // 서버 URL

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('남자');
  const [birthYear, setBirthYear] = useState('2024');
  const [birthMonth, setBirthMonth] = useState('01');
  const [birthDay, setBirthDay] = useState('01');
  const [registrationNumberFirst, setRegistrationNumberFirst] = useState('');
  const [registrationNumberSecond, setRegistrationNumberSecond] = useState('');
  const [nickname, setNickname] = useState('');
  const [openYear, setOpenYear] = useState(false);
  const [openMonth, setOpenMonth] = useState(false);
  const [openDay, setOpenDay] = useState(false);

  // 중복 체크 버튼 활성화 상태
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isNicknameValid, setIsNicknameValid] = useState(false);

  // 입력 값에 따른 버튼 활성화
  useEffect(() => {
    setIsUsernameValid(username.length > 0);
    setIsEmailValid(email.length > 0);
    setIsNicknameValid(nickname.length > 0);
  }, [username, email, nickname]);

  // Toast 메시지 함수
  const showToast = (type, text1, text2) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'top',
    });
  };

  // 중복 체크 함수
  const checkDuplicate = async (field, value) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/members/check-${field}`, {
        params: { [field]: value },
      });

      if (response.data) {
        showToast('error', 'Error', `${field}이(가) 이미 사용 중입니다.`);
      } else {
        showToast('success', 'Success', `사용 가능한 ${field}입니다.`);
      }
    } catch (error) {
      showToast('error', 'Error', `${field} 확인 중 오류가 발생했습니다.`);
    }
  };

  const handleSignup = async () => {
    if (
      !username ||
      !password ||
      !fullName ||
      !email ||
      !gender ||
      !birthYear ||
      !birthMonth ||
      !birthDay ||
      !registrationNumberFirst ||
      !registrationNumberSecond ||
      !nickname
    ) {
      showToast('error', 'Error', '모든 필드를 입력하세요.');
      return;
    }

    const birthdate = `${birthYear}-${birthMonth}-${birthDay}`;
    const cleanedRegistrationNumber =
      registrationNumberFirst + registrationNumberSecond;

    try {
      const response = await axios.post(`${BASE_URL}/api/members`, {
        username,
        password,
        fullName,
        email,
        gender,
        birthdate,
        registrationNumber: cleanedRegistrationNumber,
        nickname,
      });

      if (response.status === 201) {
        showToast('success', 'Success', '회원가입 성공');
        navigation.navigate('Login');
      } else {
        showToast('error', 'Error', '회원가입 실패');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      showToast('error', 'Error', '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>회원가입</Text>

          {/* 아이디 입력 및 중복 체크 */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="아이디"
              value={username}
              onChangeText={setUsername}
            />
            <TouchableOpacity
              style={[styles.checkButton, { backgroundColor: isUsernameValid ? '#87CEFA' : '#ccc' }]}
              onPress={() => checkDuplicate('username', username)}
              disabled={!isUsernameValid}
            >
              <Text style={styles.checkButtonText}>중복 체크</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <TextInput
            style={styles.input}
            placeholder="이름"
            value={fullName}
            onChangeText={setFullName}
          />

          {/* 이메일 입력 및 중복 체크 */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={[styles.checkButton, { backgroundColor: isEmailValid ? '#87CEFA' : '#ccc' }]}
              onPress={() => checkDuplicate('email', email)}
              disabled={!isEmailValid}
            >
              <Text style={styles.checkButtonText}>중복 체크</Text>
            </TouchableOpacity>
          </View>

          {/* 닉네임 입력 및 중복 체크 */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="닉네임"
              value={nickname}
              onChangeText={setNickname}
            />
            <TouchableOpacity
              style={[styles.checkButton, { backgroundColor: isNicknameValid ? '#87CEFA' : '#ccc' }]}
              onPress={() => checkDuplicate('nickname', nickname)}
              disabled={!isNicknameValid}
            >
              <Text style={styles.checkButtonText}>중복 체크</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registrationContainer}>
            <Text style={styles.label}>주민등록번호</Text>
            <View style={styles.registrationFields}>
              <TextInput
                style={styles.registrationInput}
                value={registrationNumberFirst}
                onChangeText={(value) => setRegistrationNumberFirst(value)}
                keyboardType="numeric"
                maxLength={6}
              />
              <Text style={styles.hyphen}>-</Text>
              <TextInput
                style={styles.registrationInput}
                value={registrationNumberSecond}
                onChangeText={setRegistrationNumberSecond}
                secureTextEntry={true}
                keyboardType="numeric"
                maxLength={7}
              />
            </View>
          </View>

          {/* 성별 선택 */}
          <View style={styles.genderContainer}>
            <Text style={styles.label}>성별</Text>
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

          {/* 출생년도, 월, 일 */}
          
          <Text style={styles.label}>생년월일</Text>
          <View style={styles.birthDateContainer}>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>년도</Text>
              <DropDownPicker
                open={openYear}
                value={birthYear}
                items={Array.from({ length: 2024 - 1930 + 1 }, (_, index) => ({
                  label: `${1930 + index}`,
                  value: `${1930 + index}`,
                }))}
                setOpen={setOpenYear}
                setValue={setBirthYear}
                style={styles.picker}
              />
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>월</Text>
              <DropDownPicker
                open={openMonth}
                value={birthMonth}
                items={Array.from({ length: 12 }, (_, index) => ({
                  label: `${index + 1}`,
                  value: `${String(index + 1).padStart(2, '0')}`,
                }))}
                setOpen={setOpenMonth}
                setValue={setBirthMonth}
                style={styles.picker}
              />
            </View>
            <View style={styles.pickerContainer}>
              <Text style={styles.pickerLabel}>일</Text>
              <DropDownPicker
                open={openDay}
                value={birthDay}
                items={Array.from({ length: 31 }, (_, index) => ({
                  label: `${index + 1}`,
                  value: `${String(index + 1).padStart(2, '0')}`,
                }))}
                setOpen={setOpenDay}
                setValue={setBirthDay}
                style={styles.picker}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSignup}>
            <Text style={styles.saveButtonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
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
    shadowOffset: { width: 0, height: 2 },
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
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  registrationContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 20,
    fontWeight: 'bold'
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
  genderContainer: {
    marginBottom: 16,
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
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioInnerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F0F8FF',
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
  birthDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#87CEEB',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Signup; 
