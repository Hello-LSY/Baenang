import React, { useState } from "react";
import { View, Text, Button, Image, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system"; // 파일 시스템 사용
import axios from "axios";

const TravelCertificationProcess = () => {
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [visitedCountry, setVisitedCountry] = useState(null); // 방문한 국가 및 지역 정보
  const username = "exampleUser"; // 각 사용자의 ID (백엔드에서 이 값이 username 필드에 해당)

  // 사용자별 폴더 경로 설정
  const userFolder = `${FileSystem.documentDirectory}${username}/`;

  // 사용자 폴더를 생성하는 함수
  const createUserFolder = async () => {
    const folderExists = await FileSystem.getInfoAsync(userFolder);
    if (!folderExists.exists) {
      await FileSystem.makeDirectoryAsync(userFolder, { intermediates: true });
    }
  };

  // 카메라 실행 함수
  const takePhoto = async () => {
    try {
      // 카메라 권한 요청
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("카메라 접근 권한이 필요합니다.");
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
        await createUserFolder(); // 사용자 폴더 생성

        // 파일 확장자 추출 (예: .jpg)
        const fileExtension = uri.split(".").pop();
        // 새 파일 경로 (사용자 폴더에 저장)
        const newFilePath = `${userFolder}photo_${Date.now()}.${fileExtension}`;

        // 파일을 사용자 폴더로 복사
        await FileSystem.moveAsync({
          from: uri,
          to: newFilePath,
        });

        setImageUri(newFilePath); // 새로 저장된 경로를 설정
        alert("사진이 Baenang 폴더의 사용자 폴더에 저장되었습니다.");
      }
    } catch (error) {
      console.error("카메라 실행 오류:", error);
      alert("카메라를 실행할 수 없습니다.");
    }
  };

  // 현재 위치 가져오기 및 역지오코딩
  const getLocationAndCountry = async () => {
    try {
      // 위치 권한 요청
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("위치 권한이 필요합니다.");
        return;
      }

      // 현재 위치 가져오기 (정확도 높이기)
      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High, // 정확도를 높이기 위한 설정
      });
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      // 역지오코딩으로 국가 및 지역 정보 가져오기
      let geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocode.length > 0) {
        const country = geocode[0].country; // 국가 이름 가져오기
        const region = geocode[0].region; // 지역 이름 가져오기
        setVisitedCountry(`${country}-${region}`); // 국가와 지역 정보를 결합하여 저장
        console.log("방문 국가 및 지역:", `${country}, ${region}`);
      } else {
        alert("국가 정보를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("위치 정보 가져오기 오류:", error);
      alert("위치 정보를 가져오는 중 오류가 발생했습니다.");
    }
  };

  // 인증 과정 완료 및 데이터 저장
  const handleSave = async () => {
    if (!imageUri || !location || !visitedCountry) {
      alert("사진과 위치 정보가 필요합니다.");
      return;
    }

    const currentTime = new Date()
      .toISOString()
      .replace("T", " ")
      .split(".")[0]; // 'yyyy-MM-dd HH:mm:ss'

    const data = {
      username: username, // 사용자 이름
      imagepath: imageUri,
      latitude: location?.latitude,
      longitude: location?.longitude,
      visitedcountry: visitedCountry, // 역지오코딩으로 얻은 국가 및 지역 정보
      traveldate: currentTime,
    };

    console.log("저장할 데이터:", data);

    // 서버로 데이터 전송
    try {
      await axios.post(
        "http://10.0.2.2:8080/api/travel-certificates/save",
        data
      );
      Alert.alert("인증 완료", "사진과 위치가 데이터베이스에 저장되었습니다.");
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
          await takePhoto(); // 사진 촬영
          await getLocationAndCountry(); // 위치 및 국가 정보 가져오기
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
