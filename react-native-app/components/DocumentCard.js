import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const DocumentCard = ({ title, subtitle, color1, color2 }) => (
  <TouchableOpacity style={styles.cardContainer}>
    <LinearGradient
      colors={[color1, color2]}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>유효기간: 2025.12.31</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    aspectRatio: 1.6, // 일반적인 신용카드 비율
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  card: {
    flex: 1,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default DocumentCard;
