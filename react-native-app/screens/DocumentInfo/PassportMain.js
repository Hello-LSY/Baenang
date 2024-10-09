import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPassport } from '../../redux/documentItemSlice';
import { StyleSheet, Text, View, Image, ActivityIndicator, Button } from 'react-native';

function PassportMain({ navigation }) {
  const dispatch = useDispatch();
  const { passport, isLoading, error } = useSelector((state) => state.documentItem);

  useEffect(() => {
    dispatch(fetchPassport()); // 여권 데이터를 가져오는 액션 디스패치
  }, [dispatch]);

  console.log("Redux 상태에서 가져온 passport:", passport);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Passport Information</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : passport ? (
        <View style={styles.infoContainer}>
          <Text>Passport ID: {passport.id}</Text>
          <Text>Name: {passport.koreanName}</Text>
          <Text>Passport Number: {passport.passportNumber}</Text>
          <Text>Issue Date: {`${passport.issueDate[0]}-${passport.issueDate[1]}-${passport.issueDate[2]}`}</Text>

          {/* 이미지 표시 */}
          {passport.imagePath && (
            <Image
              source={{
                uri: `http://10.0.2.2:8080/uploads/passport/${passport.imagePath}`,
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

export default PassportMain;
