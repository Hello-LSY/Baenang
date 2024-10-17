import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import FlagIcon from '../components/FlagIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ExchangeRateCarousel = ({ latestExchangeRates, onItemPress, width }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const ITEM_WIDTH = width;

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % latestExchangeRates.length;
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(timer);
  }, [currentIndex, latestExchangeRates.length]);

  useEffect(() => {
    Animated.timing(scrollX, {
      toValue: currentIndex * ITEM_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [currentIndex, scrollX]);

  const renderExchangeRate = (item, index) => {
    const inputRange = [
      (index - 1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index + 1) * ITEM_WIDTH,
    ];

    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [ITEM_WIDTH, 0, -ITEM_WIDTH],
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.5, 1, 0.5],
    });

    return (
      <Animated.View
        key={item.currencyCode}
        style={[
          styles.exchangeItem,
          { transform: [{ translateX }, { scale }], opacity },
        ]}
      >
        <View style={styles.flagContainer}>
          <FlagIcon
            currencyCode={item.currencyCode.replace('(100)', '').trim()}
            size={36}
          />
        </View>
        <View style={styles.exchangeInfo}>
          <Text style={styles.currencyCode}>{item.currencyCode}</Text>
          <Text style={styles.currencyName}>{item.currencyName}</Text>
        </View>
        <View style={styles.exchangeRateContainer}>
          <Text style={styles.exchangeRate}>
            {item.exchangeRateValue.toFixed(2)}
          </Text>
          <Text
            style={[
              styles.exchangeChange,
              {
                color:
                  item.exchangeChangePercentage > 0
                    ? 'red'
                    : item.exchangeChangePercentage < 0
                    ? 'blue'
                    : 'gray',
              },
            ]}
          >
            {item.exchangeChangePercentage > 0
              ? '▲'
              : item.exchangeChangePercentage < 0
              ? '▼'
              : ''}
            {Math.abs(item.exchangeChangePercentage).toFixed(2)}%
          </Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {latestExchangeRates.map((item, index) =>
        renderExchangeRate(item, index)
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  exchangeItem: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  flagContainer: {
    marginRight: 10,
  },
  exchangeInfo: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyName: {
    fontSize: 14,
    color: '#555',
  },
  exchangeRateContainer: {
    alignItems: 'flex-end',
  },
  exchangeRate: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  exchangeChange: {
    fontSize: 14,
    marginTop: 3,
  },
});

export default ExchangeRateCarousel;
