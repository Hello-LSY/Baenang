import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';  // Axios를 통해 서버에 데이터 전송

const TravelCertificationProcess = () => {
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [visitedCountry, setVisitedCountry] = useState(null);  // 방문한 국가 정보

  // 카메라 실행 함수
  const takePhoto = async () => {
    // 카메라 권한 요청
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('카메라 접근 권한이 필요합니다.');
      return;
    }

    // 카메라 실행
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri; // 사진 URI를 저장
      setImageUri(uri); // 이미지 경로 저장

      // 갤러리 권한 요청
      const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
      if (mediaLibraryStatus === 'granted') {
        try {
          // 갤러리에 사진 저장
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync('TravelCertification', asset, false);
          alert('사진이 갤러리에 저장되었습니다.');
        } catch (error) {
          console.error('사진 저장 오류:', error);
          alert('사진 저장에 실패했습니다.');
        }
      } else {
        alert('갤러리 저장 권한이 필요합니다.');
      }
    }
  };

  // 현재 위치 가져오기 및 역지오코딩
  const getLocationAndCountry = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('위치 권한이 필요합니다.');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: (-1) * currentLocation.coords.longitude,
    });

    // 역지오코딩으로 국가 정보 가져오기
    let geocode = await Location.reverseGeocodeAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    if (geocode.length > 0) {
      const country = geocode[0].country;  // 국가 이름 가져오기
      setVisitedCountry(country);  // 국가 정보 저장
      console.log('방문 국가:', country);
    }
  };

  // 인증 과정 완료 및 데이터 저장
  const handleSave = () => {
    const currentTime = new Date().toISOString(); // 현재 시간

    const data = {
      imagepath: imageUri,
      latitude: location?.latitude,
      longitude: location?.longitude,
      visitedcountry: visitedCountry,  // 역지오코딩으로 얻은 국가 정보
      traveldate: currentTime,
    };

    console.log('데이터 저장:', data);

    // 서버로 데이터 전송
    axios.post('http://10.0.2.2:8080/api/travel-certificates/save', data)
      .then(response => {
        console.log('서버 응답:', response.data);
        Alert.alert('인증 완료', '사진과 위치가 서버에 저장되었습니다.');
      })
      .catch(error => {
        console.error('데이터 저장 오류:', error);
        Alert.alert('저장 실패', '서버에 데이터를 저장할 수 없습니다.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>여행 인증</Text>

      <Button title="방문인증하기" onPress={async () => {
        await takePhoto();  // 사진 촬영
        await getLocationAndCountry(); // 위치 및 국가 정보 가져오기
      }} />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      {location && (
        <Text>위치: {location.latitude}, {location.longitude}</Text>
      )}

      {visitedCountry && (
        <Text>방문 국가: {visitedCountry}</Text>
      )}

      <Button title="인증 완료" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default TravelCertificationProcess;
