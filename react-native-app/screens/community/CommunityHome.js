import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, toggleLike } from '../../redux/postSlice';
import CommunityItem from './CommunityItem';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../redux/authState'; // 사용자 인증 정보 가져오기

export default function CommunityHome({ navigation }) {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.items);
  const { auth } = useAuth(); // 로그인된 사용자 정보

  useEffect(() => {
    dispatch(fetchPosts()); // 게시글 목록 가져오기
  }, [dispatch]);

  const handleLike = (postId) => {
    dispatch(toggleLike({ postId, memberId: auth.memberId }));
  };

  const renderPostItem = ({ item }) => (
    <CommunityItem
      post={item}
      onLike={() => handleLike(item.id)}
      onViewComments={() => navigation.navigate('Comments', { postId: item.id })}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('CreatePost')}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    borderRadius: 28,
  },
});
