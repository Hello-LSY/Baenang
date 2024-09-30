import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';

// 이미지 업로드 함수
const uploadImage = async (imageUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    name: 'businessCardImage.jpg',
    type: 'image/jpeg',
  });

  // 로컬 서버로 이미지 업로드 요청
  const response = await fetch('http://10.0.2.2:8080/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('이미지 업로드 실패');
  }

  const data = await response.json();
  return data.imageUrl;  // 서버로부터 받은 이미지 URL을 반환
};

const CreateBusinessCardScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [sns, setSns] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [image, setImage] = useState(null);

  // Redux에서 memberId 및 토큰 가져오기
  const { memberId, token } = useSelector((state) => state.auth);

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

  const handleSubmitCard = async () => {
    if (!name || !email) {
      alert('이름과 이메일을 입력해주세요.');
      return;
    }

    let imageUrl = null;
    if (image) {
      try {
        // 이미지 업로드 후 URL 받기
        imageUrl = await uploadImage(image);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드 중 오류가 발생했습니다.');
        return;
      }
    }

    const businessCardData = {
      name,
      country,
      email,
      sns,
      introduction,
      imageUrl,  // 업로드된 이미지의 URL만 백엔드로 보냄
    };

    // 명함 생성 API 호출
    try {
      const response = await fetch(`http://10.0.2.2:8080/api/business-cards/members/${memberId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // 토큰 추가
        },
        body: JSON.stringify(businessCardData),
      });

      if (response.ok) {
        alert('명함이 성공적으로 생성되었습니다.');
        navigation.goBack();
      } else {
        alert('명함 생성 실패');
      }
    } catch (error) {
      console.error('명함 생성 중 오류:', error);
      alert('명함 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>명함 생성</Text>
      <TextInput style={styles.input} placeholder="이름" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="국가" value={country} onChangeText={setCountry} />
      <TextInput style={styles.input} placeholder="이메일" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="SNS" value={sns} onChangeText={setSns} />
      <TextInput style={styles.input} placeholder="소개" value={introduction} onChangeText={setIntroduction} />
      <Button title="이미지 선택" onPress={pickImage} />
      {image && <Text>이미지 선택됨: {image}</Text>}
      <Button title="명함 등록" onPress={handleSubmitCard} />
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

export default CreateBusinessCardScreen;
