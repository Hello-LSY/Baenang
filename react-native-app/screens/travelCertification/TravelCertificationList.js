import React, { useState } from 'react';
import { View, Text, Button, ActivityIndicator, FlatList } from 'react-native';
import CertificationItem from '../../components/travelCertification/TravelCertificationItem';

const TravelCertificationList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [certifications, setCertifications] = useState([]);

  const loadCertificationProcess = () => {
    setIsLoading(true);
    // 실제 데이터 로딩 (여기서는 타임아웃을 사용한 시뮬레이션)
    setTimeout(() => {
      // 예시 데이터 설정
      setCertifications([
        { id: 1, country: '대한민국', city: '서울특별시', date: '2024-09-23' },
        { id: 2, country: '일본', city: '도쿄', date: '2024-08-16' },
        { id: 3, country: '프랑스', city: '파리', date: '2024-08-03' },
      ]);
      setIsLoading(false);
    }, 2000); // 2초 후 로딩 완료
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isLoading ? (
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>인증서를 로딩 중입니다...</Text>
        </View>
      ) : certifications.length > 0 ? (
        <FlatList
          data={certifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CertificationItem item={item} />}
        />
      ) : (
        <View>
          <Text>여행 인증서 리스트가 없습니다.</Text>
          <Button title="방문 인증하기" onPress={loadCertificationProcess} />
        </View>
      )}
    </View>
  );
};

export default TravelCertificationList;
