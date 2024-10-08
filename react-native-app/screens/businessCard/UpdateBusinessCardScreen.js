import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';  
import { fetchBusinessCard, updateBusinessCard } from '../../redux/businessCardSlice'; // update 액션 추가
import { getApiClient } from '../../redux/apiClient';
import { useAuth } from '../../redux/authState';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

// 이미지 업로드 함수
const uploadImage = async (imageUri, memberId, token) => {
  try {
    const formData = new FormData();
    const fileName = `${memberId}_${Date.now()}.jpg`;

    formData.append('file', {
      uri: imageUri,
      name: fileName,
      type: 'image/jpeg',
    });

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

const UpdateBusinessCardScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { memberId, token } = useAuth();
  const { businessCardId } = route.params; // route에서 명함 ID를 받아옴

  const { businessCard } = useSelector((state) => state.businessCard);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [snsPlatform, setSnsPlatform] = useState('');
  const [snsId, setSnsId] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [image, setImage] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchBusinessCardData = async () => {
      try {
        await dispatch(fetchBusinessCard(memberId));
        if (businessCard) {
          setName(businessCard.fullName); 
          setEmail(businessCard.email); 
          setCountry(businessCard.country);
          setSnsPlatform(businessCard.sns.split('_')[0]);
          setSnsId(businessCard.sns.split('_')[1]);
          setIntroduction(businessCard.introduction);
          setImageFileName(businessCard.imageUrl);
        }
      } catch (error) {
        Alert.alert('오류', '명함 데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };
    fetchBusinessCardData();
  }, [businessCardId]);

  // 이미지 선택 후 업로드 처리 함수
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setImage(selectedImage.uri);  // 이미지 미리보기 용으로 URI 저장

      try {
        const uploadedFileName = await uploadImage(selectedImage.uri, memberId, token);
        setImageFileName(uploadedFileName);  // 업로드된 이미지 파일명 저장
      } catch (error) {
        Alert.alert('이미지 업로드 실패', '이미지 업로드 중 오류가 발생했습니다.');
      }
    } else {
      console.log('이미지 선택 취소');
    }
  };

  const handleUpdateCard = async () => {
    const snsInfo = `${snsPlatform}_${snsId}`; 

    const businessCardData = {
      name: businessCard.name,  
      email: businessCard.email,  
      country,
      sns: snsInfo,
      introduction,
      imageUrl: imageFileName || businessCard.imageUrl, // 이미지가 없으면 기존 이미지 사용
    };
    console.log(businessCardData)
    try {
      await dispatch(updateBusinessCard({ cardId: businessCardId, businessCardData }));
      Alert.alert('성공', '명함이 성공적으로 업데이트되었습니다.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('실패', '명함 업데이트 실패');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>명함 수정</Text>

      {/* 국가 선택 Picker */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="public" size={20} color="#3498db" style={styles.icon} />
        <Picker
          selectedValue={country}
          style={styles.input}
          onValueChange={(itemValue) => setCountry(itemValue)}
        >
          <Picker.Item label="국가를 선택하세요" value="" />
          <Picker.Item label="대한민국" value="대한민국" />
          <Picker.Item label="미국" value="미국" />
          <Picker.Item label="일본" value="일본" />
          <Picker.Item label="중국" value="중국" />
        </Picker>
      </View>

      {/* SNS 플랫폼 선택 */}
      <View style={styles.snsContainer}>
        <MaterialIcons name="person" size={20} color="#3498db" style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder="SNS 아이디"
          value={snsId}
          onChangeText={setSnsId}
        />
        <TouchableOpacity style={styles.snsPickerButton} onPress={() => setModalVisible(true)}>
          <Text>{snsPlatform || '플랫폼'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for SNS platform selection */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => { setSnsPlatform('Instagram'); setModalVisible(false); }}>
              <Text style={styles.modalItem}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSnsPlatform('Facebook'); setModalVisible(false); }}>
              <Text style={styles.modalItem}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSnsPlatform('Twitter'); setModalVisible(false); }}>
              <Text style={styles.modalItem}>Twitter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 소개 입력 */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="description" size={20} color="#3498db" style={styles.icon} />
        <TextInput
          style={styles.textInput}
          placeholder="소개"
          value={introduction}
          onChangeText={setIntroduction}
        />
      </View>

      {/* 이미지 선택 버튼 */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>이미지 선택</Text>
      </TouchableOpacity>
      {image && <Text>이미지 선택됨: {image}</Text>}
      {imageFileName && <Text>업로드된 이미지 파일명: {imageFileName}</Text>}

      {/* 명함 수정 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleUpdateCard}>
        <Text style={styles.buttonText}>명함 수정</Text>
      </TouchableOpacity>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
  },
  snsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
  },
  snsPickerButton: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalItem: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
  },
  textInput: {
    flex: 1,
    height: 40,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default UpdateBusinessCardScreen;
