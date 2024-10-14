// screens/community/CommunityItem.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { S3_URL } from '../../constants/config'; // S3 URL을 constants에서 가져옵니다.
import { useAuth } from '../../redux/authState';
import { getApiClient } from '../../redux/apiClient';
import { BottomSheet } from 'react-native-elements';
import defaultProfileImage from '../../assets/icons/default-profile.png';

// 배열로 전달된 createdAt을 Date 객체로 변환하는 함수
const arrayToDate = (arr) => {
  const [year, month, day, hour, minute, second, nano] = arr;
  return new Date(year, month - 1, day, hour, minute, second, nano / 1000000); // 월은 0부터 시작하므로 -1 필요
};

// 시간 계산 함수 (몇 분 전, 몇 시간 전, n일 전)
const timeAgo = (dateArray) => {
  const date = arrayToDate(dateArray); // 배열을 Date 객체로 변환
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) {
    return '방금 전';
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}분 전`;
  } else if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}시간 전`;
  } else {
    return `${Math.floor(seconds / 86400)}일 전`;
  }
};

const CommunityItem = ({ post, onDelete, onEdit }) => {
  const { auth } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [newComment, setNewComment] = useState('');

  const apiClient = getApiClient(auth.token);

  // 서버에서 받은 imageNames에는 이미 /uploads/ 경로가 포함되어 있음.
  const imagePath = post.imageNames && post.imageNames.length > 0
    ? post.imageNames[0]
    : null;

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await apiClient.get(`/api/likes/post/${post.id}/member/${auth.memberId}`);
        setLiked(response.data);
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };
    fetchLikeStatus();

    fetchComments();
  }, [post.id, auth.memberId]);

  const fetchComments = async () => {
    try {
      const response = await apiClient.get(`/api/comments/post/${post.id}`);
      setComments(response.data);
      setCommentsCount(response.data.length);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLikePress = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLocalLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));

    try {
      if (newLiked) {
        await apiClient.post(`/api/likes/post/${post.id}/member/${auth.memberId}`);
      } else {
        await apiClient.delete(`/api/likes/post/${post.id}/member/${auth.memberId}`);
      }
    } catch (error) {
      setLiked(!newLiked);
      setLocalLikeCount((prev) => (!newLiked ? prev + 1 : prev - 1));
      console.error('Error updating like status:', error);
    }
  };

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

  const handleEditPress = () => {
    onEdit(post.id);
  };

  const toggleBottomSheet = () => {
    setBottomSheetVisible(!isBottomSheetVisible);
    if (!isBottomSheetVisible) {
      fetchComments();
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const newCommentData = {
          memberId: auth.memberId,
          nickname: auth.nickname,
          content: newComment,
        };
        const response = await apiClient.post(`/api/comments/post/${post.id}`, newCommentData);
        setComments([...comments, response.data]);
        setCommentsCount(commentsCount + 1);
        setNewComment('');
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/api/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
      setCommentsCount(commentsCount - 1);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image
          source={defaultProfileImage}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{post.nickname}</Text>
        <Text style={styles.timeAgo}>{timeAgo(post.createdAt)}</Text> 
      </View>

      {imagePath && !imageError ? (
        <Image
          source={{ uri: `${S3_URL}/${imagePath}` }} // 이미지 경로에 /uploads/를 중복으로 추가하지 않음
          style={styles.postImage}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <Text style={styles.noImageText}>이미지가 손상되었습니다.</Text>
      )}

      <View style={styles.postContent}>
        <Text style={styles.content}>{post.content}</Text>
      </View>

      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.postAction} onPress={handleLikePress}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={24}
              color={liked ? "#FF4D4D" : "#666"}
            />
            <Text style={styles.actionText}>{localLikeCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.postAction} onPress={toggleBottomSheet}>
            <Ionicons name="chatbubble-outline" size={24} color="#666" />
            <Text style={styles.actionText}>{commentsCount}</Text>
          </TouchableOpacity>
        </View>

        {String(auth.memberId) === String(post.memberId) && (
          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.postAction} onPress={handleEditPress}>
              <Ionicons name="create-outline" size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.postAction} onPress={handleDeletePress}>
              <Ionicons name="trash-outline" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <BottomSheet isVisible={isBottomSheetVisible} containerStyle={styles.bottomSheetContainer}>
        <ScrollView style={styles.bottomSheetContent}>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <View style={styles.commentHeader}>
                <View style={styles.commentHeaderLeft}>
                  <Image
                    source={defaultProfileImage}
                    style={styles.commentProfileImage}
                  />
                  <Text style={styles.commentUsername}>{comment.nickname}</Text>
                </View>
                {String(auth.memberId) === String(comment.memberId) && (
                  <TouchableOpacity onPress={() => handleDeleteComment(comment.id)} style={styles.deleteCommentButton}>
                    <Ionicons name="trash-outline" size={16} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.commentText}>{comment.content}</Text>
            </View>
          ))}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="댓글 작성..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity onPress={handleAddComment} style={styles.addCommentButton}>
              <Text style={styles.addCommentText}>게시</Text>
            </TouchableOpacity>
          </View>
          <Button title="닫기" onPress={toggleBottomSheet} color="#999" />
        </ScrollView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  username: {
    fontWeight: '600',
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 250,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  noImageText: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 10,
  },
  postContent: {
    padding: 15,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  leftActions: {
    flexDirection: 'row',
  },
  rightActions: {
    flexDirection: 'row',
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  actionText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  bottomSheetContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheetContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUsername: {
    fontWeight: 'bold',
    color: '#333',
  },
  commentText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
  },
  addCommentButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addCommentText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteCommentButton: {
    padding: 5,
  },
  timeAgo: {
    marginLeft: 'auto',
    color: '#999',
    fontSize: 12,
  },
});

export default CommunityItem;
