import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const TravelCertificationEdit = ({ route, navigation }) => {
  const { item } = route.params;
  const [visitedCountry, setVisitedCountry] = useState(item.visitedcountry || '');
  const [travelDate, setTravelDate] = useState(item.traveldate || '');
  const [imageUri, setImageUri] = useState(item.imagepath || null);
  const [location, setLocation] = useState({
    latitude: item.latitude || 37.78825,
    longitude: item.longitude || -122.4324,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 서버에서 데이터 가져오기
    axios.get(`http://10.0.2.2:8080/api/travel-certificates/show/${item.travelid}`)
      .then(response => {
        const data = response.data;
        setVisitedCountry(data.visitedcountry);
        setTravelDate(data.traveldate);
        setImageUri(data.imagepath);
        setLocation({
          latitude: data.latitude || 37.78825,
          longitude: data.longitude || -122.4324,
        });
      })
      .catch(error => {
        Alert.alert('오류', '데이터를 불러올 수 없습니다.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [item.travelid]);

  // 카메라 및 사진 권한 요청 처리 함수
  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert('권한 필요', '카메라 및 사진 접근 권한이 필요합니다.');
      return false;
    }
    return true;
  };

  // 사진 선택 함수
  const selectImage = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri); // 올바른 URI 값 설정
    } else {
      Alert.alert('오류', '사진 선택이 취소되었습니다.');
    }
  };

  // 핀 이동 시 위치 업데이트 함수
  const onMarkerDragEnd = async (e) => {
    const newLocation = e.nativeEvent.coordinate;
    setLocation(newLocation);

    try {
      const reverseGeocode = await Location.reverseGeocodeAsync(newLocation);
      if (reverseGeocode.length > 0) {
        const country = reverseGeocode[0].country;
        setVisitedCountry(country);
      }
    } catch (error) {
      Alert.alert('오류', '국가 정보를 가져오는 데 실패했습니다.');
    }
  };

  // 저장 함수
  const handleSave = () => {
    if (!visitedCountry.trim() || !travelDate.trim() || !imageUri || !location.latitude || !location.longitude) {
      Alert.alert('입력 오류', '모든 필드를 입력해 주세요.');
      return;
    }

    const updatedData = {
      visitedcountry: visitedCountry,
      traveldate: travelDate,
      imagepath: imageUri,
      latitude: location.latitude,
      longitude: location.longitude,
    };

    axios.put(`http://10.0.2.2:8080/api/travel-certificates/${item.travelid}`, updatedData)
      .then(response => {
        Alert.alert('수정 완료', '여행 인증서 정보가 수정되었습니다.');
        navigation.goBack();
      })
      .catch(error => {
        Alert.alert('수정 실패', '여행 인증서를 수정할 수 없습니다.');
      });
  };

  // 로딩 중일 때 화면에 표시될 내용
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.label}>방문 국가</Text>
      <TextInput
        style={styles.input}
        value={visitedCountry}
        onChangeText={setVisitedCountry}
      />
      <Text style={styles.label}>여행 날짜</Text>
      <TextInput
        style={styles.input}
        value={travelDate}
        onChangeText={setTravelDate}
        placeholder="YYYY-MM-DD 형식으로 입력"
      />
      <Text style={styles.label}>사진</Text>
      <Button title="사진 선택" onPress={selectImage} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <Text style={styles.label}>위치</Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        scrollEnabled={true}
        zoomEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        showsUserLocation={true} // 사용자의 현재 위치 표시
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          draggable
          onDragEnd={onMarkerDragEnd}
        />
      </MapView>

      <Button title="저장" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
});

export default TravelCertificationEdit;
