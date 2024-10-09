import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  RefreshControl,
  Dimensions,
  Animated,
} from 'react-native';
import { useAuth } from '../../redux/authState';
import { useExchangeRate } from '../../redux/exchangeRateState';
import DocumentWallet2 from '../../components/DocumentWallet2';
import ServiceButton from '../../components/ServiceButton';
import BussinessCard from '../../assets/icons/ID.png';
import TravelCertification from '../../assets/icons/MAP.png';
import Exchange from '../../assets/icons/FINANCE.png';
import TravelTest from '../../assets/icons/PACKAGE.png';
import ExternalServiceButton from '../../components/ExternalServiceButton';
import kbs from '../../assets/icons/kb손해보험.png';
import kbc from '../../assets/icons/kb차차차.png';
import tmg from '../../assets/icons/티머니고.png';
import agoda from '../../assets/icons/아고다.png';
import booking from '../../assets/icons/부킹닷컴.png';
import airbnb from '../../assets/icons/에어비앤비.png';
import CustomButton from '../../components/CustomButton';
import ProfileButton from '../../components/ProfileButton';
import { Feather, AntDesign } from '@expo/vector-icons';
import FlagIcon from '../../components/FlagIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { auth, logout } = useAuth();
  const { allRatesWithChange, fetchAllRatesWithChangeData, loading } = useExchangeRate();
  const scrollX = new Animated.Value(0);

  useEffect(() => {
    fetchAllRatesWithChangeData();
  }, []);

  const documents = [
    { title: '주민등록증', isNew: false },
    { title: '운전면허증', isNew: true },
    { title: '여권', isNew: true },
    { title: '여행보험증명서', isNew: false },
    { title: '예방접종증명서', isNew: false },
    { title: '출입국사실증명서', isNew: true },
    { title: '국제학생증', isNew: false },
    { title: '여행보험증명서', isNew: false },
  ];

  const backgroundColors = [
    '#EEEDDB',
    '#93EDFF',
    '#C2B4FD',
    '#78E8E1',
    '#BFEF82',
    '#6DE7AC',
    '#FFB268',
    '#FFD974',
  ];

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllRatesWithChangeData();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleLogout = () => {
    logout();
    toggleModal();
    navigation.navigate('Login');
  };

  const handleEditProfile = () => {
    toggleModal();
    navigation.navigate('UserProfile');
  };

  const getPercentageColor = (decreasing) => {
    return decreasing ? 'blue' : 'red';
  };

  const handleNext = () => {
    if (currentIndex < allRatesWithChange.length - 1) {
      Animated.spring(scrollX, {
        toValue: (currentIndex + 1) * SCREEN_WIDTH * 0.7,
        useNativeDriver: true,
      }).start();
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      Animated.spring(scrollX, {
        toValue: (currentIndex - 1) * SCREEN_WIDTH * 0.7,
        useNativeDriver: true,
      }).start();
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleExchangeRateClick = (currencyCode) => {
    navigation.navigate('ExchangeRateDetail', { currencyCode });
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerGreeting}>즐거운 여행 되세요,</Text>
          <Text style={styles.headerName}>
            {auth.nickname ? `${auth.nickname} 님` : '즐거운 여행 되세요'}
          </Text>
        </View>
        <ProfileButton onPress={toggleModal} />
      </View>

      <ScrollView style={styles.container}>
        <DocumentWallet2 title="내 문서" documents={documents} backgroundColors={backgroundColors} />
      </ScrollView>

      <View style={styles.servicecontainer}>
        <ServiceButton
          title="여행자 명함"
          subtitle="여행 중 만난 인연을 이 안에 넣어요"
          imgSrc={BussinessCard}
          imgSize={75}
          onPress={() => navigation.navigate('BusinessCard')}
        />
        <ServiceButton
          title="여행 인증서"
          subtitle="내가 여행한 곳을 한 눈에 확인해요"
          imgSrc={TravelCertification}
          imgSize={75}
          onPress={() => navigation.navigate('TravelCertificationMain')}
        />
      </View>
      <View style={styles.servicecontainer}>
        <ServiceButton
          title="실시간 환율"
          subtitle="실시간으로 확인해요"
          imgSrc={Exchange}
          imgSize={75}
          onPress={() => navigation.navigate('ExchangeRateListScreen')}
        />
        <ServiceButton
          title="여행자 테스트"
          subtitle="내 여행 스타일을 알아봐요"
          imgSrc={TravelTest}
          imgSize={75}
          onPress={() => navigation.navigate('TravelerPersonalityTest')}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>실시간 환율</Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : allRatesWithChange.length > 0 ? (
          <Animated.View style={[styles.exchangeRateWrapper, { transform: [{ translateX: scrollX }] }]}>
            <TouchableOpacity onPress={handlePrevious} disabled={currentIndex === 0}>
              <AntDesign name="left" size={24} color={currentIndex === 0 ? '#ccc' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleExchangeRateClick(allRatesWithChange[currentIndex]?.currencyCode)}>
              <View style={styles.exchangeItem}>
                <View style={styles.flagContainer}>
                  <FlagIcon
                    currencyCode={allRatesWithChange[currentIndex]?.currencyCode.replace("(100)", "").trim()}
                    size={40}
                  />
                </View>
                <View style={styles.exchangeInfo}>
                  <Text style={styles.currencyCode}>{allRatesWithChange[currentIndex]?.currencyCode}</Text>
                  <Text style={styles.currencyName}>{allRatesWithChange[currentIndex]?.currencyName}</Text>
                </View>
                <View style={styles.exchangeRateContainer}>
                  <Text style={[styles.exchangeRate, { color: 'black' }]}> {allRatesWithChange[currentIndex]?.exchangeRateValue.toFixed(2)}</Text>
                  <Text
                    style={[styles.exchangeChange, { color: getPercentageColor(allRatesWithChange[currentIndex]?.decreasing) }]}
                  >
                    {allRatesWithChange[currentIndex]?.exchangeChangePercentage !== null
                      ? `${allRatesWithChange[currentIndex].exchangeChangePercentage >= 0 ? '+' : ''}${allRatesWithChange[currentIndex].exchangeChangePercentage.toFixed(2)}%`
                      : 'N/A'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} disabled={currentIndex === allRatesWithChange.length - 1}>
              <AntDesign name="right" size={24} color={currentIndex === allRatesWithChange.length - 1 ? '#ccc' : '#000'} />
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Text>환율 정보가 없습니다.</Text>
        )}
      </View>

      <View style={styles.section}>
      <Text style={styles.sectionTitle}>외부 서비스</Text>
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

      

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>고객센터</Text>
        <Text style={styles.sectionSubtitle}>
          {'운영시간 평일 10:00 - 18:00 (토 일, 공휴일 휴무)\n점심시간 평일 13:00 - 14:00\n'}
        </Text>

        <View style={styles.row}>
          <CustomButton
            title="자주 묻는 질문"
            style={styles.cscenter}
            textStyle={styles.cscenterText}
            onPress={() => navigation.navigate('CustomerService')}
          />
          <CustomButton
            title="공지사항"
            style={styles.cscenter}
            textStyle={styles.cscenterText}
            onPress={() => navigation.navigate('CustomerService')}
          />
        </View>
        <View style={styles.row}>
          <CustomButton
            title="사용 가이드"
            style={styles.cscenter}
            textStyle={styles.cscenterText}
            onPress={() => navigation.navigate('CustomerService')}
          />
          <CustomButton
            title="챗봇 상담"
            style={styles.cscenter}
            textStyle={styles.cscenterText}
          />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.profileImage}
            />
            <Text style={styles.modalTitle}>{auth.nickname || '사용자'}</Text>

            <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
              <Feather name="edit" size={20} color="#333" style={styles.modalButtonIcon} />
              <Text style={styles.editProfileButtonText}>개인정보 수정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Feather name="log-out" size={20} color="#fff" style={styles.modalButtonIcon} />
              <Text style={styles.logoutButtonText}>로그아웃</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCloseButton} onPress={toggleModal}>
              <Text style={styles.modalCloseButtonText}>닫기</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: '100%',
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  headerGreeting: {
    fontSize: 18,
    fontWeight: 'normal',
  },
  headerName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
  },
  editProfileButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    justifyContent: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonIcon: {
    marginRight: 10,
  },
  modalCloseButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#ddd',
    alignItems: 'center',
    width: '100%',
  },
  modalCloseButtonText: {
    color: '#333',
    fontSize: 16,
  },
  servicecontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  section: {
    padding: 9,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionSubtitle:{
    marginTop:5,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exchangeRateWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exchangeItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    width: SCREEN_WIDTH * 0.7,
  },
  flagContainer: {
    marginRight: 10,
  },
  exchangeInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyName: {
    fontSize: 14,
    color: '#555',
  },
  exchangeRateContainer: {
    alignItems: 'flex-end',
  },
  exchangeRate: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  exchangeChange: {
    fontSize: 14,
    color: 'gray',
    marginTop: 3,
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
});

export default HomeScreen;