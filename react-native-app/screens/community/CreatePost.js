import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, Text, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BASE_URL } from '../../constants/config';

// 이미지 업로드 함수
const uploadImage = async (imageUri) => {
  try {
    const formData = new FormData();
    const fileName = `${Date.now()}.jpg`;  // 고유한 파일명 생성

    formData.append('file', {
      uri: imageUri,
      name: fileName,
      type: 'image/jpeg',
    });

    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('이미지 업로드 실패');
    }

    const data = await response.json();
    return data.fileName;  // 파일 이름만 반환
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error);
    throw error;
  }
};

const CreatePost = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);  // 이미지 URI 상태
  const [imageFileName, setImageFileName] = useState(null);  // 업로드된 이미지 파일명

  // 권한 요청 함수
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', '이미지 선택을 위해서는 권한이 필요합니다.');
    }
  };

  useEffect(() => {
    requestPermission();  // 컴포넌트 마운트 시 권한 요청
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
        const uploadedFileName = await uploadImage(selectedImage.uri);
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
    if (!title || !content) {
      Alert.alert('Validation', '제목, 내용, 이미지를 모두 입력해주세요.');
      return;
    }

    const postData = {
      title,
      content,
      imageNames: [imageFileName],  // 업로드된 이미지 파일명을 전송
    };

    console.log('게시글 데이터 전송:', postData);

    try {
      const response = await fetch(`${BASE_URL}/api/posts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', '게시글이 성공적으로 작성되었습니다.');
        navigation.goBack();
      } else {
        const errorData = await response.json();
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

      {/* 이미지 미리보기 */}
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
