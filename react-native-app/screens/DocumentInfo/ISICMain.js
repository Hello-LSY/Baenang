import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchISIC } from '../../redux/documentItemSlice';
import { StyleSheet, Text, View, Image, ActivityIndicator, Button } from 'react-native';

function ISICMain({ navigation }) {
  const dispatch = useDispatch();
  const { isic, isLoading, error } = useSelector((state) => state.documentItem);

  useEffect(() => {
    dispatch(fetchISIC()); // 국제학생증 데이터를 가져오는 액션 디스패치
  }, [dispatch]);

  console.log("Redux 상태에서 가져온 isic:", isic);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ISIC Information</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : isic ? (
        <View style={styles.infoContainer}>
          <Text>ISIC ID: {isic.id}</Text>
          <Text>Name: {isic.name}</Text>
          <Text>ISIC Number: {isic.isicNumber}</Text>
          <Text>Issue Date: {`${isic.issueDate[0]}-${isic.issueDate[1]}-${isic.issueDate[2]}`}</Text>

          {/* 이미지 표시 */}
          {isic.imagePath && (
            <Image
              source={{
                uri: `http://10.0.2.2:8080/uploads/isic/${isic.imagePath}`,
              }}
              style={styles.image}
            />
          )}
        </View>
      ) : (
        <Text>No data available</Text>
      )}
      <Button title="Back to Documents" onPress={() => navigation.goBack()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  infoContainer: { marginTop: 20 },
  image: { width: 200, height: 200, marginVertical: 20 },
});

export default ISICMain;
