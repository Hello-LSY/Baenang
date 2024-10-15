import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../redux/authState';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchTravelCertificates,
  deleteCertificate,
} from '../../redux/travelCertificatesSlice';
import ProfileButton from '../../components/ProfileButton';
import { Ionicons } from '@expo/vector-icons';
import TravelCertificationItem from '../../components/travelCertification/TravelCertificationItem';
import TravelCertificationModal from '../../components/travelCertification/TravelCertificationModal';
import axios from 'axios';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { BASE_URL, S3_URL } from '../../constants/config';

const TravelCertificationMain = ({ navigation }) => {
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const {
    list: locations,
    status,
    error,
  } = useSelector((state) => state.travelCertificates);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [visibleMenuIndex, setVisibleMenuIndex] = useState(null);

  const [region, setRegion] = useState({
    latitude: 36.5,
    longitude: 127.8,
    latitudeDelta: 3,
    longitudeDelta: 3,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'list', title: '여행 인증서' },
    { key: 'map', title: '내 방문지' },
  ]);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTravelCertificates());
    }
  }, [status, dispatch]);

  const uniqueCountries = new Set(
    locations.map(
      (loc) => loc.visitedcountry?.trim().toLowerCase().split('-')[0] || ''
    )
  );

  const toggleWorldMap = () => {
    setRegion((prev) =>
      prev.latitude === 36.5
        ? {
            latitude: 0,
            longitude: 0,
            latitudeDelta: 180,
            longitudeDelta: 180,
          }
        : {
            latitude: 36.5,
            longitude: 127.8,
            latitudeDelta: 3,
            longitudeDelta: 3,
          }
    );
  };

  const handlePressItem = (item) => {
    console.log('Selected item:', item); // 디버깅을 위한 로그
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null); // 모달을 닫을 때 selectedItem을 null로 설정
  };

  const handleDeleteItem = (id) => {
    Alert.alert('삭제 확인', '정말로 이 인증서를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        onPress: () => {
          axios
            .delete(`${BASE_URL}/api/travel-certificates/delete/${id}`, {
              headers: {
                Authorization: `Bearer ${auth.token}`, // auth.token은 인증 토큰이라고 가정
              },
            })
            .then(() => {
              dispatch(deleteCertificate(id));
              setModalVisible(false);
              setSelectedItem(null);
              Alert.alert('삭제 완료', '여행 인증서가 삭제되었습니다.');
            })
            .catch((error) => {
              console.error('삭제 오류:', error);
              Alert.alert('삭제 실패', '여행 인증서를 삭제할 수 없습니다.');
            });
        },
      },
    ]);
  };

  const handleEditItem = (item) => {
    navigation.navigate('TravelCertificationEdit', { item });
  };

  const toggleMenu = (index) => {
    setVisibleMenuIndex((prev) => (prev === index ? null : index));
  };
  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <ProfileButton
          onPress={() => navigation.navigate('Profile')}
          size={100}
        />
        <View style={styles.userInfo}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{auth.nickname}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TravelCertificationProcess')}
              style={styles.addButton}
            >
              <Ionicons name="add-circle-outline" size={24} color="#A9A9A9" />
            </TouchableOpacity>
          </View>
          <Text style={styles.location}>Seoul, KR</Text>
        </View>

        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{locations.length}</Text>
            <Text style={styles.statLabel}>방문 지역</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{uniqueCountries.size}</Text>
            <Text style={styles.statLabel}>방문 국가</Text>
          </View>
        </View>
      </View>
    ),
    [auth.nickname, locations.length, uniqueCountries.size, navigation]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.itemContainer}>
        <TravelCertificationItem
          item={item}
          onPress={() => handlePressItem(item)}
        />
      </View>
    ),
    []
  );

  const ListScene = useCallback(
    () => (
      <FlatList
        data={locations}
        renderItem={renderItem}
        keyExtractor={(item) => item.travelid.toString()}
        ListEmptyComponent={
          <View style={styles.noTravelContainer}>
            <Text style={styles.noTravelText}>방문한 여행지가 없습니다.</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    ),
    [locations, renderItem]
  );

  const MapScene = useCallback(
    () => (
      <View style={styles.mapContainer}>
        <MapView style={styles.map} region={region}>
          {locations.map((location) => (
            <Marker
              key={location.travelid}
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title={location.visitedcountry}
              description={`방문 날짜: ${location.traveldate}`}
            />
          ))}
        </MapView>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleWorldMap}>
          <Text style={styles.toggleButtonText}>
            {region.latitude === 36.5 ? '세계 지도' : '한국 지도'}
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [locations, region]
  );

  const renderScene = SceneMap({
    list: ListScene,
    map: MapScene,
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#87CEFA' }}
      style={{ backgroundColor: 'white' }}
      labelStyle={{ color: 'black', fontWeight: 'bold' }}
    />
  );

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <Text>데이터를 불러오는 중입니다...</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <Text>오류가 발생했습니다: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={renderTabBar}
        style={styles.tabView}
      />
      {modalVisible && selectedItem && (
        <TravelCertificationModal
          isVisible={modalVisible}
          onClose={handleCloseModal}
          item={selectedItem}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    marginLeft: 3,
  },
  location: {
    fontSize: 14,
    color: 'grey',
    marginTop: 4,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 13,
    color: 'grey',
  },
  tabView: {
    flex: 1,
  },

  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  toggleButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  toggleButtonText: {
    fontWeight: 'bold',
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  noTravelContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noTravelText: {
    fontSize: 16,
    color: 'grey',
  },
});

export default TravelCertificationMain;
