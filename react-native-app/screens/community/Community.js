import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // 아이콘을 위해 expo/vector-icons를 사용합니다.

// 더미 데이터
const dummyPosts = [
  {
    id: '1',
    user: {
      name: '여행자1',
      avatar: 'https://via.placeholder.com/50',
    },
    imageUrl: 'https://via.placeholder.com/400x400',
    caption: '제주도에서의 아름다운 일몰',
    likes: 120,
    comments: 14,
  },
  // 더 많은 더미 데이터를 추가할 수 있습니다.
];

const PostItem = ({ post }) => (
  <View style={styles.postContainer}>
    <View style={styles.postHeader}>
      <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
      <Text style={styles.username}>{post.user.name}</Text>
    </View>
    <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
    <View style={styles.postActions}>
      <TouchableOpacity>
        <Ionicons name="heart-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="chatbubble-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
    <Text style={styles.likes}>{post.likes} likes</Text>
    <Text style={styles.caption}>
      <Text style={styles.username}>{post.user.name}</Text> {post.caption}
    </Text>
    <TouchableOpacity>
      <Text style={styles.viewComments}>View all {post.comments} comments</Text>
    </TouchableOpacity>
  </View>
);

const Community = () => (
  <FlatList
    data={dummyPosts}
    renderItem={({ item }) => <PostItem post={item} />}
    keyExtractor={(item) => item.id}
  />
);

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
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
    fontWeight: 'bold',
    marginLeft: 10,
  },
  caption: {
    margin: 10,
  },
  viewComments: {
    color: 'gray',
    marginLeft: 10,
    marginBottom: 5,
  },
});

export default Community;
