import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';

// 이미지 업로드 함수
const uploadImage = async (imageUri, memberId) => {
  try {
    const formData = new FormData();

    // memberId와 타임스탬프를 조합하여 파일명을 생성
    const fileName = `${memberId}_${Date.now()}.jpg`;

    formData.append('file', {
      uri: imageUri,
      name: fileName, // 생성한 파일명을 사용
      type: 'image/jpeg',
    });

    console.log('FormData for image upload:', formData); // 업로드 데이터를 로그로 확인

    // 로컬 서버로 이미지 업로드 요청
    const response = await fetch('http://10.0.2.2:8080/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('이미지 업로드 실패:', response.statusText); // 에러 로그
      throw new Error('이미지 업로드 실패');
    }

    const data = await response.json();
    console.log('업로드된 이미지 URL:', data.imageUrl); // 업로드된 이미지 URL 로그 출력
    return data.imageUrl; // 서버로부터 받은 이미지 URL을 반환
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error);
    throw error; // 에러를 던져서 상위에서 처리할 수 있도록 함
  }
};

const CreateBusinessCardScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [sns, setSns] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // 이미지 URL 상태 추가

  // Redux에서 memberId 및 토큰 가져오기
  const { memberId, token } = useSelector((state) => state.auth);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('이미지 선택 결과:', result); // 전체 결과 로그 출력

    if (!result.cancelled) {
      setImage(result.uri);
      console.log('이미지 선택됨:', result.uri); // 선택된 이미지 경로를 로그로 출력

      try {
        // 이미지 업로드 후 URL 받기
        const uploadedImageUrl = await uploadImage(result.uri, memberId);
        setImageUrl(uploadedImageUrl);
        console.log('이미지 업로드 성공:', uploadedImageUrl); // 성공 시 URL 로그 출력
      } catch (error) {
        console.error('이미지 업로드 실패:', error); // 에러 로그 출력
        Alert.alert('이미지 업로드 실패', '이미지 업로드 중 오류가 발생했습니다.');
      }
    } else {
      console.log('이미지 선택 취소');
    }
  };

  const handleSubmitCard = async () => {
    if (!name || !email || !imageUrl) {
      Alert.alert('입력 오류', '이름, 이메일, 이미지를 모두 입력해주세요.');
      return;
    }

    const businessCardData = {
      name,
      country,
      email,
      sns,
      introduction,
      imageUrl, // 업로드된 이미지의 URL만 백엔드로 보냄
    };

    console.log('명함 데이터 전송:', businessCardData); // 전송할 데이터 로그 출력

    // 명함 생성 API 호출
    try {
      const response = await fetch(`http://10.0.2.2:8080/api/business-cards/members/${memberId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 토큰 추가
        },
        body: JSON.stringify(businessCardData),
      });

      if (response.ok) {
        console.log('명함 생성 성공');
        Alert.alert('성공', '명함이 성공적으로 생성되었습니다.');
        navigation.goBack();
      } else {
        console.error('명함 생성 실패');
        Alert.alert('실패', '명함 생성 실패');
      }
    } catch (error) {
      console.error('명함 생성 중 오류:', error); // 명함 생성 실패 시 로그 출력
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
      {imageUrl && <Text>업로드된 이미지 URL: {String(imageUrl)}</Text>} 
      <Button title="명함 등록" onPress={handleSubmitCard} disabled={!imageUrl} />
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
