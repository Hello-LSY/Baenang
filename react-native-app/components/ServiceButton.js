import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ServiceButton = ({ title, subtitle, imgSrc, imgSize, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <View style={styles.imageContainer}>
      <Image source={imgSrc} style={[styles.image, { width: imgSize, height: imgSize }]} />
    </View>
    <View style={styles.textWrapper}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 170,
    borderRadius: 8,
    backgroundColor: '#fff',
    margin: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  imageContainer: {
    marginTop: 10,
    borderRadius: 100,      // 테두리 모서리 둥글게 설정 (필요에 따라 조정)
    padding: 3,           // 이미지와 테두리 사이 간격 설정
    backgroundColor: '#E3F2FD',
    
  },
  image: {
    resizeMode: 'contain',
  },
});

export default ServiceButton;
