import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
  Modal,
  Button,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchBusinessCard,
  clearBusinessCard,
} from '../../redux/businessCardSlice';
import QRCode from 'react-native-qrcode-svg';
import { BASE_URL, S3_URL } from '../../constants/config';
import {
  addFriendByBusinessCardId,
  removeFriendByBusinessCardId,
  fetchFriendsList,
} from '../../redux/friendSlice';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera'; // Using expo-camera
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Circle,
} from 'react-native-svg';
const BackgroundSvg = ({ style }) => (
  <Svg
    height="100%"
    width="100%"
    style={[StyleSheet.absoluteFillObject, style]}
  >
    <Defs>
      <LinearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <Stop offset="0%" stopColor="#FF6F91" />
        <Stop offset="50%" stopColor="#6FD3F3" />
        <Stop offset="100%" stopColor="#FFB3D9" />
      </LinearGradient>
    </Defs>
    <Rect width="100%" height="100%" fill="#f0f0f0" />
    <Circle cx="-5%" cy="50%" r="60%" fill="url(#gradient)" opacity="0.7" />
  </Svg>
);
// SNS 아이콘 반환 함수
const getSnsIcon = (platform) => {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <FontAwesome name="facebook" size={18} color="#3b5998" />;
    case 'instagram':
      return <FontAwesome name="instagram" size={18} color="#E1306C" />;
    case 'twitter':
      return <FontAwesome name="twitter" size={18} color="#1DA1F2" />;
    default:
      return null;
  }
};

// SNS 플랫폼과 아이디 분리 함수
const parseSnsInfo = (sns) => {
  if (!sns) return { platform: '', snsId: '' };
  const [platform, snsId] = sns.split('_');
  return { platform, snsId };
};

const BusinessCardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { businessCard, loading } = useSelector((state) => state.businessCard);
  const { friendsList } = useSelector((state) => state.friend);
  const [businessCardIdInput, setBusinessCardIdInput] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [friendModalVisible, setFriendModalVisible] = useState(false);

  // 명함 정보 조회
  useEffect(() => {
    if (auth.token && auth.memberId) {
      dispatch(fetchBusinessCard(auth.memberId));
      dispatch(fetchFriendsList(auth.memberId));
    }
    return () => {
      dispatch(clearBusinessCard());
    };
  }, [auth.token, auth.memberId, dispatch]);

  // 카메라 권한 요청
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        Alert.alert(
          'Error',
          '카메라 권한을 요청하는 동안 오류가 발생했습니다.'
        );
        console.error('Camera permission error: ', error);
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>카메라 접근 권한을 요청 중입니다...</Text>;
  }
  if (hasPermission === false) {
    return <Text>카메라 접근 권한이 없습니다.</Text>;
  }

  // Card ID로 친구 추가하기
  const handleAddFriendById = (businessCardId) => {
    if (!businessCardId) {
      Alert.alert('Error', '명함 ID를 입력해주세요.');
      return;
    }
    dispatch(
      addFriendByBusinessCardId({ memberId: auth.memberId, businessCardId })
    )
      .then(() => {
        Alert.alert('Success', '친구가 성공적으로 추가되었습니다.');
        dispatch(fetchFriendsList(auth.memberId));
      })
      .catch(() => {
        Alert.alert('Error', '친구 추가에 실패했습니다.');
      });
  };

  // QR코드 스캔 핸들러
  const handleBarCodeScanned = ({ data }) => {
    // Alert로 스캔 이벤트 확인
    Alert.alert('QR 스캔', 'QR 코드가 스캔되었습니다.');
    console.log('Scanned data:', data);
    setScanned(true);
    setIsScanning(false);

    try {
      const businessCardData = JSON.parse(data);
      const { cardId } = businessCardData;

      if (cardId) {
        // 스캔된 cardId로 바로 친구 추가 시도
        dispatch(
          addFriendByBusinessCardId({
            memberId: auth.memberId,
            businessCardId: cardId,
          })
        )
          .then(() => {
            Alert.alert('성공', '새로운 친구가 추가되었습니다.');
            dispatch(fetchFriendsList(auth.memberId)); // 친구 목록 새로고침
          })
          .catch((error) => {
            Alert.alert('오류', '친구 추가에 실패했습니다: ' + error.message);
          });
      } else {
        Alert.alert('오류', 'QR 코드에서 유효한 명함 ID를 찾을 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('오류', 'QR 코드 데이터가 유효하지 않습니다.');
    }
  };

  // QR 스캐너 시작 버튼 핸들러
  const handleStartScan = () => {
    setIsScanning(true);
    setScanned(true);
    console.log('스캐너시작중');
  };

  // 스캔 취소 버튼 핸들러
  const handleCancelScan = () => {
    setIsScanning(false);
  };

  // 친구 클릭 시 모달 열기
  const handleFriendPress = (friend) => {
    setSelectedFriend(friend);
    setFriendModalVisible(true);
  };

  const openAddFriendModal = () => {
    setModalVisible(true);
  };

  const closeAddFriendModal = () => {
    setModalVisible(false);
  };

  const handleRemoveFriend = (businessCardId) => {
    // auth 객체에서 memberId를 안전하게 가져오기
    const memberId = auth?.memberId;

    if (!memberId) {
      Alert.alert('Error', '로그인 정보를 찾을 수 없습니다.');
      return;
    }

    console.log(
      'Deleting friend with memberId:',
      memberId,
      'and businessCardId:',
      businessCardId
    ); // 확인용 로그

    Alert.alert(
      '친구 삭제',
      '이 친구를 정말로 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          onPress: () => {
            dispatch(removeFriendByBusinessCardId({ memberId, businessCardId }))
              .then(() => {
                Alert.alert('성공', '친구가 삭제되었습니다.');
                dispatch(fetchFriendsList(memberId)); // 친구 목록 새로고침
              })
              .catch(() => {
                Alert.alert('오류', '친구 삭제에 실패했습니다.');
              });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderRightActions = (businessCardId) => {
    // console.log(
    //   'Attempting to delete friend with businessCardId:',
    //   businessCardId
    // ); // 확인용 로그
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveFriend(businessCardId)}
      >
        <View style={styles.deleteButtonContent}>
          <Ionicons name="trash-outline" size={24} color="white" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : isScanning ? (
        <View style={styles.scannerContainer}>
          {/* CameraView 컴포넌트를 사용 */}
          <CameraView
            style={[StyleSheet.absoluteFillObject, styles.cameraStyle]} // 전체 화면을 차지하도록 설정
            onBarcodeScanned={scanned ? handleBarCodeScanned : undefined}
            barCodeScannerSettings={{
              barCodeTypes: ['qr'],
            }}
            autofocus="on"
          />
          {/* 오버레이 영역 */}
          <View style={styles.overlay} pointerEvents="none">
            <View style={styles.scanArea}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>
          </View>
          <View style={styles.scanTextContainer}>
            <Text style={styles.scanText}>QR코드를 스캔해주세요</Text>
          </View>
          {/* 다시 스캔 버튼 */}
          {/* {scanned && (
            <Button title={"다시 스캔"} onPress={() => setScanned(false)} />
          )} */}

          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity
              style={styles.scanButton}
              onPress={handleStartScan}
            > */}
            {/* <Text style={styles.scanButtonText}>QR 코드 스캔 시작</Text> */}
            {/* </TouchableOpacity> */}
          </View>
          {/* 취소 버튼 */}
          <TouchableOpacity
            style={styles.cancelScanButton}
            onPress={handleCancelScan}
          >
            <Text style={styles.cancelScanButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          {/* 나의 여행 명함 영역 */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>나의 여행 명함</Text>
          </View>

          {/* 자신의 명함 영역 */}
          <View style={styles.cardContainer}>
            {businessCard ? (
              <View style={styles.businessCard}>
                <View style={styles.cardHeader}>
                  <Image
                    source={{ uri: `${S3_URL}/${businessCard.imageUrl}` }}
                    style={styles.businessCardImage}
                    resizeMode="cover"
                  />
                  <View style={styles.qrCodeWrapper}>
                    <QRCode value={JSON.stringify(businessCard)} size={90} />
                  </View>
                </View>
                <View style={styles.cardDetails}>
                  <View style={styles.nameSnsContainer}>
                    <Text style={styles.nameText}>{businessCard.name}</Text>
                    <View style={styles.snsContainer}>
                      {getSnsIcon(parseSnsInfo(businessCard.sns).platform)}
                      <Text style={styles.snsText}>
                        {parseSnsInfo(businessCard.sns).snsId}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.subText}>{businessCard.email}</Text>
                  <Text style={styles.introductionText}>
                    {businessCard.introduction}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.iconEditButton}
                  onPress={() =>
                    navigation.navigate('UpdateBusinessCard', {
                      businessCardId: businessCard.cardId,
                    })
                  }
                >
                  <FontAwesome name="edit" size={20} color="#3498db" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => navigation.navigate('CreateBusinessCard')}
                >
                  <Text style={styles.createButtonText}>명함 생성하기</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 명함 수첩 영역 */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>명함 수첩</Text>
            </View>
            <TouchableOpacity
              style={styles.addFriendButton}
              onPress={openAddFriendModal}
            >
              <Ionicons name="add-circle-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.friendsSection}>
            <View style={styles.friendsListSection}>
              {friendsList.length > 0 ? (
                friendsList.map((friend, index) => (
                  <Swipeable
                    key={index}
                    renderRightActions={() => renderRightActions(friend.cardId)} // 슬라이드 시 나타나는 삭제 버튼 추가
                  >
                    <TouchableOpacity
                      key={index}
                      style={styles.friendCard}
                      onPress={() => handleFriendPress(friend)}
                    >
                      <Image
                        source={{
                          uri: `${S3_URL}/${friend.imageUrl}`,
                        }}
                        style={styles.friendImage}
                      />
                      <View style={styles.friendInfo}>
                        <Text style={styles.friendCardText}>{friend.name}</Text>
                        <Text style={styles.friendSubText}>
                          {friend.country}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Swipeable>
                ))
              ) : (
                <Text style={styles.noFriendsText}>
                  새로운 친구를 만들어보세요!
                </Text>
              )}
            </View>
          </View>

          {/* 친구 추가 모달 */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={closeAddFriendModal}
          >
            <View style={styles.addFriendModalContainer}>
              <View style={styles.addFriendModalContent}>
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={closeAddFriendModal}
                >
                  <AntDesign name="close" size={20} color="black" />
                </TouchableOpacity>
                <View style={styles.myIdSection}>
                  <Text style={styles.addFriendModalCardIdTitle}>
                    내 명함 ID
                  </Text>
                  <Text style={styles.addFriendModalCardId}>
                    {businessCard?.cardId}
                  </Text>
                </View>
                <Text style={styles.addFriendModalCardIdTitle}>
                  추가할 사용자의 ID를 입력하세요.
                </Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="친구 명함 ID 입력"
                  placeholderTextColor="#999"
                  value={businessCardIdInput}
                  onChangeText={setBusinessCardIdInput}
                />
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    closeAddFriendModal();
                    handleAddFriendById(businessCardIdInput);
                  }}
                >
                  <Text style={styles.modalButtonText}>추가하기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => {
                    closeAddFriendModal();
                    handleStartScan();
                  }}
                >
                  <FontAwesome name="qrcode" size={18} color="#3498db" />
                  <Text style={styles.qrButtonText}>QR Code로 추가하기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* 친구 상세 정보 모달 */}
          <Modal
            visible={friendModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setFriendModalVisible(false)}
          >
            <View style={styles.friendModalContainer}>
              <View style={styles.friendModalContent}>
                <BackgroundSvg />
                <View style={styles.friendCardContainer}>
                  <TouchableOpacity
                    style={styles.closeIcon}
                    onPress={() => setFriendModalVisible(false)}
                  >
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                  {selectedFriend && (
                    <View style={styles.cardContent}>
                      <View style={styles.imageContainer}>
                        <Image
                          source={{
                            uri: `${S3_URL}/${selectedFriend.imageUrl}`,
                          }}
                          style={styles.modalFriendImage}
                        />
                      </View>
                      <View style={styles.infoContainer}>
                        <Text style={styles.modalFriendName}>
                          {selectedFriend.name}
                        </Text>
                        <View style={styles.friendSnsContainer}>
                          {getSnsIcon(
                            parseSnsInfo(selectedFriend.sns).platform
                          )}
                          <Text style={styles.snsText}>
                            {parseSnsInfo(selectedFriend.sns).snsId}
                          </Text>
                        </View>
                        <Text style={styles.modalFriendInfo}>
                          {selectedFriend.email}
                        </Text>
                        <Text style={styles.modalFriendInfo}>
                          {selectedFriend.introduction}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f9ff',
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerContainer: {
    flex: 1,
    flexDirection: 'column',
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cancelScanButton: {
    width: '60%',
    padding: 10,
    position: 'absolute',
    bottom: -70,
    backgroundColor: '#3498db',
    borderRadius: 30,
    alignItems: 'center',
  },
  cancelScanButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginVertical: 5,
  },
  titleContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#black',
  },
  cardContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    backgroundColor: '#f4f9ff',
    borderRadius: 10,
    marginBottom: 20,
  },
  businessCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  businessCardImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  qrCodeWrapper: {
    alignSelf: 'flex-start',
    marginRight: 0,
  },
  iconEditButton: {
    position: 'absolute',
    bottom: 15,
    right: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 50,
  },
  cardDetails: {
    alignItems: 'flex-start',
    marginTop: 10,
    marginLeft: 5,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  snsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  snsText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 15,
  },
  nameSnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  introductionText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 10,
  },
  friendsSection: {
    marginTop: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f4f9fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    paddingLeft: 16,
    alignItems: 'flex-start',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#34495e',
  },
  addFriendButton: {
    padding: 5,
    borderRadius: 50,
  },
  friendsListSection: {
    marginTop: 10,
  },
  friendCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendInfo: {
    flexDirection: 'column',
  },
  friendCardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
  },
  friendSubText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  noFriendsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  addFriendModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  addFriendModalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  addFriendModalCardIdTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  addFriendModalCardId: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#7f8c8d',
    textAlign: 'center',
  },
  closeIcon: {
    position: 'absolute',
    top: -40,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 5,
  },
  modalInput: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButton: {
    // width: '80%',
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  qrButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#3498db',
  },
  friendModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  friendModalContent: {
    width: '90%',
    aspectRatio: 90 / 55,
    maxWidth: 400,
    backgroundColor: '#transparent',
    overflow: 'hidden',
    borderRadius: 10,
  },
  friendCardContainer: {
    flex: 1,
    padding: 20,
  },
  closeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFriendImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    marginLeft: 40,
    borderRadius: 60,
  },
  infoContainer: {
    flex: 2,
    marginLeft: 70,
  },
  modalFriendName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  friendSnsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  snsText: {
    marginLeft: 5,
  },
  modalFriendInfo: {
    marginBottom: 5,
  },
  myIdSection: {
    backgroundColor: '#E3F2FD',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginBottom: 30,
    width: '100%',
  },
  cameraStyle: {
    // borderWidth: 2, // 카메라 뷰에 테두리 적용
    // borderColor: 'red', // 테두리 색상
    borderRadius: 10, // 둥근 모서리
    margin: 20, // 외부 여백 추가
  },
  overlay: {
    // flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
  },
  scanTextContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00ff00',
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00ff00',
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#00ff00',
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#00ff00',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: '88.5%',
  },
  deleteButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BusinessCardScreen;
