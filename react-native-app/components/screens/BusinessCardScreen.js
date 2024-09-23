import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Image, ActivityIndicator } from 'react-native';
import createAxiosInstance from '../../services/axiosInstance';
import { AuthContext } from '../../services/AuthContext';

const BusinessCardScreen = ({ navigation }) => {
  const [businessCards, setBusinessCards] = useState([]); // 다른 사람 명함 목록
  const [myBusinessCard, setMyBusinessCard] = useState(null); // 내 명함 정보
  const [isModalVisible, setModalVisible] = useState(false); // QR 모달 제어
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const { token, memberId } = useContext(AuthContext); // AuthContext에서 token과 memberId 가져오기

  // 환경 변수를 사용하는 방식으로 서버 IP를 관리
  const serverIP = "10.0.2.2"; // 서버가 실행되는 PC의 IP 주소를 환경 변수로 관리 가능

  // 명함 등록 후 다시 데이터를 불러오도록 설정
  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      fetchData();
    });

    return () => {
      focusListener();
    };
  }, [navigation]);

  useEffect(() => {
    if (token && memberId) {
      fetchData();
    }
  }, [token, memberId]);

  // 데이터 조회 함수
  const fetchData = async () => {
    try {
      if (!token || !memberId) {
        console.error('Token or Member ID is missing.', { token, memberId });
        return;
      }
      setLoading(true); // 데이터 불러오는 동안 로딩 상태 활성화
      await fetchMyBusinessCard(memberId, token);
      await fetchBusinessCards(memberId, token);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // 데이터 불러오기 완료 후 로딩 상태 비활성화
    }
  };

  // 내 명함 조회 함수
  const fetchMyBusinessCard = async (id, userToken) => {
    try {
      const axiosInstance = createAxiosInstance(userToken);
      const response = await axiosInstance.get(`/api/business-cards/members/${id}`);
      setMyBusinessCard(response.data);
    } catch (error) {
      console.error('Failed to fetch my business card:', error);
      setMyBusinessCard(null); // 명함이 없을 경우 null로 설정
    }
  };

  // 다른 사람 명함 목록 조회 함수
  const fetchBusinessCards = async (id, userToken) => {
    try {
      const axiosInstance = createAxiosInstance(userToken);
      const response = await axiosInstance.get(`/api/saved-business-cards/members/${id}/cards`);
      setBusinessCards(response.data);
    } catch (error) {
      console.error('Failed to fetch business cards:', error);
    }
  };

  // QR 모달 열기/닫기 함수
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // QR 코드 이미지 로드 오류 처리 함수
  const handleImageError = () => {
    console.error('Failed to load QR code image.');
    alert('QR 코드 이미지를 불러오지 못했습니다.');
  };

  return (
    <ScrollView style={styles.container}>
      {/* 로딩 스피너 표시 */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {/* 내 명함 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📇 나의 여행 명함</Text>
        {myBusinessCard ? (
          <View style={styles.myCardContainer}>
            <Text style={styles.cardName}>{myBusinessCard.name}</Text>
            <Text>{myBusinessCard.country}</Text>
            <Text>{myBusinessCard.email}</Text>
            <Text>{myBusinessCard.introduction}</Text>
            <Text>{myBusinessCard.sns}</Text>
            <Image
                source={{ uri: `http://${serverIP}:8080/api/qr-images/${myBusinessCard.qr}` }}
                style={styles.qrCode}
                onError={() => console.error("Failed to load QR code image.")} // 오류 핸들러 추가
            />


          </View>
        ) : (
          <View style={styles.noCardContainer}>
            <Text style={styles.noCardText}>등록된 명함이 없습니다.</Text>
            <Button title="명함 등록하기" onPress={() => navigation.navigate('CreateBusinessCard')} />
          </View>
        )}
      </View>

      {/* 명함 수첩 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📂 명함 수첩</Text>
        <ScrollView horizontal style={styles.cardList}>
          {businessCards.map((card) => (
            <View key={card.cardId} style={styles.cardItem}>
              <Text style={styles.cardName}>{card.name}</Text>
              <Text>{card.country}</Text>
              <TouchableOpacity onPress={() => alert(`명함 ${card.name} 등록!`)}>
                <Text style={styles.addButton}>+</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity style={styles.addCardButton} onPress={toggleModal}>
            <Text style={styles.addCardText}>+</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* QR 코드 등록 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>QR 코드로 명함 등록</Text>
            <Button title="닫기" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  myCardContainer: {
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  noCardContainer: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  noCardText: {
    fontSize: 16,
    marginBottom: 8,
  },
  cardList: {
    flexDirection: 'row',
  },
  cardItem: {
    width: 200,
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
  },
  cardName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  qrCode: {
    width: 100,
    height: 100,
    marginVertical: 12,
  },
  addButton: {
    fontSize: 24,
    color: 'blue',
  },
  addCardButton: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  addCardText: {
    fontSize: 50,
    color: 'blue',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BusinessCardScreen;
