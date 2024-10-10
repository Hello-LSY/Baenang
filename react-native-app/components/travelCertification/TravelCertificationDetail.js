import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

const TravelCertificationDetail = ({ route, navigation }) => {
  const { item } = route.params;

  console.log('item : ', item);

  const imageUrl = `http://10.0.2.2:8080/uploads/${item.imagepath}`;

  return (
    <View style={styles.container}>
      
      <ImageBackground
        source={require('../../assets/images/certificate_bg.png')} // 배경 이미지 추가
        style={styles.background}
        imageStyle={styles.imageBackground} // 이미지 자체의 스타일 설정 (선택 사항)
      >
        <View style={styles.content}>
        <Text style={styles.title}>여행확인서</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>이름 |{item.username} {'\n'}</Text>
            <Text style={styles.infoText}>지역 | {item.visitedcountry.split('-')[0]} {item.visitedcountry.split('-')[1]} {'\n'}</Text>
            <Text style={styles.infoText}>일자 | {item.traveldate}</Text>
          </View>

          <Image
            source={{ uri: imageUrl }} // 이미지 경로를 URI로 사용
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* '확인' 버튼을 동그랗고 작게 변경 */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>

        </View>
      </ImageBackground>

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6bb8fe',
  },
  background: {
    width: '100%',
    borderRadius: 30,
  },
  imageBackground: {
    borderRadius: 10, // 배경 이미지의 모서리 둥글게 처리
  },
  content: {
    padding: 30,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
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
