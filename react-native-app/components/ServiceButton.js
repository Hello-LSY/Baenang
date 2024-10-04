import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ServiceButton = ({ title, subtitle, imgSrc, imgSize, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
    <Image
      source={imgSrc}
      style={[styles.image, { width: imgSize, height: imgSize }]}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#fff',
    margin: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 8,
    color: '#666',
    width: 57,
  },
});

export default ServiceButton;
