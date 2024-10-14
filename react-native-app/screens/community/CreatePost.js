// screens/community/CreatePost.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ScrollView, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location'; // 위치 정보를 가져오기 위한 import
import { useSelector } from 'react-redux';
import { getApiClient } from '../../redux/apiClient';
import { Ionicons } from '@expo/vector-icons';
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

    // 이미지 경로에서 중복된 /uploads 제거
    return response.data.fileName.replace(/^\/uploads\//, '');
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error);
    throw error;
  }
};

const CreatePost = ({ navigation }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null); // 이미지 경로
  const [imageUri, setImageUri] = useState(null); // 실제 업로드할 이미지 URI
  const [location, setLocation] = useState(null); // 위치 정보

  // Redux에서 token, nickname, memberId 가져오기
  const { token, nickname, memberId } = useSelector((state) => state.auth);

  // 권한 요청 함수 (이미지 선택 및 위치 정보 권한)
  const requestPermissions = async () => {
    const { status: imageStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();

    if (imageStatus !== 'granted' || locationStatus !== 'granted') {
      Alert.alert('Permission Denied', '이미지 선택 및 위치 정보를 위해 권한이 필요합니다.');
    }
  };

  // 위치 정보 갱신 함수
  const watchLocation = async () => {
    try {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000, // 10초마다 위치 정보 갱신
          distanceInterval: 10, // 10미터마다 위치 정보 갱신
        },
        (location) => {
          setLocation(location.coords); // 갱신된 위치 정보 저장
        }
      );
    } catch (error) {
      Alert.alert('Location Error', '위치 정보를 갱신하는 중 오류가 발생했습니다.');
      console.error('Error watching location:', error);
    }
  };

  useEffect(() => {
    requestPermissions();
    watchLocation(); // 위치 정보 갱신 함수 호출
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
      setImageUri(selectedImage.uri); // 업로드할 이미지 URI 저장
      setImage(selectedImage.uri); // 선택한 이미지 보여주기
    } else {
      console.log('이미지 선택 취소');
    }
  };

  // 게시글 작성 함수
  const handleCreatePost = async () => {
    if (!content || !imageUri) {
      Alert.alert('Validation', '내용과 이미지를 모두 입력해주세요.');
      return;
    }

    if (!location) {
      Alert.alert('Location Error', '위치 정보를 가져올 수 없습니다.');
      return;
    }

    try {
      // 게시글 작성 시에 이미지 업로드
      const uploadedFileName = await uploadImage(imageUri, token);
      
      const postData = {
        content,
        imageNames: [uploadedFileName], // 업로드된 이미지 파일 이름
        nickname,
        memberId,
        latitude: location.latitude, // 위도 추가
        longitude: location.longitude, // 경도 추가
      };

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
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="당신의 이야기를 공유해보세요..."
          value={content}
          onChangeText={setContent}
          multiline
        />
        {image && (
          <Image source={{ uri: image }} style={styles.image} />
        )}
        <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
          <Ionicons name="image-outline" size={24} color="#66b2ff" />
          <Text style={styles.imagePickerText}>이미지 선택</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createPostButton} onPress={handleCreatePost}>
          <Ionicons name="checkmark-circle-outline" size={24} color="white" />
          <Text style={styles.createPostText}>게시글 작성</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f7f7f7', // 부드러운 배경색
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#ebf5ff', // 부드러운 파란색 배경
    padding: 10,
    borderRadius: 10,
  },
  imagePickerText: {
    color: '#66b2ff', // 부드러운 파란색 텍스트
    fontSize: 16,
    marginLeft: 10,
  },
  createPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#66b2ff', // 부드러운 파란색 버튼
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  createPostText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default CreatePost;
