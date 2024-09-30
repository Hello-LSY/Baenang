// screens/businessCard/BusinessCardScreen.js

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBusinessCard, clearBusinessCard } from '../../redux/businessCardSlice';
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

  console.log('Business Card Loaded:', businessCard); // 명함 정보 로그

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
              {/* 이미지 표시 */}
              {businessCard.imageUrl ? (
                <Image 
                  source={{ uri: businessCard.imageUrl.replace('localhost', '10.0.2.2') }} // IP 수정
                  style={styles.businessCardImage} 
                  resizeMode="contain" 
                />
              ) : (
                <Text style={styles.errorText}>이미지가 없습니다.</Text>
              )}
              <View style={styles.businessCardInfo}>
                <Text style={styles.infoText}>이름: {businessCard.name}</Text>
                <Text style={styles.infoText}>국가: {businessCard.country}</Text>
                <Text style={styles.infoText}>이메일: {businessCard.email}</Text>
                <Text style={styles.infoText}>SNS: {businessCard.sns}</Text>
                <Text style={styles.infoText}>소개: {businessCard.introduction}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => navigation.navigate('UpdateBusinessCard', { businessCard })}
                >
                  <Text style={styles.editButtonText}>명함 수정</Text>
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
  businessCardImage: {
    width: 200, // 원하는 크기로 조정
    height: 200, // 원하는 크기로 조정
    marginVertical: 20,
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
  editButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  editButtonText: {
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
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default BusinessCardScreen;
