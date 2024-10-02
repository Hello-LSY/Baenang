// screens/exchangeRate/ExchangeRateListScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchAllExchangeRates } from '../../redux/exchangeRateState'; // 환율 정보를 가져오는 함수

const ExchangeRateListScreen = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // 모든 환율 데이터를 가져오는 함수 호출
    fetchAllExchangeRates()
      .then((data) => setExchangeRates(data))
      .catch((error) =>
        console.error('Failed to fetch exchange rates:', error)
      );
  }, []);

  const renderExchangeRate = ({ item }) => (
    <TouchableOpacity
      style={styles.exchangeCard}
      onPress={() =>
        navigation.navigate('ExchangeRateChart', {
          currencyCode: item.currencyCode,
        })
      }
    >
      <Text style={styles.currencyText}>{item.currencyCode}</Text>
      <Text style={styles.rateText}>{item.exchangeRateValue}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={exchangeRates}
        renderItem={renderExchangeRate}
        keyExtractor={(item) => item.currencyCode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    padding: 16,
  },
  exchangeCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currencyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rateText: {
    fontSize: 16,
  },
});

export default ExchangeRateListScreen;
