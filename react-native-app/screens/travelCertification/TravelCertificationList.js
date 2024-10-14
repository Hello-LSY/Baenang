import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Button, Alert, TouchableOpacity, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'; // Redux 관련 hooks 추가
import { fetchTravelCertificates, deleteCertificate } from '../../redux/travelCertificatesSlice';
import TravelCertificationItem from '../../components/travelCertification/TravelCertificationItem';
import axios from 'axios';
import { BASE_URL , S3_URL } from '../../constants/config';


const TravelCertificationList = ({ navigation }) => {
  const dispatch = useDispatch();
  const { list: certifications, status, error } = useSelector((state) => state.travelCertificates); // Redux 상태 선택

  const [visibleMenuIndex, setVisibleMenuIndex] = useState(null); // 어떤 항목의 메뉴가 보이는지 관리

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTravelCertificates()); // 여행 인증서 목록을 가져오는 액션 디스패치
    }
  }, [status, dispatch]);

  const handlePressItem = (item) => {
    navigation.navigate('TravelCertificationDetail', { item }); // 클릭 시 해당 item을 여행확인서 페이지로 전달
  };

  const handleDeleteItem = (id) => {
    Alert.alert(
      '삭제 확인',
      '정말로 이 인증서를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          onPress: () => {
            axios.delete(`${BASE_URL}/api/travel-certificates/delete/${id}`)
              .then(() => {
                Alert.alert('삭제 완료', '여행 인증서가 삭제되었습니다.');
                dispatch(deleteCertificate(id)); // Redux 상태에서 인증서 삭제
              })
              .catch(error => {
                console.error('삭제 오류:', error);
                Alert.alert('삭제 실패', '여행 인증서를 삭제할 수 없습니다.');
              });
          }
        },
      ]
    );
  };

  const handleEditItem = (item) => {
    navigation.navigate('TravelCertificationEdit', { item }); // 수정 페이지로 이동하면서 아이템 정보를 전달
  };

  const toggleMenu = (index) => {
    if (visibleMenuIndex === index) {
      setVisibleMenuIndex(null); // 메뉴를 닫음
    } else {
      setVisibleMenuIndex(index); // 현재 아이템의 메뉴를 열음
    }
  };

  // 로딩 상태 표시
  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  // 에러가 있을 경우
  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <Text>오류가 발생했습니다: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={certifications}
        keyExtractor={(item) => item.travelid.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <TravelCertificationItem item={item} onPress={() => handlePressItem(item)} />
            
            {/* '...' 버튼 및 수정/삭제 메뉴 */}
            <TouchableOpacity style={styles.moreButton} onPress={() => toggleMenu(index)}>
              <Text style={styles.moreText}>...</Text>
            </TouchableOpacity>

            {/* 메뉴가 열렸을 때만 수정/삭제 버튼을 보여줌 */}
            {visibleMenuIndex === index && (
              <View style={styles.menuContainer}>
                <Button title="수정" onPress={() => handleEditItem(item)} />
                <Button title="삭제" color="red" onPress={() => handleDeleteItem(item.travelid)} />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f8ff',
  },
  itemContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  moreButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  moreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  menuContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default TravelCertificationList;
