// components/TravelCertificationItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TravelCertificationItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
      <View style={styles.infoContainer}>
        <Text style={styles.countryText}>{item.country}</Text>
        <Text style={styles.cityText}>{item.city}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  countryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cityText: {
    fontSize: 16,
    color: '#666',
  },
  dateText: {
    fontSize: 14,
    color: '#999',
  },
});

export default TravelCertificationItem;