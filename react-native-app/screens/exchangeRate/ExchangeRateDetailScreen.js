// screens/exchangeRate/ExchangeRateDetailScreen.js

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; // 차트 라이브러리 import
import { useExchangeRate } from '../../redux/exchangeRateState';

const ExchangeRateDetailScreen = ({ route }) => {
  const { currencyCode } = route.params;
  const { exchangeRateHistory, fetchRateHistory, loading } = useExchangeRate();

  useEffect(() => {
    fetchRateHistory(currencyCode); // 특정 통화의 환율 히스토리 로드
  }, [currencyCode]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const historyData = exchangeRateHistory[currencyCode] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currencyCode} 환율 히스토리</Text>
      {historyData.length > 0 ? (
        <LineChart
          data={{
            labels: historyData.map((data) => data.date),
            datasets: [{ data: historyData.map((data) => data.exchangeRateValue) }],
          }}
          width={300}
          height={200}
          chartConfig={{
            backgroundGradientFrom: "#f0f8ff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
          }}
        />
      ) : (
        <Text>No history available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default ExchangeRateDetailScreen;
