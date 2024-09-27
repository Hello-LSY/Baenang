import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../redux/authState';
import { useBusinessCard } from '../../redux/businessCardState';

const CreateBusinessCard = ({ navigation }) => {
  const { auth } = useAuth(); 
  const { createCard } = useBusinessCard(); 

  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [sns, setSns] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('Auth state:', auth); // auth 상태 확인
    if (auth.token && auth.memberId) {
      setIsReady(true);
    } else {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      navigation.navigate('Login');
    }
  }, [auth.token, auth.memberId]);
  

  const handleCreateCard = () => {
    if (!isReady) {
      alert('로그인 정보를 불러오는 중입니다.');
      return;
    }

    if (!name || !email) {
      alert('이름과 이메일을 입력해주세요.');
      return;
    }

    const businessCardData = { name, country, email, sns, introduction };
    createCard(auth.memberId, businessCardData) 
      .then(() => {
        alert('명함이 성공적으로 생성되었습니다.');
        navigation.navigate('BusinessCard');
      })
      .catch((error) => {
        console.error('명함 생성 중 오류:', error);
        alert('명함 생성 중 오류가 발생했습니다.');
      });
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
        disabled={!isReady || !name || !email} 
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
