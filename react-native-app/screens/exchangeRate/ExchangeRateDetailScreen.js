import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useExchangeRate } from '../../redux/exchangeRateState';
import { Picker } from '@react-native-picker/picker'; // 변경된 Picker import

const screenWidth = Dimensions.get('window').width;

const formatDate = (dateArray) => {
  const [year, month, day] = dateArray;
  return `${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
};

// 주별로 데이터를 그룹화하는 함수
const groupByWeek = (data) => {
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    const weekData = data.slice(i, i + 7);
    const average = weekData.reduce((sum, item) => sum + item.exchangeRateValue, 0) / weekData.length;
    weeks.push({
      recordedAt: weekData[0].recordedAt,
      exchangeRateValue: average,
    });
  }
  return weeks;
};

// 월별로 데이터를 그룹화하는 함수
const groupByMonth = (data) => {
  const months = {};
  data.forEach((item) => {
    const month = item.recordedAt[1]; // month
    if (!months[month]) {
      months[month] = [];
    }
    months[month].push(item.exchangeRateValue);
  });
  
  return Object.keys(months).map((month) => {
    const average = months[month].reduce((sum, value) => sum + value, 0) / months[month].length;
    return {
      recordedAt: [data[0].recordedAt[0], month], // year, month
      exchangeRateValue: average,
    };
  });
};

const ExchangeRateDetailScreen = ({ route }) => {
  const { currencyCode } = route.params;
  const { exchangeRateHistory, fetchRateHistory, loading } = useExchangeRate();
  const [chartType, setChartType] = useState('daily'); // 기본 차트 타입은 '일별'

  useEffect(() => {
    fetchRateHistory(currencyCode); // 특정 통화의 환율 히스토리 로드
  }, [currencyCode]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  let historyData = exchangeRateHistory[currencyCode] || [];

  // 차트 타입에 따라 데이터 필터링
  if (chartType === 'weekly') {
    historyData = groupByWeek(historyData);
  } else if (chartType === 'monthly') {
    historyData = groupByMonth(historyData);
  }

  // 첫 번째 데이터의 연도를 가져옴 (모든 데이터는 같은 연도에 속한다고 가정)
  const year = historyData.length > 0 ? historyData[0].recordedAt[0] : '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{year}년 {currencyCode} 환율 히스토리</Text>

      {/* 일별, 주별, 월별 선택을 위한 Picker */}
      <Picker
        selectedValue={chartType}
        style={styles.picker}
        onValueChange={(itemValue) => setChartType(itemValue)}
      >
        <Picker.Item label="일별" value="daily" />
        <Picker.Item label="주별" value="weekly" />
        <Picker.Item label="월별" value="monthly" />
      </Picker>

      {historyData.length > 0 ? (
        <LineChart
          data={{
            labels: historyData.map((data) => formatDate(data.recordedAt)),
            datasets: [{ data: historyData.map((data) => data.exchangeRateValue) }],
          }}
          width={screenWidth * 0.9}
          height={220}
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
  picker: {
    height: 50,
    width: 150,
    marginBottom: 16,
  },
});

export default ExchangeRateDetailScreen;
