import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../../services/AuthContext';
import createAxiosInstance from '../../services/axiosInstance';
import QRCode from 'react-native-qrcode-svg'; // QR 코드 생성을 위한 라이브러리

const BusinessCardScreen = ({ navigation }) => {
  const [businessCard, setBusinessCard] = useState(null); // 명함 정보 상태
  const [isModalVisible, setModalVisible] = useState(false); // 모달 표시 여부 상태
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const { token, memberId } = useContext(AuthContext); // AuthContext에서 토큰과 memberId 가져오기

  useEffect(() => {
    if (token && memberId) {
      fetchBusinessCardData(memberId); // 컴포넌트가 마운트되면 명함 데이터를 가져옴
    }
  }, [token, memberId]);

  useEffect(() => {
    // 명함 생성 완료 후 다시 데이터를 가져오기 위해 listener 추가
    const focusListener = navigation.addListener('focus', () => {
      if (token && memberId) {
        fetchBusinessCardData(memberId);
      }
    });

    return focusListener;
  }, [navigation, token, memberId]);

  // 명함 데이터 조회 함수
  const fetchBusinessCardData = async (memberId) => {
    try {
      setLoading(true); // 데이터 가져오는 동안 로딩 상태 활성화
      const axiosInstance = createAxiosInstance(token);
      console.log(`Fetching business card data for memberId: ${memberId}`); // 로그 추가
      const response = await axiosInstance.get(`/api/business-cards/members/${memberId}`); // 명함 정보 조회
      console.log(`Business card data received: ${response.data}`); // 로그 추가
      setBusinessCard(response.data); // 조회된 데이터를 상태에 저장
    } catch (error) {
      console.error('Error fetching business card data:', error);
    } finally {
      setLoading(false); // 데이터 가져온 후 로딩 상태 비활성화
    }
  };

  // 명함 삭제 함수
  const deleteBusinessCard = async () => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`/api/business-cards/${businessCard.cardId}`); // 명함 삭제 요청
      alert('명함이 성공적으로 삭제되었습니다.');
      setBusinessCard(null); // 명함 정보 상태 초기화
    } catch (error) {
      console.error('Error deleting business card:', error);
      alert('명함 삭제 중 오류가 발생했습니다.');
    }
  };

  // 삭제 확인 알림
  const confirmDelete = () => {
    Alert.alert(
      "명함 삭제",
      "정말로 명함을 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", onPress: deleteBusinessCard }
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 로딩 상태일 때 로딩 인디케이터 표시 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>내 명함 QR 코드</Text>
          {/* 명함 정보를 QR 코드로 표시 */}
          {businessCard ? (
            <>
              <QRCode value={JSON.stringify(businessCard)} size={200} />
              <View style={styles.businessCardInfo}>
                <Text style={styles.infoText}>이름: {businessCard.name}</Text>
                <Text style={styles.infoText}>국가: {businessCard.country}</Text>
                <Text style={styles.infoText}>이메일: {businessCard.email}</Text>
                <Text style={styles.infoText}>SNS: {businessCard.sns}</Text>
                <Text style={styles.infoText}>소개: {businessCard.introduction}</Text>
                
                {/* 명함 삭제 버튼 */}
                <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                  <Text style={styles.deleteButtonText}>명함 삭제</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text>명함 데이터가 없습니다.</Text>
              {/* 명함 생성하기 버튼 */}
              <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateBusinessCard')}>
                <Text style={styles.createButtonText}>명함 생성하기</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}

      {/* 명함 수첩 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📂 명함 수첩</Text>
        <ScrollView horizontal style={styles.cardList}>
          {/* 저장된 명함 목록을 보여줄 공간 */}
          <TouchableOpacity style={styles.addCardButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addCardText}>QR</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* QR 코드 등록 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>QR 코드로 명함 등록</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  businessCardInfo: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  closeButtonText: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default BusinessCardScreen;
