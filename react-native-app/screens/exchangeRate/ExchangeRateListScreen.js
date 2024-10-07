import React, { useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useExchangeRate } from '../../redux/exchangeRateState';
import FlagIcon from '../../components/FlagIcon';

const priorityCurrencies = [
  'USD',
  'JPY',
  'EUR',
  'CNH',
  'GBP',
  'AUD',
  'CAD',
  'NZD',
  'THB',
  'VND',
  'HKD',
  'TWD',
];

const ExchangeRateListScreen = ({ navigation }) => {
  const { latestExchangeRates, fetchLatestRates, loading } = useExchangeRate();

  // useRef로 API 호출을 한 번만 실행하도록 방지
  const didFetch = useRef(false);

  useEffect(() => {
    if (!didFetch.current) {
      fetchLatestRates();
      didFetch.current = true; // 첫 실행 이후에는 다시 실행되지 않도록 설정
    }
  }, []);

  const sortedExchangeRates = useMemo(() => {
    if (!latestExchangeRates) return [];

    return [...latestExchangeRates].sort((a, b) => {
      const aCode = a.currencyCode.replace('(100)', '');
      const bCode = b.currencyCode.replace('(100)', '');

      const aIndex = priorityCurrencies.indexOf(aCode);
      const bIndex = priorityCurrencies.indexOf(bCode);

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      } else if (aIndex !== -1) {
        return -1;
      } else if (bIndex !== -1) {
        return 1;
      } else {
        return a.currencyCode.localeCompare(b.currencyCode);
      }
    });
  }, [latestExchangeRates]);

  const formatExchangeRate = (rate, currencyCode) => {
    if (currencyCode.includes('(100)')) {
      // 100단위 통화의 경우 (예: 엔화)
      return `100 ${currencyCode.replace('(100)', '')} = ${rate.toFixed(
        2
      )} KRW`;
    } else {
      // 일반적인 경우
      return `1 ${currencyCode} = ${rate.toFixed(2)} KRW`;
    }
  };

  const renderExchangeRate = ({ item }) => {
    const currencyCode = item.currencyCode.replace('(100)', '');
    const formattedRate = formatExchangeRate(
      item.exchangeRateValue,
      item.currencyCode
    );

    return (
      <TouchableOpacity
        style={styles.exchangeCard}
        onPress={() =>
          navigation.navigate('ExchangeRateDetail', {
            currencyCode: item.currencyCode,
          })
        }
      >
        <FlagIcon
          currencyCode={currencyCode}
          size={36}
          style={styles.flagIcon}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.currencyText}>{item.currencyName}</Text>
          <Text style={styles.codeText}>{item.currencyCode}</Text>
        </View>
        <Text style={styles.rateText}>{formattedRate}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={sortedExchangeRates}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flagIcon: {
    marginRight: 12,
  },

  infoContainer: {
    flex: 1,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  rateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066cc',
  },
});

export default ExchangeRateListScreen;
