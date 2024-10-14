import React, { useState } from 'react';
import { View, Text, Image, TextInput, Alert, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from 'react-redux';  // 추가
import { fetchBusinessCard } from '../../redux/businessCardSlice';
import { getApiClient } from '../../redux/apiClient';
import { useAuth } from '../../redux/authState';
import { MaterialIcons } from '@expo/vector-icons';

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

const CreateBusinessCardScreen = ({ navigation }) => {
  const dispatch = useDispatch();  // useDispatch를 사용해 dispatch 정의
  const { fullName, email, memberId, token } = useAuth();  // fullName을 가져옴
  const name = fullName;  // fullName을 name으로 변환
  const [country, setCountry] = useState('');
  const [snsPlatform, setSnsPlatform] = useState('');
  const [snsId, setSnsId] = useState('');
  const [introduction, setIntroduction] = useState('');
  const [image, setImage] = useState(null);
  const [imageFileName, setImageFileName] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [countryModalVisible, setCountryModalVisible] = useState(false);

  const countries = ['대한민국', '미국', '일본', '중국', '캐나다', '독일', '프랑스', '영국'];

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
      } catch (error) {
        Alert.alert('이미지 업로드 실패', '이미지 업로드 중 오류가 발생했습니다.');
      }
    } else {
      console.log('이미지 선택 취소');
    }
  };

  const handleSubmitCard = async () => {
    const snsInfo = `${snsPlatform}_${snsId}`; // SNS 플랫폼과 아이디 결합

    const businessCardData = {
      name,  // fullName을 name으로 변환하여 전송
      country,
      email,
      sns: snsInfo,
      introduction,
      imageUrl: imageFileName,
    };

    console.log("명함 데이터:", businessCardData);  // 데이터 확인

    try {
      const apiClient = getApiClient(token);
      const response = await apiClient.post(`/api/business-cards/members/${memberId}`, businessCardData);

      console.log("응답 데이터:", response);  // 응답 데이터 확인
      console.log("응답 상태 코드:", response.status);  // 응답 상태 코드 확인

      if (response.status === 200 || response.status === 201) {
        await dispatch(fetchBusinessCard(memberId));  // 명함 정보 갱신
        Alert.alert('성공', '명함이 성공적으로 생성되었습니다.');
        navigation.goBack();
      } else {
        console.log("응답 상태 코드가 200 또는 201이 아님:", response.status);
        Alert.alert('실패', '명함 생성 실패');
      }
    } catch (error) {
      console.error("명함 생성 중 오류 발생:", error);
      Alert.alert('오류', '명함 생성 중 오류가 발생했습니다.');
    }
  };

  const handleCountrySelect = (selectedCountry) => {
    setCountry(selectedCountry);
    setCountryModalVisible(false);
  };

  return (
    <View style={styles.container}>

      {/* 이미지 미리보기 또는 기본 회색 박스 */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.businessCardImage} />
        ) : (
          <View style={styles.placeholderImage}></View>
        )}
      </View>

      {/* 이미지 선택 버튼 */}
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>사진 선택</Text>
      </TouchableOpacity>

      {/* 국가 선택 버튼 */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="public" size={20} color="#3498db" style={styles.icon} />
        
        <Text style={styles.inputLabel}>국가</Text>
        <TouchableOpacity onPress={() => setCountryModalVisible(true)} style={styles.countryPickerButton}>
          <Text style={[styles.countryText, !country && styles.placeholderText]}>
            {country || '국가'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal for Country Selection */}
      <Modal
        transparent={true}
        visible={countryModalVisible}
        animationType="slide"
        onRequestClose={() => setCountryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: 300 }]}>
            <ScrollView contentContainerStyle={{ paddingVertical: 10 }}>
              {countries.map((countryName) => (
                <TouchableOpacity key={countryName} onPress={() => handleCountrySelect(countryName)}>
                  <Text style={styles.modalItem}>{countryName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* SNS 플랫폼 선택을 Modal로 변경 */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="person" size={20} color="#3498db" style={styles.icon} />
        <Text style={styles.inputLabel}>SNS</Text>
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
        <Text style={styles.inputLabel}>소개</Text>
        <TextInput
          style={styles.textInput}
          placeholder="소개"
          value={introduction}
          onChangeText={setIntroduction}
        />
      </View>

      {/* 명함 등록 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleSubmitCard} disabled={!imageFileName || !country}>
        <Text style={styles.buttonText}>등록하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center'
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
    width: '90%',
    height: 50,
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
    maxHeight: 300,
  },
  modalItem: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    height: 40,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 15,
  },
  countryText: {
    fontSize: 15,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  businessCardImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  placeholderImage: {
    width: 150,
    height: 150,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
  },
  inputLabel:{
    fontSize: 15,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  placeholderText: {
    color: '#ccc', // 회색 계열 색상
  },
});

export default CreateBusinessCardScreen;
