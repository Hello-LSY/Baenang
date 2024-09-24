import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import BusinessCardService from '../../services/BusinessCardService'; // 서비스 파일에서 모듈 가져오기
import tokenStorage from '../../services/tokenStorage'; // tokenStorage 가져오기

const CreateBusinessCard = ({ navigation }) => {
  const [token, setToken] = useState('');
  const [memberId, setMemberId] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [sns, setSns] = useState('');
  const [introduction, setIntroduction] = useState('');

  // 컴포넌트가 마운트될 때 token과 memberId를 가져오는 함수
  useEffect(() => {
    const fetchCredentials = async () => {
      try {
        const { token, memberId } = await tokenStorage.getCredentials();
        if (token && memberId) {
          setToken(token);
          setMemberId(memberId);
        } else {
          alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
          navigation.navigate('Login'); // 로그인 화면으로 이동
        }
      } catch (error) {
        console.error('Failed to fetch credentials:', error);
      }
    };

    fetchCredentials();
  }, [navigation]);

  const handleCreateCard = async () => {
    if (!token || !memberId) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      console.log("Token or Member ID is missing.", { token, memberId });
      return;
    }

    if (!name || !email) { // 필수 입력값 체크
      alert('이름과 이메일을 입력해주세요.');
      return;
    }

    const businessCardData = { name, country, email, sns, introduction };
    console.log("Creating business card with data:", businessCardData);

    try {
      const response = await BusinessCardService.createBusinessCard(token, memberId, businessCardData);
      console.log("Business card creation response:", response);

      if (response) {
        alert('명함이 성공적으로 생성되었습니다.');
        navigation.navigate('BusinessCard', { refresh: true }); // 명함 생성 후 BusinessCardScreen으로 이동
      } else {
        alert('명함 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error creating business card:', error);
      alert('명함 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>명함 등록</Text>
      <TextInput
        style={styles.input}
        placeholder="이름 (필수)"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="국가"
        value={country}
        onChangeText={setCountry}
      />
      <TextInput
        style={styles.input}
        placeholder="이메일 (필수)"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="SNS"
        value={sns}
        onChangeText={setSns}
      />
      <TextInput
        style={styles.input}
        placeholder="소개"
        value={introduction}
        onChangeText={setIntroduction}
      />
      <Button
        title="명함 등록"
        onPress={handleCreateCard}
        disabled={!name || !email} // 필수 입력값이 없을 때 버튼 비활성화
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5, 
  },
});

export default CreateBusinessCard;
