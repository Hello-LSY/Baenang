import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const ExternalServiceButton = ({ title, imgSrc, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <View style={styles.buttonWrapper}>
      <Image source={imgSrc} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 5,
    width: '47%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 14,
  },
  image: {
    width: 25,
    height: 25,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default ExternalServiceButton;
