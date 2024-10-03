import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CommunityItem = ({ post, onLike, onViewComments }) => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <Text style={styles.username}>{post.nickname}</Text>
    </View>

    <Image source={{ uri: post.imageNames[0] }} style={styles.postImage} />

    <View style={styles.postActions}>
      <TouchableOpacity onPress={onLike}>
        <Ionicons name="heart-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onViewComments}>
        <Ionicons name="chatbubble-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>

    <Text style={styles.likes}>{post.likes} likes</Text>
    <Text style={styles.comments}>{post.commentCount} comments</Text>
  </View>
);

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 15,
  },
  postHeader: {
    padding: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 400,
  },
  postActions: {
    flexDirection: 'row',
    padding: 10,
  },
  likes: {
    marginLeft: 10,
  },
  comments: {
    marginLeft: 10,
  },
});

export default CommunityItem;
