import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchResidentRegistration } from "../../redux/documentItemSlice";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  Button,
} from "react-native";

function ResidentRegistrationMain({ navigation }) {
  const dispatch = useDispatch();
  const { residentRegistration, isLoading, error } = useSelector(
    (state) => state.documentItem
  );

  useEffect(() => {
    dispatch(fetchResidentRegistration()); // 주민등록 데이터를 가져오는 액션 디스패치
  }, [dispatch]);

  console.log(
    "Redux 상태에서 가져온 residentRegistration:",
    residentRegistration
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resident Registration</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error: {error}</Text>
      ) : residentRegistration ? (
        <View style={styles.infoContainer}>
          <Text>Document ID: {residentRegistration.id}</Text>
          <Text>Name: {residentRegistration.name}</Text>
          <Text>RRN: {residentRegistration.rrn}</Text>
          <Text>Address: {residentRegistration.address}</Text>
          <Text>Issuer: {residentRegistration.issuer}</Text>
          <Text>
            Issue Date:{" "}
            {`${residentRegistration.issueDate[0]}-${residentRegistration.issueDate[1]}-${residentRegistration.issueDate[2]}`}
          </Text>

          {/* 이미지 표시 */}
          {residentRegistration.imagePath && (
            <Image
              source={{
                uri: `http://10.0.2.2:8080/uploads/residentRegistration/${residentRegistration.imagePath}`,
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
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  infoContainer: { marginTop: 20 },
  image: { width: 200, height: 200, marginVertical: 20 },
});

export default ResidentRegistrationMain;
