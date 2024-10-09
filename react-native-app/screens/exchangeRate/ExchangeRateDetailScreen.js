import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useExchangeRate } from '../../redux/exchangeRateState';
import FlagIcon from '../../components/FlagIcon';

const screenWidth = Dimensions.get('window').width;

const formatDate = (dateArray) => {
  const [year, month, day] = dateArray;
  return `${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
};

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
      recordedAt: [data[0].recordedAt[0], month],
      exchangeRateValue: average,
    };
  });
};

const ExchangeRateDetailScreen = ({ route }) => {
  const { currencyCode } = route.params;
  const { exchangeRateHistory, fetchRateHistory, loading } = useExchangeRate();
  const [chartType, setChartType] = useState('daily');
  const [krwAmount, setKrwAmount] = useState('');
  const [foreignAmount, setForeignAmount] = useState('');

  const formatAmount = (amount, currency) => {
    if (!amount) return '';
    const formattedAmount = parseFloat(amount).toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    return currency === 'KRW'
      ? `${formattedAmount} 원`
      : `${formattedAmount} ${currency}`;
  };

  useEffect(() => {
    fetchRateHistory(currencyCode);
  }, [currencyCode]);

  useEffect(() => {
    if (
      exchangeRateHistory[currencyCode] &&
      exchangeRateHistory[currencyCode].length > 0
    ) {
      const latestRate = exchangeRateHistory[currencyCode][0].exchangeRateValue;
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

  if (loading) {
    return <Text>Loading...</Text>;
  }

  let historyData = exchangeRateHistory[currencyCode] || [];

  if (chartType === 'weekly') {
    historyData = groupByWeek(historyData);
  } else if (chartType === 'monthly') {
    historyData = groupByMonth(historyData);
  }

  const latestRate =
    historyData.length > 0 ? historyData[0].exchangeRateValue : 0;

  const CurrencySelector = ({ currencyCode, onChange }) => (
    <TouchableOpacity
      style={styles.currencySelector}
      onPress={() => onChange(currencyCode)}
    >
      <FlagIcon currencyCode={currencyCode} size={24} />
      <Text style={styles.currencyCode}>{currencyCode}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.currencyInfo}>
          <FlagIcon currencyCode={currencyCode} size={24} />
          <Text style={styles.currencyCode}>{currencyCode}</Text>
        </View>
        <Text style={styles.exchangeRate}>{latestRate.toFixed(2)} KRW</Text>
        <Text style={styles.changeRate}>▼ 11.70 -0.87%</Text>
        <Text style={styles.updateTime}>09:13 17:17 • 실시간</Text>
      </View>

      <View style={styles.calculatorContainer}>
        <Text style={styles.calculatorTitle}>환율계산기</Text>
        <View style={styles.inputContainer}>
          <View style={styles.currencySelector}>
            <FlagIcon currencyCode={currencyCode} size={24} />
            <Text style={styles.currencyCode}>{currencyCode}</Text>
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
          <Text style={styles.formattedAmount}>
            {formatAmount(foreignAmount, currencyCode)}
          </Text>
        </View>
        <Text style={styles.equalSign}>=</Text>
        <View style={styles.inputContainer}>
          <View style={styles.currencySelector}>
            <FlagIcon currencyCode="KRW" size={24} />
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
          <Text style={styles.formattedAmount}>
            {formatAmount(krwAmount, 'KRW')}
          </Text>
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
              onPress={() => setChartType(type)}
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
          <LineChart
            data={{
              labels: historyData.map((data) => formatDate(data.recordedAt)),
              datasets: [
                { data: historyData.map((data) => data.exchangeRateValue) },
              ],
            }}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              strokeWidth: 2,
            }}
            bezier
            style={styles.chart}
          />
        ) : (
          <Text>No history available</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyCode: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
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
  updateTime: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  calculatorContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  calculatorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  currencyInputContainer: {
    marginBottom: 16,
  },
  currencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
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
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 16,
    marginBottom: 4,
  },
  formattedAmount: {
    fontSize: 12,
    color: '#666',
    paddingLeft: 8, // input의 paddingHorizontal과 동일한 값 사용
  },
});

export default ExchangeRateDetailScreen;
