import React, { useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPassport } from '../../redux/documentItemSlice'; // Redux 액션 import
import { Ionicons } from "@expo/vector-icons"; // 아이콘 사용

const PassportModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();

  // Redux 상태에서 여권 데이터 가져오기
  const { passport, isLoading, error } = useSelector((state) => state.documentItem);

  // 모달이 열릴 때 여권 데이터를 가져오기
  useEffect(() => {
    if (visible) {
      dispatch(fetchPassport());
    }
  }, [visible, dispatch]);

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalView}>
            {/* 닫기 버튼 */}
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </Pressable>

            {/* 모달 타이틀 */}
            <Text style={styles.modalTitle}>여권 정보</Text>

            {/* 로딩 상태 및 에러 처리 */}
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
              <Text>Error: {error}</Text>
            ) : passport ? (
              <View style={styles.infoContainer}>
                {/* 여권 이미지 표시 */}
                {passport.imagePath && (
                  <Image
                    source={{ uri: `http://10.0.2.2:8080/uploads/passport/${passport.imagePath}` }}
                    style={styles.image}
                  />
                )}

                {/* 여권 정보 표시 */}
                <Text style={styles.text}>이름: {passport.koreanName}</Text>
                <Text style={styles.text}>여권 번호: {passport.passportNumber}</Text>
                <Text style={styles.text}>국적: {passport.nationality}</Text>
                <Text style={styles.text}>발급 기관: {passport.authority}</Text>
                <Text style={styles.text}>발급일: {`${passport.issueDate[0]}-${passport.issueDate[1]}-${passport.issueDate[2]}`}</Text>
                <Text style={styles.text}>만료일: {`${passport.expiryDate[0]}-${passport.expiryDate[1]}-${passport.expiryDate[2]}`}</Text>
              </View>
            ) : (
              <Text>여권 정보를 불러올 수 없습니다.</Text>
            )}
          </View>
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
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: -45,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 180,
    borderColor: 'red',
    borderWidth: 2,
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default PassportModal;
