import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'; // useDispatch와 useSelector 추가
import * as ImagePicker from 'expo-image-picker'; // 이미지 선택 라이브러리
import { updateBusinessCard, fetchBusinessCard } from '../../redux/businessCardSlice'; // 필요한 액션 임포트

// 이미지 업로드 함수 (로그 추가)
const uploadImage = async (imageUri, memberId) => {
  try {
    const formData = new FormData();
    const fileName = `${memberId}_${Date.now()}.jpg`;

    formData.append('file', {
      uri: imageUri,
      name: fileName,
      type: 'image/jpeg',
    });

    console.log('이미지 업로드 시작:', fileName);

    const response = await fetch('http://10.0.2.2:8080/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('이미지 업로드 실패');
    }

    const data = await response.json();
    console.log('이미지 업로드 성공, 반환된 파일명:', data.fileName);

    return data.fileName; // 파일 이름만 반환
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error);
    throw error;
  }
};

const UpdateBusinessCardScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { businessCard } = route.params;
  const auth = useSelector((state) => state.auth);

  const [name, setName] = useState(businessCard.name || '');
  const [country, setCountry] = useState(businessCard.country || '');
  const [email, setEmail] = useState(businessCard.email || '');
  const [sns, setSns] = useState(businessCard.sns || '');
  const [introduction, setIntroduction] = useState(businessCard.introduction || '');
  const [image, setImage] = useState(null); // 선택한 이미지 URI 상태
  const [imageUrl, setImageUrl] = useState(businessCard.imageUrl || null); // 기존 이미지 파일명

  const handleUpdateCard = async () => {
    const updatedBusinessCardData = { name, country, email, sns, introduction };
  
    try {
      console.log('명함 수정 시작');

      // 이미지가 선택된 경우에만 파일명을 저장
      if (image) {
        console.log('새로운 이미지 선택됨:', image);
        const uploadedFileName = await uploadImage(image, auth.memberId);
        updatedBusinessCardData.imageUrl = uploadedFileName; // 업로드된 파일명 저장
        console.log('업로드된 파일명:', uploadedFileName);
      } else {
        updatedBusinessCardData.imageUrl = imageUrl; // 기존 파일명 유지
        console.log('기존 파일명 사용:', imageUrl);
      }

      console.log('수정할 명함 데이터:', updatedBusinessCardData);

      // 명함 수정 API 호출
      await dispatch(updateBusinessCard({ cardId: businessCard.cardId, businessCardData: updatedBusinessCardData }));
      await dispatch(fetchBusinessCard(auth.memberId)); // 수정 후 명함 정보 다시 불러오기
      Alert.alert('성공', '명함이 성공적으로 수정되었습니다.');
      navigation.goBack();
    } catch (error) {
      console.error('명함 수정 중 오류:', error);
      Alert.alert('오류', '명함 수정 중 오류가 발생했습니다.');
    }
  };
  
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0]; // assets 배열에서 첫 번째 이미지 선택
      setImage(selectedImage.uri); // 이미지 URI 설정
      console.log('이미지 선택됨:', selectedImage.uri);
    } else {
      console.log('이미지 선택이 취소됨');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>명함 수정</Text>
      <TextInput
        style={styles.input}
        placeholder="이름"
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
        placeholder="이메일"
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
      {image && <Text>선택된 이미지: {String(image)}</Text>}
      <Button title="명함 수정" onPress={handleUpdateCard} />
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

export default UpdateBusinessCardScreen;
