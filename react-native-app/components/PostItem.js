import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const PostItem = ({ post }) => (
  <View style={styles.container}>
    {post.imageUrl && (
      <Image source={{ uri: post.imageUrl }} style={styles.image} />
    )}
    <View style={styles.contentContainer}>
      <Text style={styles.content}>{post.content}</Text>
      <Text style={styles.timestamp}>
        {new Date(post.timestamp).toLocaleString()}
      </Text>
    </View>
  </View>
);
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
  },
  contentContainer: {
    padding: 15,
  },
  content: {
    fontSize: 16,
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
});

export default PostItem;
