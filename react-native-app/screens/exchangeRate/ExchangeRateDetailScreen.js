import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useExchangeRate } from '../../redux/exchangeRateState';
import FlagIcon from '../../components/FlagIcon';

const screenWidth = Dimensions.get('window').width;

// 날짜 형식 변환 함수
const formatDate = (dateArray) => {
  if (!dateArray || dateArray.length < 2) return '';
  const [year, month, day] = dateArray;
  return `${String(month).padStart(2, '0')}.${
    day ? String(day).padStart(2, '0') : ''
  }`;
};

// 주별, 월별 그룹화 함수들
const groupByWeek = (data) => {
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    const weekData = data.slice(i, i + 7);
    const average =
      weekData.reduce((sum, item) => sum + item.exchangeRateValue, 0) /
      weekData.length;
    weeks.push({
      recordedAt: weekData[0].recordedAt,
      exchangeRateValue: average,
    });
  }
  return weeks;
};

const groupByMonth = (data) => {
  const months = {};
  data.forEach((item) => {
    const month = item.recordedAt[1];
    if (!months[month]) {
      months[month] = [];
    }
    months[month].push(item.exchangeRateValue);
  });

  return Object.keys(months).map((month) => {
    const average =
      months[month].reduce((sum, value) => sum + value, 0) /
      months[month].length;
    return {
      recordedAt: [data[0].recordedAt[0], month, 1],
      exchangeRateValue: average,
    };
  });
};

// 등락률 계산 함수
const calculateChangePercentage = (currentRate, previousRate) => {
  if (!previousRate || previousRate === 0) return null; // 이전 값이 없거나 0일 때
  const change = ((currentRate - previousRate) / previousRate) * 100;
  return change.toFixed(2); // 소수점 2자리까지 표현
};

// 데이터 제한 함수
const limitData = (data, limit) => {
  return data.slice(Math.max(data.length - limit, 0));
};

