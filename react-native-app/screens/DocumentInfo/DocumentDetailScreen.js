import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { useAuth } from '../../redux/authState'; // useAuth 훅 사용하여 토큰 가져오기
import { BASE_URL } from '../../constants/config'; // 백엔드 URL 설정

const DocumentDetailScreen = ({ route, navigation }) => {
  const { documentType } = route.params;
  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth(); // useAuth 훅에서 토큰 가져오기

  useEffect(() => {
    const fetchDocumentData = async () => {
      let endpoint;
      switch (documentType) {
        case 'residentregistration':
          endpoint = '/residentregistration/get';
          break;
        case 'driverlicense':
          endpoint = '/driver-license/get';
          break;
        case 'passport':
          endpoint = '/passport/get';
          break;
        case 'isic':
          endpoint = '/isic/get';
          break;
        default:
          return;
      }

      try {
        const response = await axios.get(`${BASE_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`, // 상태관리에서 가져온 토큰 사용
          },
        });
        setDocumentData(response.data);
      } catch (error) {
        console.error("Error fetching document data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentData();
  }, [documentType, token]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      {documentData ? (
        <View>
          <Text style={styles.title}>문서 정보:</Text>
          <Text>{JSON.stringify(documentData, null, 2)}</Text>
        </View>
      ) : (
        <Text>문서 정보를 불러오는 데 실패했습니다.</Text>
      )}
      <Button title="뒤로 가기" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default DocumentDetailScreen;
