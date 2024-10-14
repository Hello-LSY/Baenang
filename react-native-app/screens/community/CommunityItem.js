import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from '../../constants/config';
import { useAuth } from '../../redux/authState';
import { getApiClient } from '../../redux/apiClient';
import Modal from 'react-native-modal';
import { BottomSheet } from 'react-native-elements';
import defaultProfileImage from '../../assets/icons/default-profile.png';

const CommunityItem = ({ post, onDelete, onEdit }) => {
  const { auth } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [liked, setLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [newComment, setNewComment] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const apiClient = getApiClient(auth.token);
  const imagePath =
    post.imageNames && post.imageNames.length > 0
      ? post.imageNames[0].replace('/uploads/', '')
      : null;

  useEffect(() => {
    fetchLikeStatus();
    fetchComments();
  }, [post.id, auth.memberId]);

  const fetchLikeStatus = async () => {
    try {
      const response = await apiClient.get(
        `/api/likes/post/${post.id}/member/${auth.memberId}`
      );
      setLiked(response.data);
    } catch (error) {
      console.error('Error fetching like status:', error);
    }
  };

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
        await apiClient.post(
          `/api/likes/post/${post.id}/member/${auth.memberId}`
        );
      } else {
        await apiClient.delete(
          `/api/likes/post/${post.id}/member/${auth.memberId}`
        );
      }
    } catch (error) {
      setLiked(!newLiked);
      setLocalLikeCount((prev) => (!newLiked ? prev + 1 : prev - 1));
      console.error('Error updating like status:', error);
    }
  };

  const toggleCommentModal = () => {
    setIsCommentModalVisible(!isCommentModalVisible);
    if (!isCommentModalVisible) {
      fetchComments();
    }
  };
  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const toggleOptionsModal = () => {
    setIsOptionsModalVisible(!isOptionsModalVisible);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const newCommentData = {
          memberId: auth.memberId,
          nickname: auth.nickname,
          content: newComment,
        };
        const response = await apiClient.post(
          `/api/comments/post/${post.id}`,
          newCommentData
        );
        setComments([response.data, ...comments]); // Add new comment to the beginning
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
      setComments(comments.filter((comment) => comment.id !== commentId));
      setCommentsCount(commentsCount - 1);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleEditPress = () => {
    toggleDropdown();
    onEdit(post.id);
  };

  const handleDeletePress = () => {
    toggleDropdown();
    Alert.alert('게시글 삭제', '정말로 이 게시글을 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', onPress: () => onDelete(post.id), style: 'destructive' },
    ]);
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.headerLeft}>
          <Image source={defaultProfileImage} style={styles.profileImage} />
          <Text style={styles.profileusername}>{post.nickname}</Text>
        </View>
        {String(auth.memberId) === String(post.memberId) && (
          <View>
            <TouchableOpacity onPress={toggleDropdown}>
              <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
            </TouchableOpacity>
            {isDropdownVisible && (
              <View style={styles.dropdown}>
                <TouchableOpacity
                  style={styles.option}
                  onPress={handleEditPress}
                >
                  <Text style={styles.optionText}>수정</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.option}
                  onPress={handleDeletePress}
                >
                  <Text style={styles.optionText}>삭제</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>

      {imagePath && !imageError ? (
        <Image
          source={{ uri: `${BASE_URL}/uploads/${imagePath}` }}
          style={styles.postImage}
          onError={() => setImageError(true)}
        />
      ) : (
        <Text style={styles.noImageText}>이미지가 손상되었습니다.</Text>
      )}

      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.postAction} onPress={handleLikePress}>
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={24}
              color={liked ? '#FF4D4D' : '#666'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.postAction}
            onPress={toggleCommentModal}
          >
            <Ionicons
              name="chatbubble-outline"
              size={22}
              color="#666"
              style={{ transform: [{ scaleX: -1 }] }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.postContent}>
        <Text style={styles.likeCount}>좋아요 {localLikeCount}개</Text>
        <View style={styles.contentRow}>
          <Text style={styles.username}>{post.nickname}</Text>
          <Text style={styles.content}>{post.content}</Text>
        </View>
        <TouchableOpacity onPress={toggleCommentModal}>
          <Text style={styles.viewComments}>
            댓글 {commentsCount}개 모두 보기
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isCommentModalVisible}
        onBackdropPress={toggleCommentModal}
        onSwipeComplete={toggleCommentModal}
        swipeDirection={['down']}
        style={styles.bottomModal}
      >
        <View style={styles.modalContent}>
          <ScrollView>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <View style={styles.commentHeader}>
                  <Image
                    source={defaultProfileImage}
                    style={styles.commentProfileImage}
                  />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUsername}>
                      {comment.nickname}
                    </Text>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                  {String(auth.memberId) === String(comment.memberId) && (
                    <TouchableOpacity
                      onPress={() => handleDeleteComment(comment.id)}
                      style={styles.deleteCommentButton}
                    >
                      <Ionicons name="close" size={20} color="#999" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
          <View style={styles.commentInputContainer}>
            <Image
              source={defaultProfileImage}
              style={styles.commentInputProfileImage}
            />
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="댓글 작성..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={styles.addCommentButton}
              >
                <Ionicons name="arrow-up" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  profileusername: {
    fontWeight: 'bold',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: 25,
    backgroundColor: 'rgba(40, 53, 60, 0.8)',
    zIndex: 1000,
    width: 80,
    borderRadius: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'center', // 가운데 정렬을 위해 추가
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 12,
    color: 'white',
    textAlign: 'center', // 텍스트 가운데 정렬
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
  },
  noImageText: {
    textAlign: 'center',
    color: 'gray',
    marginVertical: 10,
  },

  memberId: {
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  leftActions: {
    flexDirection: 'row',
  },
  postAction: {
    marginRight: 10,
  },
  postContent: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },
  likeCount: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  contentRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  username: {
    fontWeight: 'bold',
    marginRight: 5,
    marginTop: 5,
  },
  content: {
    marginTop: 5,
    marginRight: 5,
    flex: 1,
  },
  viewComments: {
    color: '#666',
  },
  actionText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    maxHeight: '80%',
  },
  comment: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  commentInputProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
  },
  addCommentButton: {
    borderRadius: 20,
    padding: 3,
    backgroundColor: '#0095f6',
  },

  deleteCommentButton: {
    padding: 5,
  },

  cancelButton: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default CommunityItem;