const ExchangeRateDetailScreen = ({ route }) => {
  const { currencyCode } = route.params;
  const cleanedCurrencyCode = currencyCode.replace('(100)', '').trim();
  const { exchangeRateHistory, fetchRateHistory, loading } = useExchangeRate();
  const [chartType, setChartType] = useState('daily');
  const [krwAmount, setKrwAmount] = useState('');
  const [foreignAmount, setForeignAmount] = useState('');
  const [selectedRate, setSelectedRate] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    fetchRateHistory(currencyCode);
  }, [currencyCode]);

  useEffect(() => {
    if (
      exchangeRateHistory[currencyCode] &&
      exchangeRateHistory[currencyCode].length > 0
    ) {
      const latestRate =
        exchangeRateHistory[currencyCode][
          exchangeRateHistory[currencyCode].length - 1
        ]?.exchangeRateValue ?? 0;
      calculateForeignToKRW(foreignAmount, latestRate);
    }
  }, [foreignAmount, exchangeRateHistory, currencyCode]);

  const calculateForeignToKRW = (value, rate) => {
    if (value && !isNaN(value)) {
      const calculated = (parseFloat(value) * rate).toFixed(2);
      setKrwAmount(calculated);
    } else {
      setKrwAmount('');
    }
  };

  const calculateKRWToForeign = (value, rate) => {
    if (value && !isNaN(value)) {
      const calculated = (parseFloat(value) / rate).toFixed(2);
      setForeignAmount(calculated);
    } else {
      setForeignAmount('');
    }
  };

  const showTooltip = (value, x, y, index) => {
    setSelectedRate(value);
    setSelectedDate(formatDate(historyData[index].recordedAt));

    const adjustedX = x > screenWidth - 150 ? screenWidth - 150 : x + 10;

    setTooltipPosition({
      x: adjustedX + 2,
      y: y + 15,
    });

    Animated.timing(tooltipOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideTooltip = () => {
    Animated.timing(tooltipOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedRate(null);
      setSelectedDate('');
    });
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  let historyData = exchangeRateHistory[currencyCode] || [];

  if (chartType === 'weekly') {
    historyData = groupByWeek(historyData);
    historyData = limitData(historyData, 6); // 최근 6주
  } else if (chartType === 'monthly') {
    historyData = groupByMonth(historyData);
    historyData = limitData(historyData, 6); // 최근 6개월
  } else {
    historyData = limitData(historyData, 7); // 최근 7일
  }

  const latestRate =
    historyData.length > 0
      ? historyData[historyData.length - 1].exchangeRateValue
      : 0;
  const previousRate =
    historyData.length > 1
      ? historyData[historyData.length - 2].exchangeRateValue
      : null;
  const latestChangePercentage = calculateChangePercentage(
    latestRate,
    previousRate
  );

  return (
    <TouchableWithoutFeedback onPress={hideTooltip}>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <View style={styles.currencyInfo}>
              <FlagIcon currencyCode={cleanedCurrencyCode} size={30} />
              <Text style={styles.currencyCode}>{cleanedCurrencyCode}</Text>
            </View>
            <View style={styles.rateContainer}>
              <Text style={styles.exchangeRate}>
                {latestRate.toFixed(2)} 원
              </Text>
              {latestChangePercentage !== null ? (
                <Text
                  style={[
                    styles.changeRate,
                    { color: latestChangePercentage >= 0 ? 'red' : 'blue' },
                  ]}
                >
                  {latestChangePercentage >= 0 ? '▲' : '▼'}{' '}
                  {latestChangePercentage}%
                </Text>
              ) : (
                <Text style={styles.changeRate}>N/A</Text>
              )}
            </View>
          </View>

          <View style={styles.calculatorContainer}>
            <Text style={styles.calculatorTitle}>환율계산기</Text>
            <View style={styles.calculatorContent}>
              <View style={styles.inputContainer}>
                <View style={styles.currencySelector}>
                  <FlagIcon currencyCode={cleanedCurrencyCode} size={26} />
                  <Text style={styles.currencyCode}>{cleanedCurrencyCode}</Text>
                </View>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={foreignAmount}
                  onChangeText={(value) => {
                    setForeignAmount(value);
                    calculateForeignToKRW(value, latestRate);
                  }}
                  placeholder="0"
                />
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.currencySelector}>
                  <FlagIcon currencyCode="KRW" size={26} />
                  <Text style={styles.currencyCode}>KRW</Text>
                </View>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={krwAmount}
                  onChangeText={(value) => {
                    setKrwAmount(value);
                    calculateKRWToForeign(value, latestRate);
                  }}
                  placeholder="0"
                />
              </View>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <View style={styles.chartTypeSelector}>
              {['daily', 'weekly', 'monthly'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chartTypeButton,
                    chartType === type && styles.chartTypeButtonActive,
                  ]}
                  onPress={() => {
                    setChartType(type);
                    hideTooltip(); // 버튼을 누를 때 툴팁을 숨기기
                  }}
                >
                  <Text
                    style={[
                      styles.chartTypeText,
                      chartType === type && styles.chartTypeTextActive,
                    ]}
                  >
                    {type === 'daily'
                      ? '일별'
                      : type === 'weekly'
                      ? '주별'
                      : '월별'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {historyData.length > 0 ? (
              <>
                <LineChart
                  data={{
                    labels: historyData.map((data) =>
                      formatDate(data.recordedAt)
                    ),
                    datasets: [
                      {
                        data: historyData.map((data) => data.exchangeRateValue),
                      },
                    ],
                  }}
                  width={screenWidth * 0.8}
                  height={250}
                  chartConfig={{
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                    strokeWidth: 2,
                    labelColor: () => '#666',
                  }}
                  bezier
                  style={styles.chart}
                  onDataPointClick={({ value, x, y, index }) => {
                    showTooltip(value, x, y, index);
                  }}
                />

                {selectedRate && (
                  <Animated.View
                    style={[
                      styles.tooltip,
                      {
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        opacity: tooltipOpacity,
                      },
                    ]}
                  >
                    <View style={styles.tooltipBubble}>
                      <Text style={styles.tooltipDate}>{selectedDate}</Text>
                      <Text style={styles.tooltipText}>
                        {selectedRate.toFixed(2)} 원
                      </Text>
                    </View>
                  </Animated.View>
                )}
              </>
            ) : (
              <Text>No history available</Text>
            )}
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f4f9ff',
    paddingHorizontal: 20,
    flex: 1,
  },
  header: {
    padding: 16,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  exchangeRate: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  changeRate: {
    fontSize: 14,
    color: 'red',
    marginTop: 4,
  },
  calculatorContainer: {
    padding: 16,
    borderRadius: 20,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  calculatorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 10,
  },
  calculatorContent: {
    flexDirection: 'row',
    marginTop: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    fontSize: 16,
  },
  equalSign: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 8,
  },
  chartContainer: {
    padding: 16,
    borderRadius: 20,
    marginVertical: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  chartTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  chartTypeButtonActive: {
    backgroundColor: '#007AFF',
  },
  chartTypeText: {
    color: '#333',
  },
  chartTypeTextActive: {
    color: '#ffffff',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tooltip: {
    position: 'absolute',
    alignItems: 'center',
  },
  tooltipBubble: {
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    padding: 6,
    borderRadius: 4,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tooltipDate: {
    color: '#bbb',
    fontSize: 12,
    marginBottom: 2,
  },
  currencySelector: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ExchangeRateDetailScreen;
