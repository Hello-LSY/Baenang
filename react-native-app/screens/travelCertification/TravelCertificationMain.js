import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTravelCertificates } from '../../redux/travelCertificatesSlice';

const TravelCertificationMain = ({ navigation }) => {
  const dispatch = useDispatch();

  // Redux state에서 상태를 가져옴
  const { list: locations, status, error } = useSelector((state) => state.travelCertificates);

  const [region, setRegion] = React.useState({
    latitude: 36.5, // 대한민국의 중앙 위치
    longitude: 127.8,
    latitudeDelta: 3, // 대한민국일 때의 줌 레벨
    longitudeDelta: 3,
  });

  // 컴포넌트가 로드되면 Redux 액션을 디스패치하여 데이터를 불러옴
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTravelCertificates());
    }
  }, [status, dispatch]);

  // 방문한 국가 개수 구하기 (Set을 이용해 중복 제거)
  const uniqueCountries = new Set(
    locations.map((loc) => {
      if (loc.visitedcountry) {
        return loc.visitedcountry.trim().toLowerCase().split("-")[0]; // 대소문자 구분 제거, 공백 제거
      }
      return ""; // visitedcountry가 null이거나 undefined일 경우 빈 문자열로 처리
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
  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <Text>데이터를 불러오는 중입니다...</Text>
      </View>
    );
  }

  // 오류 처리
  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <Text>오류가 발생했습니다: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
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

        <View>
          <View>
            <Text style={styles.title}>여행 인증서</Text>
          </View>
          <View flexDirection="row" justifyContent="flex-end">
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("TravelCertificationProcess")}
            >
              <Text style={styles.addButtonText}>추가</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 여행 인증서 지도 섹션 */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={region}
            zoomEnabled={true}
            scrollEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
          >
            {locations.length > 0 ? (
              locations.map((location) => (
                <Marker
                  key={location.travelid}
                  coordinate={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                  }}
                  title={location.visitedcountry}
                  description={`방문 날짜: ${location.traveldate}`}
                />
              ))
            ) : (
              <Text>마커가 없습니다.</Text>
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
          {locations.length > 0 ? (
            <View style={styles.recentTravel}>
              <Text style={styles.travelText}>
                {locations[0].visitedcountry.split("-")[0]}{" "}
                {locations[0].visitedcountry.split("-")[1]} -{" "}
                {locations[0].traveldate}
              </Text>
            </View>
          ) : (
            <Text>방문한 여행지가 없습니다.</Text>
          )}
        </View>

        {/* 여행 인증서 리스트로 이동 버튼 */}
        <Button
          title="여행 인증서 리스트 보기"
          onPress={() => navigation.navigate("TravelCertificationList")}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
  },
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
