import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { S3_URL } from "../../constants/config"; // S3 URL을 constants에서 가져옵니다.
import { useAuth } from "../../redux/authState";
import { posts } from "../../redux/postSlice";
import { fetchProfile } from "../../redux/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import { getApiClient } from "../../redux/apiClient";
import Modal from "react-native-modal";
import { BottomSheet } from "react-native-elements";
import { Swipeable } from "react-native-gesture-handler";
import defaultProfileImage from "../../assets/icons/default-profile.png";

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
    return "방금 전";
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
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [localLikeCount, setLocalLikeCount] = useState(post.likeCount);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
  const [newComment, setNewComment] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const { profile } = useSelector((state) => state.profile); // 프로필 상태에서 profile 정보 가져옴
  const [profileImage, setProfileImage] = useState(defaultProfileImage); // 기본 이미지를 초기 값으로 설정

  const apiClient = getApiClient(auth.token);

  // 서버에서 받은 imageNames에는 이미 /uploads/ 경로가 포함되어 있음.
  const imagePath =
    post.imageNames && post.imageNames.length > 0 ? post.imageNames[0] : null;

    useEffect(() => {
      const fetchLikeStatus = async () => {
        try {
          const response = await apiClient.get(
            `/api/likes/post/${post.id}/member/${auth.memberId}`
          );
          setLiked(response.data); // 상태 업데이트
        } catch (error) {
          console.error("Error fetching like status:", error);
        }
      };
    
      fetchLikeStatus();
      fetchComments(); // fetchComments는 post.id와 연관됨
    }, [post.id, auth.memberId, apiClient]); // dispatch는 제외



    useEffect(() => {
      if (profile?.profilePicturePath) {
        setProfileImage({ uri: `${S3_URL}/${profile.profilePicturePath}` }); // URL 경로로 이미지 불러옴
      } else {
        setProfileImage(defaultProfileImage); // 없으면 기본 이미지 설정
      }
    }, [profile]); // profile만 의존성에 넣으면 됨

  const fetchComments = async () => {
    try {
      const response = await apiClient.get(`/api/comments/post/${post.id}`);
      setComments(response.data);
      setCommentsCount(response.data.length);
    } catch (error) {
      console.error("Error fetching comments:", error);
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
      console.error("Error updating like status:", error);
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
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };
  const renderRightActions = (commentId, progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDeleteComment(commentId)}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
    );
  };
  const handleDeleteComment = async (commentId) => {
    try {
      await apiClient.delete(`/api/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
      setCommentsCount(commentsCount - 1);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditPress = () => {
    toggleDropdown();
    onEdit(post.id);
  };

  const handleDeletePress = () => {
    toggleDropdown();
    Alert.alert("게시글 삭제", "정말로 이 게시글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      { text: "삭제", onPress: () => onDelete(post.id), style: "destructive" },
    ]);
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.headerLeft}>
          <Image
            source={
              post.profilePicturePath
                ? { uri: `${S3_URL}/${post.profilePicturePath}` }
                : defaultProfileImage
            }
            style={styles.profileImage}
          />
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
          source={{ uri: `${S3_URL}/${imagePath}` }} // 이미지 경로에 /uploads/를 중복으로 추가하지 않음
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
              name={liked ? "heart" : "heart-outline"}
              size={24}
              color={liked ? "#FF4D4D" : "#666"}
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

        {/* commentsCount가 1개 이상일 때만 댓글 보기 텍스트를 렌더링 */}
        {commentsCount > 0 && (
          <TouchableOpacity onPress={toggleCommentModal}>
            <Text style={styles.viewComments}>
              <Text style={styles.viewCommentsText}>
                댓글 {commentsCount}개 모두 보기
              </Text>
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.timeAgo}>{timeAgo(post.createdAt)}</Text>
      </View>

      <Modal
        isVisible={isCommentModalVisible}
        onBackdropPress={toggleCommentModal}
        onSwipeComplete={toggleCommentModal}
        swipeDirection={["down"]}
        style={styles.bottomModal}
      >
        <View style={styles.modalContent}>
          <ScrollView style={styles.commentScrollView}>
            <View style={styles.commentInputWrapper}>
              <View style={styles.commentInputContainer}>
                <Image
                  source={profileImage}
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
              <View style={styles.inputShadow} />
            </View>
            {comments.map((comment) => (
              <View key={comment.id} style={styles.comment}>
                <View style={styles.commentHeader}>
                  <Image
                    source={
                      comment.profilePicturePath
                        ? { uri: `${S3_URL}/${comment.profilePicturePath}` }
                        : defaultProfileImage
                    }
                    style={styles.commentProfileImage}
                  />
                  <View style={styles.commentContent}>
                    <View style={styles.commentUserInfo}>
                      <Text style={styles.commentUsername}>
                        {comment.nickname}
                      </Text>
                      <Text style={styles.commentCreatedAt}>
                        {timeAgo(comment.createdAt)}
                      </Text>
                    </View>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                  {auth.nickname === comment.nickname && (
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
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  profileusername: {
    fontWeight: "bold",
  },
  dropdown: {
    position: "absolute",
    right: 0,
    top: 25,
    backgroundColor: "rgba(40, 53, 60, 0.8)",
    zIndex: 1000,
    width: 80,
    borderRadius: 8,
  },
  option: {
    flexDirection: "row",
    justifyContent: "center", // 가운데 정렬을 위해 추가
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 12,
    color: "white",
    textAlign: "center", // 텍스트 가운데 정렬
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
  },
  noImageText: {
    textAlign: "center",
    color: "gray",
    marginVertical: 10,
  },

  memberId: {
    fontWeight: "bold",
  },
  content: {
    fontSize: 16,
    color: "#333",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  leftActions: {
    flexDirection: "row",
  },
  postAction: {
    marginRight: 10,
  },
  postContent: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },
  likeCount: {
    fontWeight: "bold",
    marginTop: 5,
  },
  contentRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  username: {
    fontWeight: "bold",
    marginRight: 5,
    marginTop: 5,
  },
  content: {
    marginTop: 5,
    marginRight: 5,
    flex: 1,
  },
  viewComments: {
    color: "#666",
  },
  actionText: {
    marginLeft: 5,
    color: "#666",
    fontSize: 14,
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "rgba(0, 0, 0, 0.1)",
    height: "60%",
  },
  comment: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  commentProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentUserInfo: {
    flexDirection: "row",
    alignItems: "baseline", // 'center' 대신 'baseline'을 사용합니다.
  },
  commentContent: {
    flex: 1,
  },
  commentCreatedAt: {
    fontSize: 12,
    marginLeft: 5, // 아이디와 timestamp 사이에 약간의 간격을 줍니다.
    color: "#999",
  },
  commentUsername: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
  },
  commentInputProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingLeft: 15,
    paddingRight: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
  },
  addCommentButton: {
    alignItems: "center",
    borderRadius: 20,
    padding: 5,
    backgroundColor: "#0095f6",
  },

  deleteCommentButton: {
    padding: 5,
  },
  timeAgo: {
    color: "#999",
    fontSize: 12,
    marginTop: 5,
  },

  cancelButton: {
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "bold",
  },
});

export default CommunityItem;
