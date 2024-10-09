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
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginHorizontal: 7,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
  title: {
    height: 30,
    lineHeight: 30,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#343E40'
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default ExternalServiceButton;
