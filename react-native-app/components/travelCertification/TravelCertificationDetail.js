import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

const TravelCertificationDetail = ({ route, navigation }) => {
  // route.params로 전달된 item을 받아옴
  const { item } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>여행확인서</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>이름: {item.username}</Text>
        <Text style={styles.infoText}>지역: {item.visitedcountry}</Text>
        <Text style={styles.infoText}>일자: {item.traveldate}</Text>
      </View>

      <Image
        source={{ uri: item.imagepath }} // 이미지 경로를 URI로 사용
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
});

export default TravelCertificationDetail;
