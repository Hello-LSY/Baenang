import React from 'react';
import { BASE_URL } from '../../constants/config';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { deleteCertificate } from '../../redux/travelCertificatesSlice';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const TravelCertificationDetail = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { item } = route.params;
  const imageUrl = `${BASE_URL}/uploads/${item.imagepath}`;

  const handleDeleteItem = () => {
    Alert.alert('삭제 확인', '정말로 이 인증서를 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        onPress: () => {
          axios
            .delete(
              `${BASE_URL}/api/travel-certificates/delete/${item.travelid}`
            )
            .then(() => {
              Alert.alert('삭제 완료', '여행 인증서가 삭제되었습니다.');
              dispatch(deleteCertificate(item.travelid));
              navigation.goBack();
            })
            .catch((error) => {
              console.error('삭제 오류:', error);
              Alert.alert('삭제 실패', '여행 인증서를 삭제할 수 없습니다.');
            });
        },
      },
    ]);
  };

  const handleEditItem = () => {
    navigation.navigate('TravelCertificationEdit', { item });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>여행 인증서</Text>
          <TouchableOpacity onPress={handleEditItem}>
            <Ionicons name="create-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.infoContainer}>
          <InfoItem label="이름" value={item.username} />
          <InfoItem
            label="지역"
            value={`${item.visitedcountry.split('-')[0]} ${
              item.visitedcountry.split('-')[1]
            }`}
          />
          <InfoItem label="일자" value={item.traveldate} />
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteItem}
        >
          <Text style={styles.deleteButtonText}>인증서 삭제</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
  infoContainer: {
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TravelCertificationDetail;
