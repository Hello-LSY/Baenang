import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, TextInput, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBusinessCard, clearBusinessCard } from '../../redux/businessCardSlice';
import QRCode from 'react-native-qrcode-svg';
import { BASE_URL } from '../../constants/config';
import { addFriendByBusinessCardId, fetchFriendsList } from '../../redux/friendSlice'; // 친구 추가 및 리스트 불러오기 액션
import { BarCodeScanner } from 'expo-barcode-scanner'; // QR 스캐너 라이브러리

const BusinessCardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { businessCard, loading, error } = useSelector((state) => state.businessCard);
  const { friendsList } = useSelector((state) => state.friend); // 친구 리스트 상태
  const [businessCardIdInput, setBusinessCardIdInput] = useState(''); // 명함 ID 입력값
  const [hasPermission, setHasPermission] = useState(null); // 카메라 권한 상태
  const [scanned, setScanned] = useState(false); // QR 스캔 여부 상태
  const [isScanning, setIsScanning] = useState(false); // QR 스캐너가 켜져 있는지 상태 확인

  // 명함 정보 조회
  useEffect(() => {
    if (auth.token && auth.memberId) {
      dispatch(fetchBusinessCard(auth.memberId));
      dispatch(fetchFriendsList(auth.memberId)); // 친구 리스트도 불러옴
    }

    return () => {
      dispatch(clearBusinessCard());
    };
  }, [auth.token, auth.memberId, dispatch]);

  // QR 스캐너 권한 요청
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Card ID로 친구 추가하기
  const handleAddFriendById = (businessCardId) => {
    if (!businessCardId) {
      Alert.alert('Error', '명함 ID를 입력해주세요.');
      return;
    }

    dispatch(addFriendByBusinessCardId({ memberId: auth.memberId, businessCardId }))
      .then(() => {
        Alert.alert('Success', '친구가 성공적으로 추가되었습니다.');
        dispatch(fetchFriendsList(auth.memberId)); // 친구 추가 후 리스트 갱신
      })
      .catch(() => {
        Alert.alert('Error', '친구 추가에 실패했습니다.');
      });
  };

  // QR코드 스캔 핸들러
  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setIsScanning(false); // 스캔 후 QR 스캐너를 닫음
    Alert.alert('QR 코드 스캔 완료', `스캔한 명함 ID: ${data}`);
    handleAddFriendById(data); // 스캔된 데이터를 사용해 친구 추가
  };

  // QR 스캐너 시작 버튼 핸들러
  const handleStartScan = () => {
    setIsScanning(true);
    setScanned(false); // 이전 스캔 초기화
  };

  if (hasPermission === null) {
    return <Text>카메라 접근 권한을 요청 중입니다...</Text>;
  }
  if (hasPermission === false) {
    return <Text>카메라 접근 권한이 없습니다.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>내 명함</Text>
          {businessCard ? (
            <View style={styles.businessCard}>
              {/* QR 코드와 명함 정보 표시 */}
              <View style={styles.qrSection}>
                <QRCode value={JSON.stringify(businessCard)} size={150} />
              </View>
              <View style={styles.cardInfoSection}>
                <Text style={styles.cardInfoText}>이름: {businessCard.name}</Text>
                <Text style={styles.cardInfoText}>국가: {businessCard.country}</Text>
                <Text style={styles.cardInfoText}>이메일: {businessCard.email}</Text>
                <Text style={styles.cardInfoText}>SNS: {businessCard.sns}</Text>
                <Text style={styles.cardInfoText}>소개: {businessCard.introduction}</Text>
              </View>

              {/* 자신의 businessCardId 표시 */}
              <View style={styles.cardIdSection}>
                <Text style={styles.cardIdText}>내 명함 ID: {businessCard.cardId}</Text>
              </View>

              {businessCard.imageUrl && (
                <Image
                  source={{ uri: `${BASE_URL}/uploads/${businessCard.imageUrl}` }}
                  style={styles.businessCardImage}
                  resizeMode="contain"
                />
              )}

              {/* 친구 추가 */}
              <View style={styles.friendAddSection}>
                <TextInput
                  style={styles.input}
                  placeholder="친구 명함 ID 입력"
                  value={businessCardIdInput}
                  onChangeText={setBusinessCardIdInput}
                />
                <TouchableOpacity style={styles.addButton} onPress={() => handleAddFriendById(businessCardIdInput)}>
                  <Text style={styles.addButtonText}>친구 추가</Text>
                </TouchableOpacity>
              </View>

              {/* QR코드 스캔으로 친구 추가하기 */}
              <View style={styles.qrSection}>
                {isScanning ? (
                  <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject}
                  />
                ) : (
                  <TouchableOpacity style={styles.qrButton} onPress={handleStartScan}>
                    <Text style={styles.qrButtonText}>QR로 친구 추가</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* 친구 리스트 표시 */}
              <View style={styles.friendsListSection}>
                <Text style={styles.sectionTitle}>내 친구 리스트</Text>
                {friendsList.length > 0 ? (
                  friendsList.map((friend, index) => (
                    <View key={index} style={styles.friendCard}>
                      <Text style={styles.friendCardText}>이름: {friend.name}</Text>
                      <Text style={styles.friendCardText}>이메일: {friend.email}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noFriendsText}>친구가 없습니다.</Text>
                )}
              </View>
            </View>
          ) : (
            <>
              <Text>명함 데이터가 없습니다.</Text>
              <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateBusinessCard')}>
                <Text style={styles.createButtonText}>명함 생성하기</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  businessCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  qrSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardInfoSection: {
    alignItems: 'flex-start',
  },
  cardInfoText: {
    fontSize: 16,
    marginVertical: 4,
  },
  cardIdSection: {
    marginVertical: 10,
    alignItems: 'center',
  },
  cardIdText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  businessCardImage: {
    width: 150,
    height: 150,
    marginVertical: 20,
  },
  friendAddSection: {
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    width: '90%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  qrButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  qrButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  friendsListSection: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  friendCard: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  friendCardText: {
    fontSize: 16,
  },
  noFriendsText: {
    fontSize: 16,
    color: '#999',
  },
});

export default BusinessCardScreen;
