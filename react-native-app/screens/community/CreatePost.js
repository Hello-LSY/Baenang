import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, ScrollView, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux'; // useSelector 임포트
import { getApiClient } from '../../redux/apiClient'; // axios 클라이언트 가져오기
import { BASE_URL } from '../../constants/config';

// 이미지 업로드 함수
const uploadImage = async (imageUri, token) => {
  try {
    const formData = new FormData();
    const fileName = `${Date.now()}.jpg`;

    formData.append('file', {
      uri: imageUri,
      name: fileName,
      type: 'image/jpeg',
    });

    const apiClient = getApiClient(token);
    const response = await apiClient.post(`${BASE_URL}/api/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.data || !response.data.fileName) {
      throw new Error('이미지 업로드 실패');
    }

    return response.data.fileName;
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error);
    throw error;
  }
};

const CreatePost = ({ navigation }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);

  // Redux에서 token, nickname, memberId 가져오기
  const { token, nickname, memberId } = useSelector((state) => state.auth);

  // 권한 요청 함수
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', '이미지 선택을 위해서는 권한이 필요합니다.');
    }
  };

  useEffect(() => {
    requestPermission(); // 컴포넌트 마운트 시 권한 요청
  }, []);

  // 이미지 선택 함수
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);

      try {
        const uploadedFileName = await uploadImage(selectedImage.uri, token);
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

  // 게시글 작성 함수
  const handleCreatePost = async () => {
    if (!title || !content || !imageFileName) {
      Alert.alert('Validation', '제목, 내용, 이미지를 모두 입력해주세요.');
      return;
    }

    const postData = {
      title,
      content,
      imageNames: [imageFileName],
      nickname, // 닉네임 추가
      memberId, // memberId 추가
    };

    try {
      const apiClient = getApiClient(token);
      const response = await apiClient.post(`${BASE_URL}/api/posts/create`, postData);

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', '게시글이 성공적으로 작성되었습니다.');
        navigation.goBack();
      } else {
        const errorData = await response.data;
        Alert.alert('Error', errorData.message || '게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 작성 중 오류:', error);
      Alert.alert('Error', '게시글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="제목"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="내용"
        value={content}
        onChangeText={setContent}
      />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="이미지 선택" onPress={pickImage} />
      {imageFileName && <Text>업로드된 이미지 파일명: {imageFileName}</Text>}
      <Button title="게시글 작성" onPress={handleCreatePost} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default CreatePost;
