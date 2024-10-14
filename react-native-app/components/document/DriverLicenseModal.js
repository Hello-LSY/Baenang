import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Image, ActivityIndicator, Animated, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDriverLicense, fetchResidentRegistration } from '../../redux/documentItemSlice';
import { Ionicons } from "@expo/vector-icons";

const DriverLicenseModal = ({ visible, onClose }) => {
  // Animated Value 생성
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // 상태 추가: 상세 화면 보기 여부를 관리
  const [isDetailView, setIsDetailView] = useState(false);

  // 회전 애니메이션 함수
  const startRotationAnimation = () => {
    // 0에서 1로 값을 변경하여 180도 회전 애니메이션 구현
    Animated.timing(rotateAnim, {
      toValue: isDetailView ? 0 : 2, // isDetailView 상태에 따라 애니메이션 방향 전환
      duration: 300, // 애니메이션 지속 시간 (ms)
      useNativeDriver: true, // 네이티브 드라이버 사용
    }).start(() => {
      // 애니메이션 완료 후 상세보기 상태 변경
      setIsDetailView(!isDetailView);
    });
  };

  // rotationAnim 값을 0~1 범위에서 0~180도로 변환
  const rotateY = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'], // 0에서 180도 회전
  });

  const dispatch = useDispatch();

  // Redux 상태에서 문서 데이터 가져오기
  const { residentRegistration, driverLicense, isLoading, error } = useSelector((state) => state.documentItem);

  // 모달이 열릴 때 운전면허증과 주민등록증 데이터를 가져오기
  useEffect(() => {
    if (visible) {
      dispatch(fetchDriverLicense());
      dispatch(fetchResidentRegistration());
      rotateAnim.setValue(0); // 모달이 열릴 때마다 애니메이션 초기화
      setIsDetailView(false); // 모달이 열릴 때 상세보기 상태 초기화
    }
  }, [visible, dispatch]);

  const formatDate = (dateArray) => {
    // dateArray가 배열인지 확인하고, 길이가 3(연도, 월, 일)인지 확인
    if (!Array.isArray(dateArray) || dateArray.length !== 3) return 'Invalid Date';
  
    const [year, month, day] = dateArray;
  
    // 월과 일이 2자리로 표시되도록 padStart 사용
    const formattedMonth = String(month).padStart(2, '0'); // 월을 두 자리로 변환 (e.g., 1 -> 01)
    const formattedDay = String(day).padStart(2, '0'); // 일을 두 자리로 변환 (e.g., 1 -> 01)
  
    // YYYY-MM-DD 형식으로 변환하여 반환
    return `${year}/${formattedMonth}/${formattedDay}`;
  };
  

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          {/* 애니메이션 적용된 뷰 */}
          <Animated.View style={[styles.modalView, { transform: [{ rotateY }] }]}>
            <View style={styles.topColor}></View>

            {/* 닫기 버튼 */}
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </Pressable>

            {/* 상세보기/간략보기 버튼 */}
            <Pressable style={styles.detailButton} onPress={startRotationAnimation}>
              <Text style={styles.detailText}>{isDetailView ? '간략 보기' : '상세보기'}</Text>
            </Pressable>

            {/* 모달 타이틀 - 위치 고정 */}
            <Text style={styles.modalTitle}>{'운전면허증'}</Text>
            <Text style={styles.modalTitleEng}>{"Driver's License"}</Text>

            {/* 스크롤 가능한 콘텐츠 영역 */}
            <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
              {/* ScrollView 안쪽에 새로운 View로 감싸고 onStartShouldSetResponder 속성 추가 */}
              <View onStartShouldSetResponder={() => true} style={styles.innerContentView}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                  <Text>Error: {error}</Text>
                ) : driverLicense && residentRegistration ? (
                  <View style={styles.infoContainer}>
                    {isDetailView ? (
                      <View style={styles.dataContainer}>
                        <Text style={styles.textLabel}>성명</Text>
                        <Text style={styles.textDetailInfo}>{residentRegistration.name}</Text>
                        <Text style={styles.textLabel}>주민등록번호</Text>
                        <Text style={styles.textDetailInfo}>{residentRegistration.rrn}</Text>
                        <Text style={styles.textLabel}>등록주소</Text>
                        <Text style={styles.textDetailInfo}>{driverLicense.address}</Text>
                        <Text style={styles.textLabel}>운전면허번호</Text>
                        <Text style={styles.textDetailInfo}>{driverLicense.dln}</Text>
                        <Text style={styles.textLabel}>관리번호</Text>
                        <Text style={styles.textDetailInfo}>{driverLicense.managementNumber}</Text>
                        <Text style={styles.textLabel}>면허기간</Text>
                        <Text style={styles.textDetailInfo}>{formatDate(driverLicense.issueDate)} ~ {formatDate(driverLicense.expiryDate)}</Text>
                      </View>
                    ) : (
                      <View style={styles.dataContainer}>
                        {/* 운전면허증 이미지 표시 */}
                        {driverLicense.imagePath && (
                          <View style={styles.imageContainer}>
                            <Image
                              source={require('../../assets/images/document/testImage.jpg')}
                              style={styles.image}
                            />
                          </View>
                        )}
                        {/* 운전면허증 정보 표시 */}
                        <Text style={styles.textName}>{residentRegistration.name}</Text>
                        <Text style={styles.textLabel}>운전면허 번호</Text>
                        <Text style={styles.textInfo}>{driverLicense.dln}</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text>운전면허증 정보를 불러올 수 없습니다.</Text>
                )}
              </View>
            </ScrollView>

            {/* Issuer - 하단 고정 */}
            <Text style={styles.textIssuer}>{driverLicense ? driverLicense.issuer : ''}</Text>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    width: 300,
    height: 470,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 30,
    justifyContent: 'flex-start', // 상단부터 배치
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backfaceVisibility: 'hidden', // 뷰 회전할 때 뒷면이 보이지 않도록 설정
  },
  topColor:{
    width: 300,
    height: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    backgroundColor: '#64B5F6',
  },
  scrollView: {
    flex: 1,
    width: '100%',
    marginTop: 30,
    marginBottom: 20,
  },
  dataContainer: {
    alignItems: 'center',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  innerContentView: {
    width: '100%',
    padding: 10,
  },
  closeButton: {
    position: 'absolute',
    top: -45,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 5,
  },
  detailButton: {
    position: 'absolute',
    bottom: -50,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
  },
  detailText: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalTitle: {
    position: 'absolute',
    top: 45,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitleEng: {
    fontSize: 15,
    fontWeight: 'semibold',
    color: '#495057',
    position: 'absolute',
    top: 70,
  },
  textIssuer: {
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 25,
    fontSize: 15,
    textAlign: 'center',
  },
  infoContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 140,
    height: 180,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: 140,
    height: 180,
  },
  textName: {
    fontWeight: 'bold',
    fontSize: 20,
    marginVertical: 5,
    letterSpacing: 5,
    textAlign: 'center',
  },
  textLabel: {
    fontWeight: 'bold',
    fontSize: 15,
    marginVertical: 5,
    marginTop: 15,
    textAlign: 'center',
    backgroundColor: '#64B5F6',
    color: 'white',
    padding: 5,
    width: 230,
  },
  textInfo: {
    fontWeight: 'bold',
    fontSize: 18,
    marginVertical: 5,
    textAlign: 'center',
  },
  textDetailInfo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
  },
});

export default DriverLicenseModal;
