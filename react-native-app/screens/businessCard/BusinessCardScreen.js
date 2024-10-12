import React, { useEffect, useState } from "react";
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
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchBusinessCard,
  clearBusinessCard,
} from "../../redux/businessCardSlice";
import QRCode from "react-native-qrcode-svg";
import { BASE_URL } from "../../constants/config";
import {
  addFriendByBusinessCardId,
  fetchFriendsList,
} from "../../redux/friendSlice";
import { Camera, CameraView, useCameraPermissions } from "expo-camera"; // Using expo-camera
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

// SNS 아이콘 반환 함수
const getSnsIcon = (platform) => {
  switch (platform.toLowerCase()) {
    case "facebook":
      return <FontAwesome name="facebook" size={18} color="#3b5998" />;
    case "instagram":
      return <FontAwesome name="instagram" size={18} color="#E1306C" />;
    case "twitter":
      return <FontAwesome name="twitter" size={18} color="#1DA1F2" />;
    default:
      return null;
  }
};

// SNS 플랫폼과 아이디 분리 함수
const parseSnsInfo = (sns) => {
  if (!sns) return { platform: "", snsId: "" };
  const [platform, snsId] = sns.split("_");
  return { platform, snsId };
};

const BusinessCardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { businessCard, loading } = useSelector((state) => state.businessCard);
  const { friendsList } = useSelector((state) => state.friend);
  const [businessCardIdInput, setBusinessCardIdInput] = useState("");
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
        setHasPermission(status === "granted");
      } catch (error) {
        Alert.alert("Error", "카메라 권한을 요청하는 동안 오류가 발생했습니다.");
        console.error("Camera permission error: ", error);
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
      Alert.alert("Error", "명함 ID를 입력해주세요.");
      return;
    }
    dispatch(
      addFriendByBusinessCardId({ memberId: auth.memberId, businessCardId })
    )
      .then(() => {
        Alert.alert("Success", "친구가 성공적으로 추가되었습니다.");
        dispatch(fetchFriendsList(auth.memberId));
      })
      .catch(() => {
        Alert.alert("Error", "친구 추가에 실패했습니다.");
      });
  };

  // QR코드 스캔 핸들러
  const handleBarCodeScanned = ({ data }) => {
    console.log("data : ", data);
    setScanned(true);
    setIsScanning(false);

    try {
      const businessCardData = JSON.parse(data);
      const { cardId } = businessCardData;

      if (cardId) {
        Alert.alert("QR 코드 스캔 완료", `스캔한 명함 ID: ${cardId}`);
        handleAddFriendById(cardId);
      } else {
        Alert.alert("Error", "QR 코드에서 유효한 명함 ID를 찾을 수 없습니다.");
      }
    } catch (error) {
      Alert.alert("Error", "QR 코드 데이터가 유효하지 않습니다.");
    }
  };

  // QR 스캐너 시작 버튼 핸들러
  const handleStartScan = () => {
    setIsScanning(true);
    setScanned(false);
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

  return (
    <ScrollView style={styles.container}>
       {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      ) : isScanning ? (
         <View style={styles.scannerContainer}>
          {/* Camera 컴포넌트를 사용 */}
          <CameraView
            style={StyleSheet.absoluteFillObject}
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            barCodeScannerSettings={{
              barCodeTypes: ["qr"],
            }}
          />
          <View style={styles.overlay}>
            <View style={styles.unfocusedContainer} />
            <View style={styles.middleContainer}>
              <View style={styles.unfocusedContainer} />
              <View style={styles.focusedContainer}>
                <Text style={styles.scanText}>QR코드를 스캔해주세요</Text>
              </View>
              <View style={styles.unfocusedContainer} />
            </View>
            <View style={styles.unfocusedContainer} />
          </View>
          {scanned && (
            <Button title={"다시 스캔"} onPress={() => setScanned(false)} />
          )}
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
            <MaterialIcons name="badge" size={30} color="#34495e" />
            <Text style={styles.title}>나의 여행 명함</Text>
          </View>

          {/* 자신의 명함 영역 */}
          <View style={styles.cardContainer}>
            {businessCard ? (
              <View style={styles.businessCard}>
                <View style={styles.cardHeader}>
                  <Image
                    source={{
                      uri: `${BASE_URL}/uploads/${businessCard.imageUrl}`,
                    }}
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
                    navigation.navigate("UpdateBusinessCard", {
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
                  onPress={() => navigation.navigate("CreateBusinessCard")}
                >
                  <Text style={styles.createButtonText}>명함 생성하기</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* 명함 수첩 영역 */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <MaterialIcons name="book" size={24} color="#34495e" />
              <Text style={styles.sectionTitle}>명함 수첩</Text>
            </View>
            <TouchableOpacity
              style={styles.addFriendButton}
              onPress={openAddFriendModal}
            >
              <FontAwesome name="plus" size={18} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.friendsSection}>
            <View style={styles.friendsListSection}>
              {friendsList.length > 0 ? (
                friendsList.map((friend, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.friendCard}
                    onPress={() => handleFriendPress(friend)}
                  >
                    <Image
                      source={{ uri: `${BASE_URL}/uploads/${friend.imageUrl}` }}
                      style={styles.friendImage}
                    />
                    <View style={styles.friendInfo}>
                      <Text style={styles.friendCardText}>{friend.name}</Text>
                      <Text style={styles.friendSubText}>{friend.country}</Text>
                    </View>
                  </TouchableOpacity>
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
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.addFriendModalCardId}>
                  내 명함 ID: {businessCard?.cardId}
                </Text>
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => {
                    closeAddFriendModal();
                    handleStartScan();
                  }}
                >
                  <FontAwesome name="qrcode" size={18} color="#3498db" />
                  <Text style={styles.qrButtonText}>QR Code</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.modalInput}
                  placeholder="친구 명함 ID 입력"
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
                  <Text style={styles.modalButtonText}>ID로 친구 추가</Text>
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
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => setFriendModalVisible(false)}
                >
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
                {selectedFriend && (
                  <>
                    <Image
                      source={{
                        uri: `${BASE_URL}/uploads/${selectedFriend.imageUrl}`,
                      }}
                      style={styles.modalFriendImage}
                    />
                    <View style={styles.modalNameSnsContainer}>
                      <Text style={styles.modalFriendName}>
                        {selectedFriend.name}
                      </Text>
                      <View style={styles.friendSnsContainer}>
                        {getSnsIcon(parseSnsInfo(selectedFriend.sns).platform)}
                        <Text style={styles.snsText}>
                          {parseSnsInfo(selectedFriend.sns).snsId}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.modalFriendInfo}>
                      {selectedFriend.email}
                    </Text>
                    <Text style={styles.modalFriendInfo}>
                      {selectedFriend.introduction}
                    </Text>
                  </>
                )}
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
    backgroundColor: "#f4f9ff",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scannerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: 'relative',
  },
  cancelScanButton: {
    position: "absolute",
    bottom: 50,
    padding: 10,
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
  cancelScanButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#2c3e50",
  },
  cardContainer: {
    alignItems: "center",
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
  },
  businessCard: {
    backgroundColor: "#f8f8f8",
    padding: 20,
    borderRadius: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "100%",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  businessCardImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  qrCodeWrapper: {
    alignSelf: "flex-start",
    marginRight: 0,
  },
  iconEditButton: {
    position: "absolute",
    bottom: 15,
    right: 10,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 50,
  },
  cardDetails: {
    alignItems: "flex-start",
    marginTop: 10,
    marginLeft: 5,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  snsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  snsText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginLeft: 15,
  },
  nameSnsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  introductionText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 10,
  },
  friendsSection: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#34495e",
  },
  addFriendButton: {
    padding: 5,
    borderRadius: 50,
  },
  friendsListSection: {
    marginTop: 10,
  },
  friendCard: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  friendImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  friendInfo: {
    flexDirection: "column",
  },
  friendCardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#34495e",
  },
  friendSubText: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  noFriendsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  addFriendModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  addFriendModalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  addFriendModalCardId: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#7f8c8d",
    marginBottom: 20,
    textAlign: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  qrButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  qrButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#3498db",
  },
  friendModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  friendModalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalFriendImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  modalFriendName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 0,
    lineHeight: 22,
  },
  modalFriendInfo: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 5,
    marginLeft: 5,
  },
  modalNameSnsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 10,
  },
  friendSnsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  snsText: {
    fontSize: 14,
    color: "#7f8c8d",
    marginLeft: 4,
    lineHeight: 22,
  },
});

export default BusinessCardScreen;