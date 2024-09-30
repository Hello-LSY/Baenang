import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system"; 
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux'; // Redux 사용
import { fetchTravelCertificates } from '../../redux/travelCertificatesSlice'; // Redux 액션

const TravelCertificationProcess = () => {
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [visitedCountry, setVisitedCountry] = useState(null);
  const username = "exampleUser";
  const navigation = useNavigation();
  const dispatch = useDispatch(); // Redux dispatch 사용

  const userFolder = `${FileSystem.documentDirectory}${username}/`;

  const createUserFolder = async () => {
    const folderExists = await FileSystem.getInfoAsync(userFolder);
    if (!folderExists.exists) {
      await FileSystem.makeDirectoryAsync(userFolder, { intermediates: true });
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("카메라 접근 권한이 필요합니다.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await createUserFolder();

        const fileExtension = uri.split(".").pop();
        const newFilePath = `${userFolder}photo_${Date.now()}.${fileExtension}`;

        await FileSystem.moveAsync({
          from: uri,
          to: newFilePath,
        });

        setImageUri(newFilePath);
        alert("사진이 Baenang 폴더의 사용자 폴더에 저장되었습니다.");
      }
    } catch (error) {
      console.error("카메라 실행 오류:", error);
      alert("카메라를 실행할 수 없습니다.");
    }
  };

  const getLocationAndCountry = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("위치 권한이 필요합니다.");
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
      } else {
        alert("국가 정보를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("위치 정보 가져오기 오류:", error);
      alert("위치 정보를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const handleSave = async () => {
    if (!imageUri || !location || !visitedCountry) {
      alert("사진과 위치 정보가 필요합니다.");
      return;
    }

    const currentTime = new Date().toISOString().replace("T", " ").split(".")[0];

    const data = {
      username: username,
      imagepath: imageUri,
      latitude: location?.latitude,
      longitude: location?.longitude,
      visitedcountry: visitedCountry,
      traveldate: currentTime,
    };

    try {
      await axios.post(
        "http://10.0.2.2:8080/api/travel-certificates/save",
        data
      );
      Alert.alert("인증 완료", "사진과 위치가 데이터베이스에 저장되었습니다.");

      // Redux 상태 업데이트
      dispatch(fetchTravelCertificates());

      // 저장 후 목록 화면으로 이동
      navigation.navigate('TravelCertificationList');
    } catch (error) {
      console.error("데이터 저장 오류:", error);
      Alert.alert("저장 실패", "데이터베이스에 저장하는 데 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>여행 인증</Text>

      <Button
        title="방문인증하기"
        onPress={async () => {
          await takePhoto();
          await getLocationAndCountry();
        }}
      />

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {location && (
        <Text>
          위치: {location.latitude}, {location.longitude}
        </Text>
      )}

      {visitedCountry && <Text>방문 국가 및 지역: {visitedCountry}</Text>}

      <Button title="인증 완료" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default TravelCertificationProcess;
