import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button } from 'react-native';
import { AuthContext } from '../../services/AuthContext'; // AuthContext 불러오기

const HomeScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { logout } = useContext(AuthContext); // 로그아웃 함수 가져오기

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleLogout = () => {
    logout(); // 로그아웃 함수 호출
    toggleModal(); // 모달 닫기
  };

  return (
    <ScrollView style={styles.container}>
      {/* 상단 로고와 제목 */}
      <View style={styles.header}>
        <Text style={styles.logo}>🏠</Text>
        <Text style={styles.headerText}>커뮤니티</Text>
        <TouchableOpacity style={styles.profileButton} onPress={toggleModal}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* 내 문서 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📂 내 문서</Text>
        <View style={styles.documentList}>
          <TouchableOpacity style={[styles.documentItem, { backgroundColor: '#FFEB3B' }]}>
            <Text style={styles.documentText}>주민등록증</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.documentItem, { backgroundColor: '#8BC34A' }]}>
            <Text style={styles.documentText}>운전면허증</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.documentItem, { backgroundColor: '#00BCD4' }]}>
            <Text style={styles.documentText}>여권</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.documentItem, { backgroundColor: '#FF9800' }]}>
            <Text style={styles.documentText}>여행보험증명서</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.documentItem, { backgroundColor: '#9C27B0' }]}>
            <Text style={styles.documentText}>예방접종증명서</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.documentItem, { backgroundColor: '#009688' }]}>
            <Text style={styles.documentText}>출입국사실증명서</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.documentItem, { backgroundColor: '#3F51B5' }]}>
            <Text style={styles.documentText}>국제학생증</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.documentItem, { backgroundColor: '#E91E63' }]}>
            <Text style={styles.documentText}>여행보혐증명서</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 여행자 명함, 여행 인증서 섹션 */}
      <View style={styles.section}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('BusinessCard')}>
            <Text style={styles.iconText}>여행자 명함</Text>
          </TouchableOpacity>
<<<<<<< HEAD
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("TravelCertificationMain")} >
=======
          <TouchableOpacity style={styles.iconButton}>
>>>>>>> dev
            <Text style={styles.iconText}>여행 인증서</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* 외부 서비스 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>외부 서비스</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.serviceButton}>
            <Text style={styles.serviceText}>KB 차차차</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceButton}>
            <Text style={styles.serviceText}>에어비앤비</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceButton}>
            <Text style={styles.serviceText}>티머니고</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceButton}>
            <Text style={styles.serviceText}>부킹닷컴</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 환율 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>환율 정보</Text>
        <View style={styles.exchangeInfo}>
          <Text style={styles.exchangeText}>뉴질랜드 NZD</Text>
          <Text style={styles.exchangeRate}>821.05</Text>
          <Text style={styles.exchangeChange}>-0.83%</Text>
        </View>
      </View>

      {/* 고객센터 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>고객센터</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>자주하는 질문</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>공지사항</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>사용 가이드</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.iconText}>챗봇 상담</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 프로필 설정 모달 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>프로필 설정</Text>
            {/* 프로필 설정 관련 내용 */}
            <Button title="로그아웃" onPress={handleLogout} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 24,
    marginRight: 8,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: '#e3f2fd',
  },
  profileIcon: {
    fontSize: 24,
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
  documentList: {
    flexDirection: 'column',
  },
  documentItem: {
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  documentText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: '45%',
    backgroundColor: '#e3f2fd',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  serviceButton: {
    width: '45%',
    backgroundColor: '#e3f2fd',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  exchangeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  exchangeText: {
    fontSize: 16,
  },
  exchangeRate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exchangeChange: {
    fontSize: 16,
    color: 'red',
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

export default HomeScreen;
