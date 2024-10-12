import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { fetchTravelCertificates } from '../../redux/travelCertificatesSlice';

const requestPermissions = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  const mediaStatus = await MediaLibrary.requestPermissionsAsync();

  if (status !== 'granted' || mediaStatus.status !== 'granted') {
    alert('카메라 및 파일 시스템 권한이 필요합니다.');
    return false;
  }
  return true;
};

const uploadImage = async (imageUri, travelid) => {
  try {
    const formData = new FormData();
    const fileName = `${travelid}_${Date.now()}.jpg`;

    formData.append('file', {
      uri: imageUri.startsWith('file://') ? imageUri : `file://${imageUri}`,
      name: fileName,
      type: 'image/jpeg',
    });

    console.log('이미지 업로드 시작:', fileName);

    const response = await fetch('http://10.0.2.2:8080/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('이미지 업로드 실패');
    }

    const data = await response.json();
    console.log('이미지 업로드 성공, 반환된 파일명:', data.fileName);

    return data.fileName;
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error);
    throw error;
  }
};

const TravelCertificationProcess = () => {
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [visitedCountry, setVisitedCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  const username = 'exampleUser';
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const userFolder = `${FileSystem.documentDirectory}${username}/`;

  useEffect(() => {
    getLocationAndCountry();
  }, []);

  const createUserFolder = async () => {
    const folderExists = await FileSystem.getInfoAsync(userFolder);
    if (!folderExists.exists) {
      await FileSystem.makeDirectoryAsync(userFolder, { intermediates: true });
    }
  };

  const getLocationAndCountry = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('위치 권한이 필요합니다.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      let geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocode.length > 0) {
        const country = geocode[0].country;
        const region = geocode[0].region;
        setVisitedCountry(`${country}-${region}`);
        setLoading(false);
      } else {
        alert('국가 정보를 가져올 수 없습니다.');
      }
    } catch (error) {
      console.error('위치 정보 가져오기 오류:', error);
      alert('위치 정보를 가져오는 중 오류가 발생했습니다.');
    }
  };

  const takePhoto = async () => {
    try {
      const permissionsGranted = await requestPermissions();
      if (!permissionsGranted) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await createUserFolder();

        const fileExtension = uri.split('.').pop();
        const newFilePath = `${userFolder}photo_${Date.now()}.${fileExtension}`;

        await FileSystem.moveAsync({
          from: uri,
          to: newFilePath,
        });

        setImageUri(newFilePath);
        console.log('Image URI set:', newFilePath);
        alert('사진이 Baenang 폴더의 사용자 폴더에 저장되었습니다.');
      }
    } catch (error) {
      console.error('카메라 실행 오류:', error);
      alert('카메라를 실행할 수 없습니다. 실제 기기에서 시도하세요.');
    }
  };

  const handleSave = async () => {
    if (!imageUri || !location || !visitedCountry) {
      alert('사진과 위치 정보가 필요합니다.');
      return;
    }

    try {
      const uploadedFileName = await uploadImage(imageUri, username);
      console.log('업로드된 파일명:', uploadedFileName);

      const currentTime = new Date()
        .toISOString()
        .replace('T', ' ')
        .split('.')[0];
      const data = {
        username,
        imagepath: uploadedFileName,
        latitude: location.latitude,
        longitude: location.longitude,
        visitedcountry: visitedCountry,
        traveldate: currentTime,
      };

      console.log('서버로 전송할 데이터:', data);

      const response = await axios.post(
        'http://10.0.2.2:8080/api/travel-certificates/save',
        data
      );

      if (response.status === 201) {
        console.log('서버 응답 데이터:', JSON.stringify(response.data));
        Alert.alert(
          '인증 완료',
          '사진과 위치가 데이터베이스에 저장되었습니다.'
        );
        dispatch(fetchTravelCertificates());
        navigation.navigate('TravelCertificationList');
      } else {
        console.log('서버 응답 상태 코드:', response.status);
        const errorText = JSON.stringify(response.data);
        throw new Error(`데이터 전송 실패: ${errorText}`);
      }
    } catch (error) {
      console.error('데이터 저장 오류:', error);
      if (error.response) {
        console.log('서버 응답 데이터:', JSON.stringify(error.response.data));
        Alert.alert(
          '저장 실패',
          `서버 오류: ${JSON.stringify(error.response.data)}`
        );
      } else {
        Alert.alert(
          '저장 실패',
          `데이터베이스에 저장하는 데 실패했습니다. 오류: ${error.message}`
        );
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/real.jpg')}
      style={styles.backgroundGif}
    >
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <Text style={styles.topLocationText}>
            현재 인증할 위치는 {'\n'}
            <Text style={styles.boldText}>'{visitedCountry}'</Text> 입니다.
          </Text>
        )}

        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

        <View style={styles.buttonContainer}>
          {!imageUri ? (
            <TouchableOpacity style={styles.customButton} onPress={takePhoto}>
              <Text style={styles.customButtonText}>방문 인증하기</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.customButton} onPress={handleSave}>
              <Text style={styles.customButtonText}>인증 완료</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGif: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loadingContainer: {
    position: 'absolute',
    top: '20%',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 170,
    alignItems: 'center',
  },
  topLocationText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    position: 'absolute',
    top: '20%',
  },
  boldText: {
    fontWeight: 'bold',
  },
  customButton: {
    backgroundColor: '#fff',
    borderColor: '#007AFF',
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customButtonText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  image: {
    width: 250,
    height: 250,
    marginVertical: 30,
  },
});

export default TravelCertificationProcess;
