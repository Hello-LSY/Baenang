import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";

const TravelCertificationMain = ({ navigation }) => {
  const [locations, setLocations] = useState([]); // 초기 상태를 빈 배열로 설정
  const [region, setRegion] = useState({
    latitude: 36.5, // 대한민국의 중앙 위치
    longitude: 127.8,
    latitudeDelta: 3, // 대한민국일 때의 줌 레벨
    longitudeDelta: 3,
  });
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  // Spring REST API로부터 방문 지역 데이터를 가져옴
  useEffect(() => {
    axios
      .get("http://10.0.2.2:8080/api/travel-certificates/all")
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setLocations(data); // 응답이 배열이면 상태에 저장
          console.log("data : ", data);
        } else {
          console.error("API 응답이 배열이 아닙니다.");
          setLocations([]); // 오류 방지용으로 빈 배열로 설정
        }
      })
      .catch((error) => {
        console.error("API 요청 오류:", error);
        setLocations([]);
      })
      .finally(() => {
        setLoading(false); // 데이터 로드 완료 후 로딩 상태 업데이트
      });
  }, []);

  // 방문한 국가 개수 구하기 (Set을 이용해 중복 제거)
  const uniqueCountries = new Set(
    locations.map((loc) => {
      if (loc.visitedcountry) {
        return loc.visitedcountry.trim().toLowerCase(); // 대소문자 구분 제거, 공백 제거
      }
      return ''; // visitedcountry가 null이거나 undefined일 경우 빈 문자열로 처리
    })
  );

  // 지도를 전환하는 함수 (한국 -> 세계)
  const toggleWorldMap = () => {
    if (region.latitude === 36.5 && region.longitude === 127.8) {
      // 세계 지도로 전환
      setRegion({
        latitude: 110,
        longitude: 50,
        latitudeDelta: 100, // 전 세계를 볼 수 있게 확대
        longitudeDelta: 100,
      });
    } else {
      // 한국 지도로 전환
      setRegion({
        latitude: 36.5,
        longitude: 127.8,
        latitudeDelta: 3, // 한국 지역만 보기
        longitudeDelta: 3,
      });
    }
  };

  // 로딩 상태 처리
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>데이터를 불러오는 중입니다...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>여행 인증서</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("TravelCertificationProcess")}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 방문 지역 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>방문 지역</Text>
        <Text style={styles.infoText}>• 개수 : {locations.length}개</Text>
      </View>

      {/* 방문 국가 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>방문 국가</Text>
        <Text style={styles.infoText}>• 국가 : {uniqueCountries.size}개</Text>
      </View>

      {/* 여행 인증서 지도 섹션 */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region} // 지도 상태로 설정
        >
          {locations.length > 0 ? (
            locations.map((location) => (
              <Marker
                key={location.travelid} // 여행 인증서 고유 ID를 키로 사용
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title={location.visitedcountry} // 방문한 국가 정보
                description={`방문 날짜: ${location.traveldate}`} // 여행 날짜 정보
              />
            ))
          ) : (
            <Text>마커가 없습니다.</Text> // 데이터가 없을 때의 처리
          )}
        </MapView>
      </View>

      {/* 해외 지도 보기 버튼 */}
      <View style={styles.buttonContainer}>
        <Button
          title={region.latitude === 36.5 ? "해외 지도" : "한국 지도"}
          onPress={toggleWorldMap}
        />
      </View>

      {/* 최근 여행지 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>최근 여행지</Text>
        {locations.length > 0 ? ( // 배열이 비어있지 않은 경우에만 렌더링
          <View style={styles.recentTravel}>
            <Text style={styles.travelText}>
              {locations[locations.length - 1].visitedcountry} -{" "}
              {locations[locations.length - 1].traveldate}
            </Text>
          </View>
        ) : (
          <Text>방문한 여행지가 없습니다.</Text> // 배열이 비어있을 때의 처리
        )}
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
  buttonContainer: {
    marginVertical: 16,
  },
  recentTravel: {
    flexDirection: "row",
    alignItems: "center",
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
