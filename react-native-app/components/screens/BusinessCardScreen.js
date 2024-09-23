import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, Image } from 'react-native';
import createAxiosInstance from '../../services/axiosInstance'; // axiosInstance 가져오기
import { AuthContext } from '../../services/AuthContext'; // AuthContext 가져오기

const BusinessCardScreen = ({ navigation }) => {
  const [businessCards, setBusinessCards] = useState([]); // 다른 사람 명함 목록
  const [myBusinessCard, setMyBusinessCard] = useState(null); // 내 명함 정보
  const [isModalVisible, setModalVisible] = useState(false); // QR 모달 제어
  const { token, memberId } = useContext(AuthContext); // AuthContext에서 token과 memberId 가져오기

  // 명함 등록 후 다시 데이터를 불러오도록 설정
  useEffect(() => {
    const focusListener = navigation.addListener('focus', () => {
      // 화면이 다시 포커스를 받을 때 데이터를 불러오도록 설정
      fetchData();
    });

    // 컴포넌트가 언마운트 될 때 이벤트 리스너 정리
    return () => {
      focusListener();
    };
  }, [navigation]);

  useEffect(() => {
    // 토큰이나 멤버 ID가 변경될 때 데이터를 다시 불러옴
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

      // 데이터 조회 함수 호출
      await fetchMyBusinessCard(memberId, token);
      await fetchBusinessCards(memberId, token);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // 내 명함 조회 함수
  const fetchMyBusinessCard = async (id, userToken) => {
    try {
      const axiosInstance = createAxiosInstance(userToken); // axios 인스턴스 생성
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
      const axiosInstance = createAxiosInstance(userToken); // axios 인스턴스 생성
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

  return (
    <ScrollView style={styles.container}>
      {/* 내 명함 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📇 나의 여행 명함</Text>
        {myBusinessCard ? (
          <View style={styles.myCardContainer}>
            <Text style={styles.cardName}>{myBusinessCard.name}</Text>
            <Text>{myBusinessCard.country}</Text>
            <Text>{myBusinessCard.email}</Text>
            {/* 추가된 소개와 SNS 정보 표시 */}
            <Text>{myBusinessCard.introduction}</Text>
            <Text>{myBusinessCard.sns}</Text>
            <Image
              source={{ uri: `http://localhost:8080/api/qr-images/${myBusinessCard.qr}` }} // QR 코드 이미지 표시
              style={styles.qrCode}
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
            {/* QR 스캐너 기능 추가 필요 */}
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
});

export default BusinessCardScreen;
