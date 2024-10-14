import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { fetchTravelCertificates } from "../../redux/travelCertificatesSlice"; // Redux 액션
import { BASE_URL } from "../../constants/config";

const TravelCertificationProcess = () => {
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [visitedCountry, setVisitedCountry] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태

  const username = fetchTravelCertificates.username;
  const navigation = useNavigation();
  const dispatch = useDispatch(); // Redux dispatch 사용

  useEffect(() => {
    getLocationAndCountry();
  }, []);

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
        setLoading(false); // 로딩 상태 해제
      } else {
        alert("국가 정보를 가져올 수 없습니다.");
      }
    } catch (error) {
      console.error("위치 정보 가져오기 오류:", error);
      alert("위치 정보를 가져오는 중 오류가 발생했습니다.");
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
        const fileExtension = uri.split(".").pop();
        const newFilePath = `${
          FileSystem.documentDirectory
        }photo_${Date.now()}.${fileExtension}`;

        await FileSystem.moveAsync({
          from: uri,
          to: newFilePath,
        });

        setImageUri(newFilePath);
        alert("사진이 Baenang 폴더의 사용자 폴더에 저장되었습니다.");
      }
    } catch (error) {
      console.error("카메라 실행 오류:", error);
      alert("카메라를 실행할 수 없습니다. 실제 기기에서 시도하세요.");
    }
  };

  const handleSave = async () => {
    if (!imageUri || !location || !visitedCountry) {
      alert("사진과 위치 정보가 필요합니다.");
      return;
    }

    try {
      // 이미지 업로드를 위해 FormData 생성
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri, // 로컬 파일 경로 (takePhoto에서 저장된 경로)
        name: `photo_${Date.now()}.jpg`, // 이미지 파일 이름
        type: "image/jpeg", // 이미지 타입 설정
      });

      // 이미지 업로드를 위한 POST 요청
      const uploadResponse = await axios.post(
        `${BASE_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 서버에서  반환된 이미지 파일 경로 확인
      let savedImagePath = uploadResponse.data.fileName;
      console.log(savedImagePath);
      // 만약 서버에서 경로가 '/uploads/'로 잘못 반환되었다면 '/upload/'로 변경
      // if (savedImagePath.startsWith("uploads/")) {
      //   savedImagePath = savedImagePath.replace("uploads/", "upload/"); // 경로 수정
      // }

      // 서버에 이미지 경로와 나머지 데이터를 저장하는 요청
      const currentTime = new Date()
        .toISOString()
        .replace("T", " ")
        .split(".")[0];
      const data = {
        username,
        imagepath: savedImagePath, // 서버에서 반환된 이미지 경로를 그대로 사용
        latitude: location.latitude,
        longitude: location.longitude,
        visitedcountry: visitedCountry,
        traveldate: currentTime,
      };

      const response = await axios.post(
        `${BASE_URL}/api/travel-certificates/save`,
        data
      );

      if (response.status === 201) {
        Alert.alert(
          "인증 완료",
          "사진과 위치가 데이터베이스에 저장되었습니다."
        );
        dispatch(fetchTravelCertificates());
        navigation.navigate("TravelCertificationMain");
      } else {
        const errorText = JSON.stringify(response.data);
        throw new Error(`데이터 전송 실패: ${errorText}`);
      }
    } catch (error) {
      console.error("데이터 저장 오류:", error);
      if (error.response) {
        Alert.alert(
          "저장 실패",
          `서버 오류: ${JSON.stringify(error.response.data)}`
        );
      } else {
        Alert.alert(
          "저장 실패",
          `데이터베이스에 저장하는 데 실패했습니다. 오류: ${error.message}`
        );
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/real.gif")} // 배경 GIF 경로 설정
      style={styles.backgroundGif} // 배경 스타일 적용
    >
      <View style={styles.container}>
        {/* 로딩 중일 때 기본 로딩 애니메이션 사용 */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <Text style={styles.topLocationText}>
            현재 인증할 위치는 {"\n"} '{visitedCountry}' 입니다.
          </Text>
        )}

        {/* 버튼들이 있는 하단 영역 */}
        <View style={styles.buttonContainer}>
          {!imageUri && (
            <TouchableOpacity style={styles.customButton} onPress={takePhoto}>
              <Text style={styles.customButtonText}>방문 인증하기</Text>
            </TouchableOpacity>
          )}

          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.image} />
          )}

          {/* '인증 완료' 버튼을 조건부로 숨김 */}
          {imageUri && (
            <TouchableOpacity
              style={[
                styles.customButton,
                { display: imageUri ? "flex" : "none" },
              ]} // 버튼 숨기기 처리 및 스타일 병합
              onPress={handleSave}
            >
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
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundGif: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  loadingContainer: {
    position: "absolute",
    top: "20%", // 텍스트와 동일한 위치에 로딩 애니메이션을 배치
    alignItems: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 170, // 하단에 고정
    alignItems: "center",
  },
  topLocationText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 400,
  },
  customButton: {
    backgroundColor: "#fff",
    borderColor: "#007AFF",
    borderWidth: 2,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  customButtonText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default TravelCertificationProcess;
