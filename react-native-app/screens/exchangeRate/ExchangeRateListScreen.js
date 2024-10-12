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
import Icon from 'react-native-vector-icons/Ionicons';

const mainCurrencies = ['USD', 'EUR', 'JPY', 'CNH'];
const countryNames = {
  USD: '미국',
  EUR: '유로',
  JPY: '일본',
  CNH: '중국',
};

const ExchangeRateListScreen = ({ navigation }) => {
  const { latestExchangeRates, fetchLatestRates, loading } = useExchangeRate();

  const didFetch = useRef(false);

  useEffect(() => {
    if (!didFetch.current) {
      fetchLatestRates();
      didFetch.current = true;
    }
  }, []);

  const { mainRates, otherRates } = useMemo(() => {
    if (!latestExchangeRates) return { mainRates: [], otherRates: [] };

    const main = [];
    const others = [];

    latestExchangeRates.forEach((rate) => {
      const cleanCode = rate.currencyCode.replace('(100)', '').trim();
      if (mainCurrencies.includes(cleanCode)) {
        main.push(rate);
      } else {
        others.push(rate);
      }
    });
    main.sort((a, b) => {
      const aIndex = mainCurrencies.indexOf(
        a.currencyCode.replace('(100)', '').trim()
      );
      const bIndex = mainCurrencies.indexOf(
        b.currencyCode.replace('(100)', '').trim()
      );
      return aIndex - bIndex;
    });

    return { mainRates: main, otherRates: others };
  }, [latestExchangeRates]);

  const formatExchangeRate = (rate, currencyCode, isMain = false) => {
    if (isMain) {
      return rate.toFixed(2);
    }
    if (currencyCode.includes('(100)')) {
      return `100 ${currencyCode.replace('(100)', '')} = ${rate.toFixed(
        2
      )} KRW`;
    } else {
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
        <View style={styles.leftContainer}>
          <FlagIcon
            currencyCode={currencyCode}
            size={36}
            style={styles.flagIcon}
          />
          <View style={styles.currencyInfoContainer}>
            <Text style={styles.currencyCode}>{item.currencyCode}</Text>
            <Text style={styles.currencyName}>{item.currencyName}</Text>
          </View>
        </View>
        <View style={styles.rateContainer}>
          <Text style={styles.rateText}>{formattedRate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMainCurrency = (item) => {
    const currencyCode = item.currencyCode.replace('(100)', '');
    const formattedRate = formatExchangeRate(
      item.exchangeRateValue,
      item.currencyCode,
      true
    );
    const countryName = countryNames[currencyCode] || '';

    return (
      <TouchableOpacity
        style={styles.mainCurrencyCard}
        onPress={() =>
          navigation.navigate('ExchangeRateDetail', {
            currencyCode: item.currencyCode,
          })
        }
      >
        <View style={styles.mainFlagContainer}>
          <FlagIcon currencyCode={currencyCode} size={36} />
        </View>
        <View style={styles.mainInfoContainer}>
          <View style={styles.mainCurrencyInfoRow}>
            <Text style={styles.mainCountryName}>{countryName}</Text>
            <Text style={styles.mainCurrencyCode}>{currencyCode}</Text>
          </View>
          <Text style={styles.mainRateText}>{formattedRate}</Text>
        </View>
        <View style={styles.mainArrowContainer}>
          <Icon name="chevron-forward" size={24} color="#ccc" />
        </View>
      </TouchableOpacity>
    );
  };
  const renderMainCurrenciesGrid = () => (
    <View style={styles.mainCurrenciesContainer}>
      {mainRates.map((rate) => (
        <View key={rate.currencyCode} style={styles.mainCurrencyWrapper}>
          {renderMainCurrency(rate)}
        </View>
      ))}
    </View>
  );

  const renderHeader = () => (
    <View>
      <Text style={styles.sectionTitle}>주요 국가 환율</Text>
      {renderMainCurrenciesGrid()}
      <Text style={styles.sectionTitle}>전체 국가 환율</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={otherRates}
          renderItem={renderExchangeRate}
          keyExtractor={(item) => item.currencyCode}
          ListHeaderComponent={renderHeader}
          stickyHeaderIndices={[]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mainCurrenciesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  mainCurrencyWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  mainCurrencyCard: {
    flexDirection: 'row',
    height: 70,
    alignItems: 'center',
    borderRadius: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  mainFlagContainer: {
    marginHorizontal: 12,
  },
  mainInfoContainer: {
    flex: 1,
  },
  mainCurrencyInfoRow: {
    flexDirection: 'row',
    alignItems: 'baseline', // 베이스라인 기준으로 정렬
    marginBottom: 2,
  },
  mainCountryName: {
    fontSize: 15,
    color: '#666',
    marginRight: 6,
    lineHeight: 20, // 라인 높이 추가
  },
  mainCurrencyCode: {
    fontSize: 15,
    // fontWeight: 'bold',
    lineHeight: 20, // 라인 높이 추가
  },
  mainRateText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0066cc',
    lineHeight: 22, // 라인 높이 추가
  },
  exchangeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 15,
    marginHorizontal: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagIcon: {
    marginRight: 12,
  },
  currencyInfoContainer: {
    justifyContent: 'center',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  currencyName: {
    fontSize: 14,
    color: '#666',
  },
  rateContainer: {
    alignItems: 'flex-end',
  },
  rateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
    // borderWidth: 1,
    // borderColor:'red',
  },
});

export default ExchangeRateListScreen;
