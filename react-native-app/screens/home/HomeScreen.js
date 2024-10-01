import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Button, FlatList } from 'react-native';
import { useAuth } from '../../redux/authState'; // useAuth 훅 import
import { useExchangeRate } from '../../redux/exchangeRateState'; // 환율 정보를 불러오기 위한 훅
import DocumentCard from '../../components/DocumentCard';
import ServiceButton from '../../components/ServiceButton';
import ExternalServiceButton from '../../components/ExternalServiceButton';
import CustomButton from '../../components/CustomButton';

// 아이콘 이미지 import
import BussinessCard from '../../assets/icons/ID.png';
import TravelCertification from '../../assets/icons/MAP.png';
import Community from '../../assets/icons/INFORM.png';
import Exchange from '../../assets/icons/FINANCE.png';
import TravelTest from '../../assets/icons/PACKAGE.png';
import kbs from '../../assets/icons/kb손해보험.png';
import kbc from '../../assets/icons/kb차차차.png';
import tmg from '../../assets/icons/티머니고.png';
import agoda from '../../assets/icons/아고다.png';
import booking from '../../assets/icons/부킹닷컴.png';
import airbnb from '../../assets/icons/에어비앤비.png';

const HomeScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { logout } = useAuth(); // useAuth 훅에서 logout 함수 가져오기
  const { top5Rates, fetchTop5Rates, loading } = useExchangeRate(); // 환율 정보 가져오기

  useEffect(() => {
    fetchTop5Rates(); // 컴포넌트가 마운트될 때 상위 5개 환율 정보 로드
  }, []);

  const toggleModal = () => {
    setModalVisible(prev => !prev);
  };

  const handleLogout = () => {
    logout(); // 로그아웃 함수 호출
    toggleModal(); // 모달 닫기
    navigation.navigate('Login'); // 로그아웃 후 로그인 화면으로 이동
  };

  // 각 통화 코드에 대한 추가 정보
  const getCurrencyDetails = (currencyCode) => {
    const currencyDetails = {
      AED: { name: '아랍에미리트 디르함', country: '아랍에미리트' },
      AUD: { name: '호주 달러', country: '호주' },
      CAD: { name: '캐나다 달러', country: '캐나다' },
      CNH: { name: '위안화', country: '중국' },
      DKK: { name: '덴마아크 크로네', country: '덴마크' },
      HKD: { name: '홍콩 달러', country: '홍콩' },
      'IDR(100)': { name: '인도네시아 루피아', country: '인도네시아' },
      'JPY(100)': { name: '일본 옌', country: '일본' },
      MYR: { name: '말레이지아 링기트', country: '말레이시아' },
      NOK: { name: '노르웨이 크로네', country: '노르웨이' },
      NZD: { name: '뉴질랜드 달러', country: '뉴질랜드' },
      SAR: { name: '사우디 리얄', country: '사우디아라비아' },
      SEK: { name: '스웨덴 크로나', country: '스웨덴' },
      THB: { name: '태국 바트', country: '태국' },
      USD: { name: '미국 달러', country: '미국' },
      EUR: { name: '유로', country: '유럽연합' },
      JPY: { name: '일본 엔', country: '일본' },
      GBP: { name: '영국 파운드', country: '영국' },
      // 추가 통화 정보
    };
    return currencyDetails[currencyCode] || { name: '알 수 없음', country: '알 수 없음' };
  };

  // 상위 5개 환율 정보를 표시하는 렌더 함수
  const renderExchangeRateItem = ({ item }) => {
    const currencyDetails = getCurrencyDetails(item.currencyCode);
    return (
      <TouchableOpacity 
        style={styles.exchangeItem} 
        onPress={() => navigation.navigate('ExchangeRateDetail', { currencyCode: item.currencyCode })}>
        <Text style={styles.exchangeCountry}>{currencyDetails.country}</Text>
        <Text style={styles.exchangeText}>{currencyDetails.name} ({item.currencyCode})</Text>
        <Text style={styles.exchangeRate}>{item.exchangeRateValue}</Text>
      </TouchableOpacity>
    );
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
          <DocumentCard title="주민등록증" subtitle="123456-1234567" color1="#4158D0" color2="#C850C0" />
          {['주민등록증', '운전면허증', '여권', '여행보험증명서', '예방접종증명서', '출입국사실증명서', '국제학생증', '여행보혐증명서'].map((doc, index) => (
            <TouchableOpacity key={index} style={[styles.documentItem, { backgroundColor: getColor(index) }]}>
              <Text style={styles.documentText}>{doc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 서비스 버튼 섹션 */}
      <View style={styles.servicecontainer}>
        <ServiceButton title="여행자 명함" subtitle="여행 중 만난 인연을 이 안에 넣어요" imgSrc={BussinessCard} imgSize={75} onPress={() => navigation.navigate('BusinessCard')} />
        <ServiceButton title="여행 인증서" subtitle="내가 여행한 곳을 한 눈에 확인해요" imgSrc={TravelCertification} imgSize={75} onPress={() => navigation.navigate('TravelCertificationMain')} />
      </View>

      <View style={styles.servicecontainer2}>
        <ServiceButton title="커뮤니티" imgSrc={Community} imgSize={60} onPress={() => navigation.navigate('Community')} />
        <ServiceButton title="환율" imgSrc={Exchange} imgSize={60} onPress={() => navigation.navigate('ExchangeRateList')} />
        <ServiceButton title="여행자 테스트" imgSrc={TravelTest} imgSize={60} onPress={() => navigation.navigate('Community')} />
      </View>

      {/* 외부 서비스 섹션 */}
      <View style={styles.section}>
        <View style={styles.row}>
          <ExternalServiceButton title="KB 차차차" imgSrc={kbc} />
          <ExternalServiceButton title="KB손해보험" imgSrc={kbs} />
        </View>
        <View style={styles.row}>
          <ExternalServiceButton title="에어비앤비" imgSrc={airbnb} />
          <ExternalServiceButton title="티머니고" imgSrc={tmg} />
        </View>
        <View style={styles.row}>
          <ExternalServiceButton title="부킹닷컴" imgSrc={booking} />
          <ExternalServiceButton title="아고다" imgSrc={agoda} />
        </View>
      </View>

      {/* 환율 정보 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>어제보다 더 싸요!</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={top5Rates} // top5Rates 배열을 데이터로 설정
            renderItem={renderExchangeRateItem}
            keyExtractor={(item) => item.currencyCode}
            horizontal={true} // 가로 스크롤 가능하게 설정
            showsHorizontalScrollIndicator={false}
            style={styles.exchangeList}
          />
        )}
      </View>

      {/* 고객센터 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>고객센터 1588-XXXX</Text>
        <Text style={styles.sectionSubtitle}>
          {'운영시간 평일 10:00 - 18:00 (토 일, 공휴일 휴무)\n점심시간 평일 13:00 - 14:00'}
        </Text>
        <View style={styles.row}>
          <CustomButton title="자주 묻는 질문" style={styles.cscenter} textStyle={styles.cscenterText} />
          <CustomButton title="공지사항" style={styles.cscenter} textStyle={styles.cscenterText} />
        </View>
        <View style={styles.row}>
          <CustomButton title="사용 가이드" style={styles.cscenter} textStyle={styles.cscenterText} />
          <CustomButton title="챗봇 상담" style={styles.cscenter} textStyle={styles.cscenterText} />
        </View>
      </View>

      {/* 프로필 설정 모달 */}
      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>프로필 설정</Text>
            <Button title="로그아웃" onPress={handleLogout} />
            <Button title="닫기" onPress={toggleModal} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

// 색상 선택 함수 (인덱스에 따라 다르게 설정)
const getColor = (index) => {
  const colors = ['#FFEB3B', '#8BC34A', '#00BCD4', '#FF9800', '#9C27B0', '#009688', '#3F51B5', '#E91E63'];
  return colors[index % colors.length];
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
  servicecontainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    width: '100%',
  },
  servicecontainer2: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  exchangeList: {
    marginTop: 12,
  },
  exchangeItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  exchangeCountry: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  exchangeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  exchangeRate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4caf50', // 환율 값에 대한 스타일
    marginTop: 5,
  },
  exchangeChange: {
    fontSize: 14,
    color: 'red', // 변화율에 대한 스타일
    marginTop: 3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#777',
    marginBottom: 8,
  },
  cscenter: {
    width: '48%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#87CEFA',
  },
  cscenterText: {
    color: 'white',
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
