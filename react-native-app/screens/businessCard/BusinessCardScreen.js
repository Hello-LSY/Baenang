import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBusinessCard, deleteBusinessCard, clearBusinessCard } from '../../redux/businessCardSlice'; 
import QRCode from 'react-native-qrcode-svg'; 

const BusinessCardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth); 
  const { businessCard, loading, error } = useSelector((state) => state.businessCard); 

  useEffect(() => {
    if (auth.token && auth.memberId) {
      dispatch(fetchBusinessCard(auth.memberId)); 
    }

    return () => {
      dispatch(clearBusinessCard());
    };
  }, [auth.token, auth.memberId, dispatch]);

  const confirmDelete = () => {
    Alert.alert(
      '명함 삭제',
      '정말로 명함을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', onPress: () => dispatch(deleteBusinessCard(businessCard.businessCardId)) },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>내 명함 QR 코드</Text>
          {businessCard ? (
            <>
              <QRCode value={JSON.stringify(businessCard)} size={200} />
              <View style={styles.businessCardInfo}>
                <Text style={styles.infoText}>이름: {businessCard.name}</Text>
                <Text style={styles.infoText}>국가: {businessCard.country}</Text>
                <Text style={styles.infoText}>이메일: {businessCard.email}</Text>
                <Text style={styles.infoText}>SNS: {businessCard.sns}</Text>
                <Text style={styles.infoText}>소개: {businessCard.introduction}</Text>
                <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
                  <Text style={styles.deleteButtonText}>명함 삭제</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text>명함 데이터가 없습니다.</Text>
              <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateBusinessCard')}>
                <Text style={styles.createButtonText}>명함 생성하기</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  businessCardInfo: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusinessCardScreen;
