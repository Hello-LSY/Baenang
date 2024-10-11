import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Text, Pressable, TextInput, StyleSheet, Animated } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { requestVerification, verifyDocument, getDocument, clearDocumentState } from "../redux/documentSlice";
import { Ionicons } from "@expo/vector-icons";
import DriverLicenseModal from "./document/DriverLicenseModal";
import ISICModal from "./document/ISICModal";
import PassportModal from "./document/PassportModal";
import ResidentRegistrationModal from "./document/ResidentRegistrationModal";

const DocumentModal = ({ visible, document, onClose }) => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [rrn, setRrn] = useState("");
  const [code, setCode] = useState("");
  const [selectedDocumentModal, setSelectedDocumentModal] = useState(null); // 선택한 문서 모달 상태 관리
  const dispatch = useDispatch();

  const { isLoading, verificationRequested, documentInfo, error } = useSelector((state) => state.document);

  const slideAnim = useRef(new Animated.Value(-500)).current;

  // 모달 표시 여부에 따른 애니메이션 효과
  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -500,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  // getDocument 호출 및 token 만료 여부 확인
  useEffect(() => {
    if (visible && document) {
      dispatch(getDocument()); // 문서 정보를 가져오기 위해 getDocument 실행
    }
  }, [visible, document, dispatch]);

  // token 및 token_expiry 존재 여부 확인을 위한 useEffect
  useEffect(() => {
    const now = new Date();

    // tokenExpiry를 배열에서 Date 객체로 변환
    const tokenExpiry = documentInfo?.tokenExpiry
      ? new Date(
          documentInfo.tokenExpiry[0], // 연도
          documentInfo.tokenExpiry[1] - 1, // 월 (JavaScript에서는 0부터 시작)
          documentInfo.tokenExpiry[2], // 일
          documentInfo.tokenExpiry[3], // 시간
          documentInfo.tokenExpiry[4], // 분
          documentInfo.tokenExpiry[5], // 초
          documentInfo.tokenExpiry[6] // 밀리초
        )
      : null;

    // 토큰이 만료된 경우 상태 초기화 및 인증 요청 단계로 되돌림
    if (!documentInfo?.token || (tokenExpiry && tokenExpiry <= now)) {
      console.log("토큰 만료");
      dispatch(clearDocumentState()); // 상태 초기화
    }

    // 토큰이 유효하고 문서가 존재하면 페이지로 이동
    if (documentInfo?.token && tokenExpiry && tokenExpiry > now && document) {
      console.log("유효한 토큰");
      openSpecificDocumentModal(document?.title);
    }
  }, [documentInfo?.token, documentInfo?.tokenExpiry, document, dispatch]);

  // 인증 코드 요청 처리 함수
  const handleRequestVerification = () => {
    if (!email || !fullName || !rrn) {
      alert("이름, 이메일, 주민등록번호를 모두 입력해주세요.");
      return;
    }
    dispatch(requestVerification({ email, fullName, rrn }));
  };

  // 인증 코드 확인 처리 함수
  const handleVerification = () => {
    if (!code) {
      alert("인증 코드를 입력해주세요.");
      return;
    }
    dispatch(verifyDocument({ fullName, email, rrn, code })).then((action) => {
      if (action.type === "document/verifyDocument/fulfilled") {
        openSpecificDocumentModal(document?.title); // 인증 성공 시 해당 문서 모달로 이동
      }
    });
  };

  // 문서 모달 열기
  const openSpecificDocumentModal = (type) => {
    setSelectedDocumentModal(type);
    onClose(); // DocumentModal을 닫음
  };

  // 상태 초기화
  const resetState = () => {
    setEmail("");
    setFullName("");
    setRrn("");
    setCode("");
  };

  useEffect(() => {
    if (!visible) {
      resetState(); // 모달이 닫힐 때 상태 초기화
    }
  }, [visible]);

  if (!document) {
    return null; // document가 null인 경우 아무것도 렌더링하지 않음
  }

  return (
    <>
      {/* DocumentModal */}
      <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Animated.View style={[styles.centeredView, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.modalView}>
              {/* 닫기 버튼 */}
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="black" />
              </Pressable>

              {/* 문서 정보 */}
              <Text style={styles.modalText}>{document?.title || "문서 인증"}</Text>
              {document?.isNew && <Text style={styles.newTag}>NEW</Text>}

              {/* 본인 인증 필요 시 폼 */}
              <Text style={styles.instructionText}>본인 인증을 완료해야 합니다.</Text>

              {!verificationRequested ? (
                <>
                  {/* 이름 입력 */}
                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>이름</Text>
                    <TextInput
                      style={styles.input}
                      value={fullName}
                      onChangeText={setFullName}
                      placeholder="이름"
                    />
                  </View>

                  {/* 이메일 입력 */}
                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>이메일</Text>
                    <TextInput
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      placeholder="이메일"
                      keyboardType="email-address"
                    />
                  </View>

                  {/* 주민등록번호 입력 */}
                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>주민등록번호</Text>
                    <TextInput
                      style={styles.input}
                      value={rrn}
                      onChangeText={setRrn}
                      placeholder="주민등록번호"
                    />
                  </View>

                  {/* 인증 코드 요청 버튼 */}
                  {isLoading ? (
                    <Text>요청 중...</Text>
                  ) : (
                    <Pressable style={[styles.button, styles.buttonRequest]} onPress={handleRequestVerification}>
                      <Text style={styles.textStyle}>인증 코드 요청</Text>
                    </Pressable>
                  )}
                  {error && <Text style={{ color: "red" }}>{error}</Text>}
                </>
              ) : (
                <>
                  {/* 인증 코드 입력 */}
                  <Text style={styles.inputLabel}>인증 코드</Text>
                  <TextInput
                    style={styles.input}
                    value={code}
                    onChangeText={setCode}
                    placeholder="인증 코드"
                  />
                  {isLoading && <Text>인증 중...</Text>}
                  {error && <Text style={{ color: "red" }}>{error}</Text>}
                  
                  {/* 인증 버튼 */}
                  <Pressable style={[styles.button, styles.buttonRequest]} onPress={handleVerification}>
                    <Text style={styles.textStyle}>인증</Text>
                  </Pressable>
                </>
              )}
            </View>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* 각 문서 모달 */}
      <DriverLicenseModal visible={selectedDocumentModal === "운전면허증"} onClose={() => setSelectedDocumentModal(null)} />
      <ISICModal visible={selectedDocumentModal === "국제학생증"} onClose={() => setSelectedDocumentModal(null)} />
      <PassportModal visible={selectedDocumentModal === "여권"} onClose={() => setSelectedDocumentModal(null)} />
      <ResidentRegistrationModal visible={selectedDocumentModal === "주민등록증"} onClose={() => setSelectedDocumentModal(null)} />
    </>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonRequest: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  newTag: {
    fontSize: 12,
    color: "#fff",
    backgroundColor: "#4a90e2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  inputRow: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
    marginVertical: 10,
  },
  inputLabel: {
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default DocumentModal;