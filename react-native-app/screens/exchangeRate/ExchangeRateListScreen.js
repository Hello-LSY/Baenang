import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useExchangeRate } from '../../redux/exchangeRateState'; // 환율 정보를 가져오는 Hook

const ExchangeRateListScreen = ({ navigation }) => {
  const { latestExchangeRates, fetchLatestRates, loading } = useExchangeRate();

  useEffect(() => {
    fetchLatestRates(); // 최신 환율 데이터를 가져오는 함수 호출
  }, []);

  const renderExchangeRate = ({ item }) => (
    <TouchableOpacity
      style={styles.exchangeCard}
      onPress={() =>
        navigation.navigate('ExchangeRateDetail', {
          currencyCode: item.currencyCode,
        })
      } // 환율 상세보기로 이동
    >
      <Text style={styles.currencyText}>{item.currencyCode}</Text>
      <Text style={styles.rateText}>{item.exchangeRateValue}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={latestExchangeRates} // 최신 환율 데이터를 사용
          renderItem={renderExchangeRate}
          keyExtractor={(item) => item.currencyCode}
        />
      )}
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
