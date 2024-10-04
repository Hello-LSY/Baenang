import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Text } from 'react-native';
import { useAuth } from '../../redux/authState';
import { getApiClient } from '../../redux/apiClient';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../../constants/config';

const EditPost = ({ route, navigation }) => {
  const { postId } = route.params;
  const [content, setContent] = useState('');

  // useAuth 훅에서 인증 정보를 가져옵니다.
  const { auth } = useAuth();
  const { token } = auth;

  // 게시글 수정 핸들러
  const handleEditPost = async () => {
    if (!content) {
      Alert.alert('Validation', '내용을 입력해주세요.');
      return;
    }

    const updatedPostData = {
      content,
      imageNames: [], // 이미지 수정 없이 빈 배열 전달
    };

    try {
      const apiClient = getApiClient(token);
      const response = await apiClient.put(`${BASE_URL}/api/posts/${postId}`, updatedPostData);
      if (response.status === 200) {
        Alert.alert('Success', '게시글이 성공적으로 수정되었습니다.');
        navigation.goBack();
      } else {
        const errorData = response.data;
        Alert.alert('Error', errorData.message || '게시글 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 수정 중 오류:', error);
      Alert.alert('Error', '게시글 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="내용을 수정해주세요..."
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TouchableOpacity style={styles.editPostButton} onPress={handleEditPost}>
          <Ionicons name="checkmark-circle-outline" size={24} color="white" />
          <Text style={styles.editPostText}>게시글 수정</Text>
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
  editPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#66b2ff', // 부드러운 파란색 버튼
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
  },
  editPostText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default EditPost;
