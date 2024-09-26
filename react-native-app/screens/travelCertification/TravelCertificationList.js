import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import TravelCertificationItem from '../../components/travelCertification/TravelCertificationItem';

const TravelCertificationList = ({ navigation }) => {
  const [certifications, setCertifications] = useState([]);

  useEffect(() => {
    axios.get('http://10.0.2.2:8080/api/travel-certificates/all')
      .then(response => {
        setCertifications(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handlePressItem = (item) => {
    // 클릭 시 해당 item을 상세 페이지로 전달
    navigation.navigate('TravelCertificationDetail', { item });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={certifications}
        keyExtractor={(item) => item.travelid.toString()}
        renderItem={({ item }) => (
          <TravelCertificationItem item={item} onPress={handlePressItem} />
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
});

export default TravelCertificationList;
