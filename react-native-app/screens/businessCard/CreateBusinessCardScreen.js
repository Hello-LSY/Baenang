// screens/businessCard/CreateBusinessCardScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../../redux/authState';
import { useBusinessCard } from '../../redux/businessCardState';
import * as ImagePicker from 'expo-image-picker';

const CreateBusinessCard = ({ navigation, route }) => {
  const { auth } = useAuth(); 
  const { createCard, updateCard } = useBusinessCard(); 
  const editing = route.params?.businessCard != null;
  const existingCard = route.params?.businessCard || {};

  const [name, setName] = useState(existingCard.name || '');
  const [country, setCountry] = useState(existingCard.country || '');
  const [email, setEmail] = useState(existingCard.email || '');
  const [sns, setSns] = useState(existingCard.sns || '');
  const [introduction, setIntroduction] = useState(existingCard.introduction || '');
  const [image, setImage] = useState(null); 
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (auth.token && auth.memberId) {
      setIsReady(true);
    } else {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      navigation.navigate('Login');
    }
  }, [auth.token, auth.memberId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const handleSubmitCard = () => {
    if (!isReady) {
      alert('로그인 정보를 불러오는 중입니다.');
      return;
    }

    if (!name || !email) {
      alert('이름과 이메일을 입력해주세요.');
      return;
    }

    const businessCardData = { 
      businessCardDTO: { name, country, email, sns, introduction },
      image: {
        uri: image,
        name: 'businessCardImage.jpg',
        type: 'image/jpeg',
      },
    };

    if (editing) {
      updateCard(existingCard.businessCardId, businessCardData)
        .then(() => {
          alert('명함이 성공적으로 수정되었습니다.');
          navigation.navigate('BusinessCard');
        })
        .catch((error) => {
          console.error('명함 수정 중 오류:', error);
          alert('명함 수정 중 오류가 발생했습니다.');
        });
    } else {
      createCard(auth.memberId, businessCardData)
        .then(() => {
          alert('명함이 성공적으로 생성되었습니다.');
          navigation.navigate('BusinessCard');
        })
        .catch((error) => {
          console.error('명함 생성 중 오류:', error);
          alert('명함 생성 중 오류가 발생했습니다.');
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{editing ? '명함 수정' : '명함 등록'}</Text>
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
      <Button title="이미지 선택" onPress={pickImage} />
      {image && <Text>이미지 선택됨</Text>}
      <Button
        title={editing ? '명함 수정' : '명함 등록'}
        onPress={handleSubmitCard}
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
