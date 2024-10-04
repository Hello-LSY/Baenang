import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../../constants/config'; // BASE_URL 가져오기
import { useAuth } from '../../redux/authState';
import axios from 'axios'; // Axios 사용

const CommunityItem = ({ post, onDelete, onViewComments }) => {
  const { auth } = useAuth();
  const [imageError, setImageError] = useState(false);
  const imagePath = post.imageNames && post.imageNames.length > 0 
    ? post.imageNames[0].replace('/uploads/', '') 
    : null;

  const [liked, setLiked] = useState(false); // 초기값은 false
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount); // 좋아요 수 로컬 관리

  // 좋아요 상태를 서버에서 받아오는 함수
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/likes/post/${post.id}/member/${auth.memberId}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setLiked(response.data); // 서버에서 좋아요 상태 가져오기
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus(); // 컴포넌트가 마운트될 때 좋아요 상태를 서버에서 가져옴
  }, [post.id, auth.memberId, auth.token]);

  // 좋아요 처리 함수
  const handleLikePress = async () => {
    const newLiked = !liked; // 현재 상태 반대로 변경
    setLiked(newLiked);
    setLocalLikeCount((prev) => newLiked ? prev + 1 : prev - 1);

    try {
      if (newLiked) {
        // 좋아요 추가 요청
        await axios.post(`${BASE_URL}/api/likes/post/${post.id}/member/${auth.memberId}`, {}, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
      } else {
        // 좋아요 취소 요청
        await axios.delete(`${BASE_URL}/api/likes/post/${post.id}/member/${auth.memberId}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
      }
    } catch (error) {
      // 요청 실패 시 UI를 원상태로 복구
      setLiked(!newLiked);  // 다시 상태 복구
      setLocalLikeCount((prev) => !newLiked ? prev + 1 : prev - 1);
      console.error('Error updating like status:', error);
    }
  };

  // 삭제 버튼 클릭 시 확인 경고창 표시
  const handleDeletePress = () => {
    Alert.alert(
      "게시글 삭제",
      "정말로 이 게시글을 삭제하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        { text: "삭제", onPress: () => onDelete(post.id), style: "destructive" }
      ]
    );
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Text style={styles.username}>{post.nickname}</Text>
        {/* 본인이 작성한 게시글인 경우에만 삭제 아이콘 표시 */}
        {auth.memberId === post.memberId && (
          <TouchableOpacity onPress={handleDeletePress}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        )}
      </View>

      {imagePath && !imageError ? (
        <Image
          source={{ uri: `${BASE_URL}/uploads/${imagePath}` }}
          style={styles.postImage}
          resizeMode="contain"
          onError={() => setImageError(true)}
        />
      ) : (
        <Text style={styles.noImageText}>이미지가 손상되었습니다.</Text>
      )}

      <View style={styles.postActions}>
        <TouchableOpacity onPress={handleLikePress}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={24}
            color={liked ? "red" : "black"}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={onViewComments}>
          <Ionicons name="chatbubble-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.likes}>{localLikeCount} likes</Text>
      <Text style={styles.comments}>{post.commentCount} comments</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 400,
  },
  noImageText: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 10,
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
