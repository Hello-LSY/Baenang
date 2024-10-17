import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';

const FriendCard = ({
  selectedFriend,
  setFriendModalVisible,
  S3_URL,
  getSnsIcon,
  parseSnsInfo,
}) => {
  const pastelColor = '#FFE5E5'; // 파스텔 핑크 색상

  return (
    <View style={styles.friendModalContent}>
      <Svg height="100%" width="100%" style={styles.backgroundSvg}>
        <Path d="M0,0 L400,0 L400,220 Q200,280 0,220 Z" fill={pastelColor} />
      </Svg>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => setFriendModalVisible(false)}
        >
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        {selectedFriend && (
          <View style={styles.cardContent}>
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: `${S3_URL}/${selectedFriend.imageUrl}`,
                }}
                style={styles.modalFriendImage}
              />
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.modalFriendName}>{selectedFriend.name}</Text>
              <View style={styles.friendSnsContainer}>
                {getSnsIcon(parseSnsInfo(selectedFriend.sns).platform)}
                <Text style={styles.snsText}>
                  {parseSnsInfo(selectedFriend.sns).snsId}
                </Text>
              </View>
              <Text style={styles.modalFriendInfo}>{selectedFriend.email}</Text>
              <Text style={styles.modalFriendInfo}>
                {selectedFriend.introduction}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = {
  friendModalContent: {
    width: '90%',
    aspectRatio: 90 / 55,
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  backgroundSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cardContainer: {
    flex: 1,
    padding: 20,
  },
  closeIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFriendImage: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
    borderRadius: 60,
  },
  infoContainer: {
    flex: 2,
    marginLeft: 20,
  },
  modalFriendName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  friendSnsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  snsText: {
    marginLeft: 5,
  },
  modalFriendInfo: {
    marginBottom: 5,
  },
};

export default FriendCard;
