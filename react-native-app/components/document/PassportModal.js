import React, { useEffect, useRef, useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Image, ActivityIndicator, Animated, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPassport } from '../../redux/documentItemSlice';
import { Ionicons } from "@expo/vector-icons";

const PassportModal = ({ visible, onClose }) => {
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
  const { passport, isLoading, error } = useSelector((state) => state.documentItem);

  // 모달이 열릴 때 데이터를 가져오기
  useEffect(() => {
    if (visible) {
      dispatch(fetchPassport());
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
            <Text style={styles.modalTitle}>{'여권'}</Text>
            <Text style={styles.modalTitleEng}>{"Passport"}</Text>

            {/* 스크롤 가능한 콘텐츠 영역 */}
            <ScrollView contentContainerStyle={styles.scrollViewContent} style={styles.scrollView}>
              {/* ScrollView 안쪽에 새로운 View로 감싸고 onStartShouldSetResponder 속성 추가 */}
              <View onStartShouldSetResponder={() => true} style={styles.innerContentView}>
                {isLoading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : error ? (
                  <Text>Error: {error}</Text>
                ) : passport ? (
                  <View style={styles.infoContainer}>
                    {isDetailView ? (
                      <View style={styles.dataContainer}>
                        <Text style={styles.textLabel}>성명(Name)</Text>
                        <Text style={styles.textDetailInfo}>{passport.koreanName} ({passport.givenName} {passport.surName})</Text>
                        <Text style={styles.textLabel}>여권번호(Passport No.)</Text>
                        <Text style={styles.textDetailInfo}>{passport.pn}</Text>
                        <Text style={styles.textLabel}>생년월일(Day of Birth)</Text>
                        <Text style={styles.textDetailInfo}>{formatDate(passport.birth)}</Text>
                        <Text style={styles.textLabel}>성별(Sex)</Text>
                        <Text style={styles.textDetailInfo}>{passport.gender}</Text>
                        <Text style={styles.textLabel}>종류(Type)</Text>
                        <Text style={styles.textDetailInfo}>{passport.type}</Text>
                        <Text style={styles.textLabel}>국적(Nationality)</Text>
                        <Text style={styles.textDetailInfo}>{passport.nationality}</Text>
                        <Text style={styles.textLabel}>국가코드(Country code)</Text>
                        <Text style={styles.textDetailInfo}>{passport.countryCode}</Text>
                        <Text style={styles.textLabel}>발급일(Date of Issue)</Text>
                        <Text style={styles.textDetailInfo}>{formatDate(passport.issueDate)}</Text>
                        <Text style={styles.textLabel}>만료일(Date of Expiry)</Text>
                        <Text style={styles.textDetailInfo}>{formatDate(passport.expiryDate)}</Text>
                      </View>
                    ) : (
                      <View style={styles.dataContainer}>
                        {/*이미지 표시 */}
                        {passport.imagePath && (
                          <View style={styles.imageContainer}>
                            <Image
                              source={require('../../assets/images/document/testImage.jpg')}
                              style={styles.image}
                            />
                          </View>
                        )}
                        {/* 정보 표시 */}
                        <Text>
                          <Text style={styles.textName}>{passport.koreanName}</Text>
                          {' '} {/* 공백 추가 */}
                            <Text style={styles.textDetailInfo}>({passport.givenName} {passport.surName})</Text>
                        </Text>
                        <Text style={styles.textLabel}>여권 번호</Text>
                        <Text style={styles.textInfo}>{passport.pn}</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <Text>여권 정보를 불러올 수 없습니다.</Text>
                )}
              </View>
            </ScrollView>

            {/* Issuer - 하단 고정 */}
            <Text style={styles.textIssuer}>{passport ? passport.authority : ''}</Text>
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
      backgroundColor: '#B29CE4',
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
      backgroundColor: '#B29CE4',
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
  

export default PassportModal;