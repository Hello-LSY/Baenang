import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { fetchBusinessCard } from '../../redux/businessCardSlice'; // Redux 액션 임포트
import { getApiClient } from '../../redux/apiClient'; // axios 클라이언트 가져오기
const uploadImage = async (imageUri, memberId, token) => {
  try {
    const formData = new FormData();
    const fileName = `${memberId}_${Date.now()}.jpg`;

    formData.append('file', {
      uri: imageUri,
      name: fileName,
      type: 'image/jpeg',
    });

    console.log('FormData 확인:', formData);

    const apiClient = getApiClient(token);

    const response = await apiClient.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status !== 200) {
      throw new Error('이미지 업로드 실패');
    }

    return response.data.fileName;
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error);
    throw error;
  }
};


const CreateBusinessCardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [sns, setSns] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [image, setImage] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);

  // Redux에서 memberId 및 토큰 가져오기
  const { memberId, token } = useSelector((state) => state.auth);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);

      try {
        const uploadedFileName = await uploadImage(selectedImage.uri, memberId, token);
        setImageFileName(uploadedFileName);
        console.log('이미지 업로드 성공:', uploadedFileName);
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        Alert.alert('이미지 업로드 실패', '이미지 업로드 중 오류가 발생했습니다.');
      }
    } else {
      console.log('이미지 선택 취소');
    }
  };

  const handleSubmitCard = async () => {
    console.log('사용 중인 토큰:', token);

    if (!name || !email || !imageFileName) {
      Alert.alert('입력 오류', '이름, 이메일, 이미지를 모두 입력해주세요.');
      return;
    }

    const businessCardData = {
      name,
      country,
      email,
      sns,
      introduction,
      imageUrl: imageFileName,
    };

    console.log('명함 데이터 전송:', businessCardData);

    try {
      const apiClient = getApiClient(token); // 토큰을 포함한 axios 인스턴스 생성
      const response = await apiClient.post(`/api/business-cards/members/${memberId}`, businessCardData);

      if (response.status === 200 || response.status === 201) {
        console.log('명함 생성 성공');
        await dispatch(fetchBusinessCard(memberId));
        Alert.alert('성공', '명함이 성공적으로 생성되었습니다.');
        navigation.goBack();
      } else {
        console.error('명함 생성 실패');
        Alert.alert('실패', '명함 생성 실패');
      }
    } catch (error) {
      console.error('명함 생성 중 오류:', error);
      Alert.alert('오류', '명함 생성 중 오류가 발생했습니다.');
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
      {image && <Text>이미지 선택됨: {String(image)}</Text>}
      {imageFileName && <Text>업로드된 이미지 파일명: {String(imageFileName)}</Text>}
      <Button title="명함 등록" onPress={handleSubmitCard} disabled={!name || !email || !imageFileName} />
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
