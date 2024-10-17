import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { checkPassword, updateProfile, fetchProfile, resetPasswordCheck } from '../redux/profileSlice';
import { BASE_URL, S3_URL } from '../constants/config'; // S3_URL 추가
import { useNavigation } from '@react-navigation/native';
import defaultProfileImage from '../assets/icons/default-profile.png'; 

const UserProfile = ( ) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { profile, isPasswordChecked, isLoading } = useSelector(state => state.profile);

  const [password, setPassword] = useState('');
  const [languageSettings, setLanguageSettings] = useState('korean');
  const [theme, setTheme] = useState('light');
  const [profilePicture, setProfilePicture] = useState(defaultProfileImage);
  const [imageUri, setImageUri] = useState(null);

  // 모달 상태 관리
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  const languages = ['Korean', 'English', 'Chinese'];
  const themes = ['Light', 'Dark'];

  useEffect(() => {
    // 컴포넌트가 마운트되면 프로필 데이터를 가져옵니다.
    dispatch(fetchProfile());
    return () => {
      dispatch(resetPasswordCheck());  // 비밀번호 확인 상태 초기화
    };
  }, [dispatch]);

  useEffect(() => {
    // 프로필 이미지 경로가 있으면 해당 경로로 설정, 없으면 기본 이미지 설정
    if (profile?.profilePicturePath) {
      setProfilePicture({ uri: `${S3_URL}/${profile.profilePicturePath}` }); // URL 경로로 이미지 불러옴
    } else {
      setProfilePicture(defaultProfileImage); // 없으면 기본 이미지 설정
    }

    // 프로필이 업데이트되면 그 값으로 상태를 업데이트합니다.
    if (profile) {
      setLanguageSettings(profile.languageSettings || 'korean');
      setTheme(profile.theme || 'light');
    }
  }, [profile]);

  const handleCheckPassword = async () => {
    if (password.trim() === '') {
      Alert.alert('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const result = await dispatch(checkPassword({ password })).unwrap();
      if (result) {
        // Alert.alert('비밀번호 확인 성공');
      } else {
        Alert.alert('비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      Alert.alert('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleSaveChanges = () => {
    if (!isPasswordChecked) {
      Alert.alert('먼저 비밀번호를 확인해주세요.');
      return;
    }
  
    const updatedProfile = {
      languageSettings,
      theme,
      profilePicturePath: profilePicture.uri ? profilePicture.uri.replace(S3_URL + '/', '') : profile.profilePicturePath, // 새로운 경로 사용
    };
  
    dispatch(updateProfile(updatedProfile))
      .unwrap()
      .then((response) => {
        Alert.alert('변경사항이 저장되었습니다.', '', [
          {
            text: '확인',
            onPress: () => navigation.goBack(), // '확인'을 누르면 뒤로가기
          },
        ]);
      })
      .catch((error) => {
        Alert.alert('오류가 발생했습니다.');
      });
  };

 // 이미지 선택 함수
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const selectedImageUri = result.assets[0].uri;
    setImageUri(selectedImageUri);

    if (profile.profileId) {
      // 업로드가 완료된 후에 setProfilePicture를 호출하고 알림을 띄움
      try {
        const uploadedFileName = await uploadImage(selectedImageUri, profile.profileId);
        setProfilePicture({ uri: `${S3_URL}/${uploadedFileName}` }); // 업로드된 이미지로 프로필 이미지 설정
        // Alert.alert('이미지 업로드 성공', '이미지가 성공적으로 업로드되었습니다.');
      } catch (error) {
        Alert.alert('이미지 업로드 실패', '이미지 업로드 중 오류가 발생했습니다.');
      }
    } else {
      Alert.alert('프로필 ID가 없습니다. 다시 시도해 주세요.');
    }
  }
};

// 이미지 업로드 함수
const uploadImage = async (imageUri, profileId) => {
  try {
    const formData = new FormData();
    const fileName = `${profileId}_${Date.now()}.jpg`; // profileId를 파일명에 사용

    formData.append("file", {
      uri: imageUri, // 이미지 경로 처리
      name: fileName,
      type: "image/jpeg",
    });

    console.log("이미지 업로드 시작:", fileName);

    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.status >= 200 && response.status < 300) {
      const data = await response.json();
      console.log("이미지 업로드 성공, 반환된 파일명:", data.fileName);
      return data.fileName; // 반환된 파일 이름
    } else {
      const errorData = await response.text();
      console.error("이미지 업로드 오류:", errorData);
      throw new Error(`이미지 업로드 실패: ${response.statusText}`);
    }
  } catch (error) {
    console.error("이미지 업로드 중 오류 발생:", error.message);
    throw error;
  }
};

  const handleLanguageSelect = (selectedLanguage) => {
    setLanguageSettings(selectedLanguage.toLowerCase());
    setLanguageModalVisible(false);
  };

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme.toLowerCase());
    setThemeModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>프로필 관리</Text>

      {/* 비밀번호 확인 */}
      {!isPasswordChecked && (
        <>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#333" style={styles.icon} />
            <TextInput
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
          </View>
          <TouchableOpacity onPress={handleCheckPassword}  style={styles.checkButton}>
              <Text style={styles.buttonText}>비밀번호 확인</Text>
          </TouchableOpacity>
        </>
      )}

      {/* 프로필 정보 입력 */}
      {isPasswordChecked && (
        <>
          {/* 프로필 이미지 원형 틀 */}
          <View style={styles.profileImageContainer}>
            <Image source={profilePicture} style={styles.profileImage} />
            {/* 연필 아이콘 클릭 시 이미지 선택 */}
            <TouchableOpacity style={styles.editIconContainer} onPress={pickImage}>
              <Feather name="edit" size={18} color="#fff" style={styles.editIcon} />
            </TouchableOpacity>
          </View>

          {/* 언어 설정 */}
          <Text style={styles.label}>언어</Text>
          <View style={styles.inputContainer}>
            <Feather name="globe" size={20} color="#333" style={styles.icon} />
            <TouchableOpacity onPress={() => setLanguageModalVisible(true)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>{languageSettings.charAt(0).toUpperCase() + languageSettings.slice(1)}</Text>
            </TouchableOpacity>
          </View>

          {/* 언어 선택 모달 */}
          <Modal
            transparent={true}
            visible={languageModalVisible}
            animationType="slide"
            onRequestClose={() => setLanguageModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView>
                  {languages.map((language) => (
                    <TouchableOpacity key={language} onPress={() => handleLanguageSelect(language)}>
                      <Text style={styles.modalItem}>{language}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* 테마 설정 선택 모달 */}
          <Text style={styles.label}>테마</Text>
          <View style={styles.inputContainer}>
            <Feather name="sun" size={20} color="#333" style={styles.icon} />
            <TouchableOpacity onPress={() => setThemeModalVisible(true)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</Text>
            </TouchableOpacity>
          </View>

          {/* 테마 선택 모달 */}
          <Modal
            transparent={true}
            visible={themeModalVisible}
            animationType="slide"
            onRequestClose={() => setThemeModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <ScrollView>
                  {themes.map((theme) => (
                    <TouchableOpacity key={theme} onPress={() => handleThemeSelect(theme)}>
                      <Text style={styles.modalItem}>{theme}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>

          {/* <View style={styles.imageContainer}>
            {profilePicturePath ? (
              <Image source={{ uri: profilePicturePath }} style={styles.profileImage} />
            ) : (
              <Feather name="image" size={20} color="#333" style={styles.icon} />
            )}
          </View> */}
{/* 
          <TouchableOpacity onPress={pickImage}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.imageButton}
            >
              <Text style={styles.buttonText}>프로필 사진 선택</Text>
            </LinearGradient>
          </TouchableOpacity> */}

          <TouchableOpacity onPress={handleSaveChanges} style={styles.saveButton}>
              <Text style={styles.buttonText}>변경사항 저장</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  checkButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: '#4FACFE',
    width: '100%',
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#4FACFE',
    width: '100%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  imageButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalItem: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 10,
  },
  profileImageContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    position: 'relative',
    overflow: 'hidden',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 15, // 아이콘이 너무 짤리지 않도록 위치 조정
    right: 10,
    backgroundColor: '#4FACFE',
    borderRadius: 15,
    padding: 5,
  },
  editIcon: {
    color: '#fff',
  },
});

export default UserProfile;

