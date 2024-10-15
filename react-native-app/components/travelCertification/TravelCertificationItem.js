import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Button,
} from 'react-native';
import { BASE_URL, S3_URL } from '../../constants/config';

const { width } = Dimensions.get('window');

const TravelCertificationItem = ({ item, onPress }) => {
  const imageUrl = `${S3_URL}/${item.imagepath}`;

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{item.visitedcountry}</Text>
        <Text style={styles.subtitle}>{item.traveldate}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  infoContainer: {
    marginVertical: 8,
    padding: 10,
  },
  title: {
    marginVertical: 2,
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    marginVertical: 2,
    fontSize: 14,
    color: '#666',
  },
});

export default TravelCertificationItem;
