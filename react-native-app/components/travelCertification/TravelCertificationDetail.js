import React from 'react';
import { BASE_URL } from '../../constants/config';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const TravelCertificationDetail = ({ route, navigation }) => {
  // route.params로 전달된 item을 받아옴
  const { item } = route.params;

  console.log('item : ', item)

  // 이미지가 저장된 서버 URL과 결합하여 완전한 이미지 URL을 생성
  const imageUrl = `${BASE_URL}/uploads/${item.imagepath}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>여행확인서</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>이름: {item.username}</Text>
        <Text style={styles.infoText}>지역: {item.visitedcountry.split('-')[0]} {item.visitedcountry.split('-')[1]}</Text>
        <Text style={styles.infoText}>일자: {item.traveldate}</Text>
      </View>

      {/* 이미지가 완전한 URL로 변경됨 */}
      <Image
        source={{ uri: imageUrl }} // 이미지 경로를 URI로 사용
        style={styles.image}
        resizeMode="cover"
      />

      <Button title="확인" onPress={() => navigation.goBack()} />
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
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#fff', // 버튼 배경색
    borderColor: '#007AFF', // 테두리 색상
    borderWidth: 1, // 테두리 두께
    borderRadius: 25, // 동그란 모양을 위해 반경 설정
    width: 80, // 버튼의 너비
    height: 40, // 버튼의 높이
    justifyContent: 'center', // 버튼 안 텍스트 중앙 정렬
    alignItems: 'center', // 버튼 안 텍스트 수평 중앙 정렬
    alignSelf: 'center', // 부모 뷰 기준 중앙 정렬
    // marginTop: 3, // 상단 여백
  },
  buttonText: {
    color: '#007AFF', // 텍스트 색상
    fontSize: 16, // 텍스트 크기
    fontWeight: 'bold', // 텍스트 굵기
  },
});

export default TravelCertificationDetail;