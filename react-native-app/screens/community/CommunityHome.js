import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPosts, deletePost, toggleLike } from '../../redux/postSlice'; // deletePost 추가
import CommunityItem from './CommunityItem';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../redux/authState';

export default function CommunityHome({ navigation }) {
  const dispatch = useDispatch();
  const { items: posts, loading, error } = useSelector((state) => state.post);
  const { auth } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  // 새로고침 핸들러
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchPosts()).finally(() => setRefreshing(false));
  };

  // 좋아요 상태 변경 핸들러
  const handleLike = (postId, liked) => {
    dispatch(toggleLike({ postId, memberId: auth.memberId, liked }));
  };

  // 삭제 핸들러
  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
  };

  const renderPostItem = ({ item }) => (
    <CommunityItem
      post={item}
      onLike={handleLike}
      onDelete={handleDelete} // 삭제 핸들러 전달
      onViewComments={() => navigation.navigate('Comments', { postId: item.id })}
    />
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          게시글을 불러오는 중 오류가 발생했습니다: {error.message || '알 수 없는 오류'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListEmptyComponent={<Text style={styles.emptyText}>게시글이 없습니다.</Text>}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
});
