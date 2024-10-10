import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDriverLicense } from '../../redux/documentItemSlice';
import { StyleSheet, Text, View, Image, ActivityIndicator, Button } from 'react-native';

function DriverLicenseMain({ navigation }) {
  const dispatch = useDispatch();
  const { residentRegistration ,driverLicense, isLoading, error } = useSelector((state) => state.documentItem);

  useEffect(() => {
    dispatch(fetchDriverLicense()); // 운전면허증 데이터를 가져오는 액션 디스패치
  }, [dispatch]);

  console.log("Redux 상태에서 가져온 driverLicense:", driverLicense);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver License</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : driverLicense ? (
        <View style={styles.infoContainer}>
          <Text>Name: {residentRegistration.name}</Text>
          <Text>RRN: {residentRegistration.rrn}</Text>
          <Text>License Address: {driverLicense.address}</Text>
          <Text>License Number: {driverLicense.dln}</Text>
          <Text>Issue Date: {`${driverLicense.issueDate[0]}-${driverLicense.issueDate[1]}-${driverLicense.issueDate[2]}`}</Text>
          <Text>Expiry date: {`${driverLicense.expiryDate[0]}-${driverLicense.expiryDate[1]}-${driverLicense.expiryDate[2]}`}</Text>

          {/* 이미지 표시 */}
          {driverLicense.imagePath && (
            <Image
              source={{
                uri: `http://10.0.2.2:8080/uploads/driverLicense/${driverLicense.imagePath}`,
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

export default DriverLicenseMain;
