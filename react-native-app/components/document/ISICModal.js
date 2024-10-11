import React, { useEffect } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchISIC } from '../../redux/documentItemSlice'; // Redux 액션 import
import { Ionicons } from "@expo/vector-icons"; // 아이콘 사용

const ISICModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  
  // Redux 상태에서 국제학생증 데이터 가져오기
  const { isic, isLoading, error } = useSelector((state) => state.documentItem);

  // 모달이 열릴 때 국제학생증 데이터를 가져오기
  useEffect(() => {
    if (visible) {
      dispatch(fetchISIC());
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
            <Text style={styles.modalTitle}>국제학생증 (ISIC)</Text>

            {/* 로딩 상태 및 에러 처리 */}
            {isLoading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
              <Text>Error: {error}</Text>
            ) : isic ? (
              <View style={styles.infoContainer}>
                {/* ISIC 이미지 표시 */}
                {isic.imagePath && (
                  <Image
                    source={{ uri: `http://10.0.2.2:8080/uploads/isic/${isic.imagePath}` }}
                    style={styles.image}
                  />
                )}

                {/* ISIC 정보 표시 */}
                <Text style={styles.text}>이름: {isic.name}</Text>
                <Text style={styles.text}>ISIC 번호: {isic.isicNumber}</Text>
                <Text style={styles.text}>학교명: {isic.schoolName}</Text>
                <Text style={styles.text}>발급일: {`${isic.issueDate[0]}-${isic.issueDate[1]}-${isic.issueDate[2]}`}</Text>
                <Text style={styles.text}>만료일: {`${isic.expiryDate[0]}-${isic.expiryDate[1]}-${isic.expiryDate[2]}`}</Text>
              </View>
            ) : (
              <Text>국제학생증 정보를 불러올 수 없습니다.</Text>
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

export default ISICModal;
