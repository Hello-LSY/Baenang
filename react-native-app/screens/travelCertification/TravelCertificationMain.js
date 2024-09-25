import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import TravelCertificationList from "./TravelCertificationList";

const TravelCertificationMain = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>여행 인증서</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 방문 지역 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>방문 지역</Text>
        <Text style={styles.infoText}>• 도/광역시 : 2개 / 17개</Text>
        <Text style={styles.infoText}>• 시/군 : 2개 / 229개</Text>
      </View>

      {/* 방문 국가 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>방문 국가</Text>
        <Text style={styles.infoText}>• 국가 : 3개 / 198개</Text>
      </View>

      {/* 여행 인증서 지도 섹션 */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.5665, // 서울 좌표
            longitude: 126.978,
            latitudeDelta: 3,
            longitudeDelta: 3,
          }}
        >
          {/* 마커 표시 */}
          <Marker
            coordinate={{ latitude: 37.5665, longitude: 126.978 }} // 서울 마커
            title="서울"
            description="서울 방문 인증"
          />
          <Marker
            coordinate={{ latitude: 36.3504, longitude: 127.3845 }} // 대전 마커
            title="대전"
            description="대전 방문 인증"
          />
        </MapView>
      </View>

      {/* 최근 여행지 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최근 여행지</Text>
        <View style={styles.recentTravel}>
          <View>
            <Text style={styles.travelText}>강원도 화천군</Text>
            <Text style={styles.travelDate}>2024-08-23</Text>
          </View>
        </View>
      </View>

      {/* 여행 인증서 리스트로 이동 버튼 */}
      <Button
        title="여행 인증서 리스트 보기"
        onPress={() => navigation.navigate("TravelCertificationList")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#00BCD4",
    borderRadius: 50,
    padding: 10,
  },
  addButtonText: {
    fontSize: 24,
    color: "#fff",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: "hidden",
    marginVertical: 16,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  recentTravel: {
    flexDirection: "row",
    alignItems: "center",
  },
  travelIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  travelText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  travelDate: {
    color: "#666",
  },
});

export default TravelCertificationMain;
