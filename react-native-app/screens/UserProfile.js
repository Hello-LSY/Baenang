import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { checkPassword, updateProfile, fetchProfile } from '../redux/profileSlice';
import { BASE_URL } from '../constants/config';

const UserProfile = () => {
  const dispatch = useDispatch();
  const { profile, isPasswordChecked, isLoading } = useSelector(state => state.profile);

  const [password, setPassword] = useState('');
  const [languageSettings, setLanguageSettings] = useState(profile.languageSettings || 'korean');
  const [theme, setTheme] = useState(profile.theme || 'light');
  const [profilePicturePath, setProfilePicturePath] = useState(profile.profilePicturePath || '');
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    // 컴포넌트가 마운트되면 프로필 데이터를 가져옵니다.
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    // 프로필이 업데이트되면 그 값으로 상태를 업데이트합니다.
    if (profile) {
      setLanguageSettings(profile.languageSettings || 'korean');
      setTheme(profile.theme || 'light');
      setProfilePicturePath(profile.profilePicturePath || '');
    }
  }, [profile]);

  const handleCheckPassword = () => {
    if (password.trim() === '') {
      Alert.alert('비밀번호를 입력해주세요.');
      return;
    }
    dispatch(checkPassword({ password }))
      .unwrap()
      .then(() => {
        Alert.alert('비밀번호 확인 성공');
      })
      .catch(() => {
        Alert.alert('비밀번호가 일치하지 않습니다.');
      });
  };

  const handleSaveChanges = () => {
    if (!isPasswordChecked) {
      Alert.alert('먼저 비밀번호를 확인해주세요.');
      return;
    }

    const updatedProfile = {
      languageSettings,
      theme,
      profilePicturePath, // 이미지 경로 저장
    };

    dispatch(updateProfile(updatedProfile))
      .unwrap()
      .then(() => Alert.alert('변경사항이 저장되었습니다.'))
      .catch(() => Alert.alert('오류가 발생했습니다.'));
  };

 // 이미지 선택 함수
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const selectedImageUri = result.assets[0].uri;
    setImageUri(selectedImageUri);

    if (profile.profileId) {
      uploadImage(selectedImageUri, profile.profileId)
        .then((uploadedFileName) => {
          setProfilePicturePath(uploadedFileName); // 업로드 후 반환된 파일명을 저장
        })
        .catch(() => {
          Alert.alert('이미지 업로드 실패');
        });
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
    });

    if (!response.ok) {
      throw new Error("이미지 업로드 실패");
    }

    const data = await response.json();
    console.log("이미지 업로드 성공, 반환된 파일명:", data.fileName);

    return data.fileName; // 반환된 파일 이름
  } catch (error) {
    console.error("이미지 업로드 중 오류 발생:", error.message);
    throw error;
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>개인정보 변경</Text>

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
          <TouchableOpacity onPress={handleCheckPassword}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.checkButton}
            >
              <Text style={styles.buttonText}>비밀번호 확인</Text>
            </LinearGradient>
          </TouchableOpacity>
        </>
      )}

      {/* 프로필 정보 입력 */}
      {isPasswordChecked && (
        <>
          <View style={styles.inputContainer}>
            <Feather name="globe" size={20} color="#333" style={styles.icon} />
            <TextInput
              placeholder="언어 설정"
              value={languageSettings}
              onChangeText={setLanguageSettings}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Feather name="sun" size={20} color="#333" style={styles.icon} />
            <TextInput
              placeholder="테마 (light or black)"
              value={theme}
              onChangeText={setTheme}
              style={styles.input}
            />
          </View>

          <View style={styles.imageContainer}>
            {profilePicturePath ? (
              <Image source={{ uri: profilePicturePath }} style={styles.profileImage} />
            ) : (
              <Feather name="image" size={20} color="#333" style={styles.icon} />
            )}
          </View>

          <TouchableOpacity onPress={pickImage}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.imageButton}
            >
              <Text style={styles.buttonText}>프로필 사진 선택</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSaveChanges}>
            <LinearGradient
              colors={['#4facfe', '#00f2fe']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.saveButton}
            >
              <Text style={styles.buttonText}>변경사항 저장</Text>
            </LinearGradient>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
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
});

export default UserProfile;

