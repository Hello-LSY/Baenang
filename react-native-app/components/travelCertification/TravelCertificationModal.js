import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL, S3_URL } from '../../constants/config';

const TravelCertificationModal = ({
  isVisible,
  onClose,
  item,
  onEdit,
  onDelete,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!item) return null;

  const imageUrl = `${S3_URL}/${item.imagepath}`;

  const handleDelete = () => {
    onDelete(item.travelid);
    // 여기서 모달을 직접 닫지 않습니다. 삭제 성공 시 TravelCertificationMain에서 모달을 닫을 것입니다.
  };
  const convertToDMS = (coordinate, isLatitude) => {
    const absolute = Math.abs(coordinate);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    const direction = isLatitude
      ? coordinate >= 0
        ? 'N'
        : 'S'
      : coordinate >= 0
      ? 'E'
      : 'W';

    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  const latitude = convertToDMS(parseFloat(item.latitude), true);
  const longitude = convertToDMS(parseFloat(item.longitude), false);

  //console.log('Image URL:', imageUrl);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <View style={styles.header}>
                {/* <TouchableOpacity
                  style={styles.iconButton}
                  onPress={() => onEdit(item)}
                >
                  <Ionicons name="create-outline" size={24} color="white" />
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={styles.iconButton}
                  onPress={handleDelete}
                >
                  <Ionicons name="trash-outline" size={24} color="white" />
                </TouchableOpacity>
              </View>
              {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
              <Image
                source={{ uri: imageUrl }}
                style={[styles.image, imageError && styles.errorImage]}
                onError={(e) => {
                  console.log('Image loading error:', e.nativeEvent.error);
                  setImageError(true);
                  setIsLoading(false);
                }}
                onLoad={() => setIsLoading(false)}
              />
              {imageError && (
                <Text style={styles.errorText}>
                  이미지를 불러올 수 없습니다.
                </Text>
              )}
              <View style={styles.infoContainer}>
                <View style={styles.row}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="location-outline"
                      size={24}
                      color="white"
                      style={styles.icon}
                    />
                  </View>
                  <Text style={styles.location}>{item.visitedcountry}</Text>
                </View>
                <View style={styles.row}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="white"
                      style={styles.icon}
                    />
                  </View>
                  <Text style={styles.date}>{item.traveldate}</Text>
                </View>
                <View style={styles.row}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name="navigate-outline"
                      size={16}
                      color="white"
                      style={styles.icon}
                    />
                  </View>
                  <Text style={styles.geoinfo}>
                    {latitude}, {longitude}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: Dimensions.get('window').width * 0.9,
    height: Dimensions.get('window').height * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  iconButton: {
    marginLeft: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  errorImage: {
    width: 100,
    height: 100,
    backgroundColor: '#ddd',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconContainer: {
    width: 30,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
    color: 'white',
  },
  geoinfocontainer: {
    flexDirection: 'row',
  },
  geoinfo: {
    color: 'white',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  location: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  date: {
    color: 'white',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default TravelCertificationModal;
