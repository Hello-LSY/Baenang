import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Text, Modal, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPostsNearby, deletePost, toggleLike } from '../../redux/postSlice';
import CommunityItem from './CommunityItem';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../redux/authState';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function CommunityHome({ navigation }) {
  const dispatch = useDispatch();
  const { items: posts, loading, error } = useSelector((state) => state.post);
  const { auth } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [range, setRange] = useState('5');
  const [location, setLocation] = useState(null);
  // const [modalVisible, setModalVisible] = useState(false);
  // const [isExpanded, setExpanded] = useState(false);
  // const animation = useState(new Animated.Value(0))[0];
  const [dropdownVisible, setDropdownVisible] = useState(false); 

  const distanceMapping = {
    '5': '동네',
    '50': '도시',
    '500': '국가',
    '20000': '세계',
  };

  // 사용자의 위치 가져오기
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('위치 권한이 필요합니다.');
      }
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    } catch (error) {
      console.error('위치 정보를 가져오는 중 오류 발생:', error);
    }
  };

  useFocusEffect(
    // 근처 게시글 불러오기
    useCallback(() => {
      if (auth.memberId && location) {
        dispatch(fetchPostsNearby({
          latitude: location.latitude,
          longitude: location.longitude,
          distance: parseFloat(range)
        }));
      }
    }, [dispatch, auth.memberId, location, range])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    if (auth.memberId && location) {
      dispatch(fetchPostsNearby({
        latitude: location.latitude,
        longitude: location.longitude,
        distance: parseFloat(range)
      })).finally(() => setRefreshing(false));
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  // 게시글의 좋아요 함수
  const handleLike = (postId, liked) => {
    if (auth.memberId) {
      dispatch(toggleLike({ postId, memberId: auth.memberId, liked }));
    }
  };

  // 게시글의 삭제 함수
  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
  };

  // 게시글의 수정 함수
  const handleEdit = (postId) => {
    navigation.navigate('EditPost', { postId });
  };

  // 게시글 작성 함수
  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  // const toggleExpand = () => {
  //   if (isExpanded) {
  //     Animated.timing(animation, {
  //       toValue: 0,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }).start(() => setExpanded(false));
  //   } else {
  //     setExpanded(true);
  //     Animated.timing(animation, {
  //       toValue: 1,
  //       duration: 300,
  //       useNativeDriver: true,
  //     }).start();
  //   }
  // };

  // const expandedStyle = {
  //   transform: [
  //     {
  //       scale: animation.interpolate({
  //         inputRange: [0, 1],
  //         outputRange: [0, 1],
  //       }),
  //     },
  //   ],
  //   opacity: animation.interpolate({
  //     inputRange: [0, 1],
  //     outputRange: [0, 1],
  //   }),
  // };

  const renderPostItem = ({ item }) => (
    <CommunityItem
      post={item}
      onLike={handleLike}
      onDelete={handleDelete}
      onEdit={handleEdit}
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
      {/* 거리 선택 드롭다운 */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(!dropdownVisible)} // 클릭 시 드롭다운 표시/숨기기
        >
          <Text style={styles.dropdownText}>{distanceMapping[range]}</Text>
          <Ionicons name={dropdownVisible ? "chevron-up" : "chevron-down"} size={20} color="#555" />
        </TouchableOpacity>

        {dropdownVisible && (
          <View style={styles.dropdown}>
            {Object.entries(distanceMapping).map(([value, label]) => (
              <TouchableOpacity
                key={value}
                style={styles.dropdownOption}
                onPress={() => {
                  setRange(value); // 선택된 거리를 설정
                  setDropdownVisible(false); // 드롭다운을 닫음
                }}
              >
                <Text style={styles.dropdownOptionText}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* 게시글 리스트 */}
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListEmptyComponent={<Text style={styles.emptyText}>게시글이 없습니다.</Text>}
      />

      {/* 플로팅 액션 버튼 */}
      <TouchableOpacity style={styles.fab} onPress={handleCreatePost}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      {/* <View style={styles.fabContainer}>
        {isExpanded && (
          <Animated.View style={[styles.fabOptionContainer, expandedStyle]}>
            <TouchableOpacity onPress={() => navigation.navigate('CreatePost')} style={styles.fabOption}>
              <Ionicons name="pencil-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.fabOption}>
              <MaterialIcons name="my-location" size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        )}

        <TouchableOpacity style={styles.fab} onPress={toggleExpand}>
          <Ionicons name={isExpanded ? "close" : "add"} size={30} color="white" />
        </TouchableOpacity>
      </View> */}

      {/* 거리 선택 모달 */}
      {/* <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}> */}
            {/* 모달 헤더: 타이틀과 닫기 버튼 */}
            {/* <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>거리 설정</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View> */}

            {/* 2x2 그리드로 구성된 거리 선택 옵션 */}
            {/* <View style={styles.modalOptions}>
              <View style={styles.modalRow}>
                {Object.entries(distanceMapping).slice(0, 2).map(([value, label]) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.modalOptionGrid}
                    onPress={() => {
                      setRange(value);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.modalRow}>
                {Object.entries(distanceMapping).slice(2, 4).map(([value, label]) => (
                  <TouchableOpacity
                    key={value}
                    style={styles.modalOptionGrid}
                    onPress={() => {
                      setRange(value);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalOptionText}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal> */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    backgroundColor: '#eaefff',
    width: 80,
    padding: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
    position: 'absolute',  // 공간 차지하지 않도록 변경
    top: 10, // 필요한 위치로 설정
    right: 10, // 오른쪽에서 떨어진 거리 설정
    zIndex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  dropdown: {
    position: 'absolute',
    top: 40, // 드롭다운 버튼 바로 아래에 위치
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    elevation: 5, // 그림자를 추가하여 부드럽게 보이게 함
  },
  dropdownOption: {
    paddingVertical: 10,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#555',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: '#007AFF',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  // fabOptionContainer: {
  //   position: 'absolute',
  //   bottom: 70,
  //   right: 0,
  //   flexDirection: 'column',
  //   backgroundColor: 'transparent',
  // },
  // fabOption: {
  //   width: 56,
  //   height: 56,
  //   backgroundColor: '#007AFF',
  //   borderRadius: 28,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginBottom: 10,
  // },
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.4)',
  // },
  // modalHeader: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   width: 320,
  //   paddingHorizontal: 20,
  //   paddingBottom: 10,
  // },
  // modalTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#333',
  // },
  // closeButton: {
  //   padding: 5,
  // },
  // modalContent: {
  //   backgroundColor: '#fff',
  //   width: 320,
  //   borderRadius: 12,
  //   padding: 20,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // modalOptions: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   justifyContent: 'space-between',
  //   marginTop: 10,
  // },
  // modalRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   width: '100%',
  //   marginBottom: 15, // 버튼 간격 추가
  // },
  // modalOptionGrid: {
  //   width: '48%', // 각 버튼 간의 간격을 위한 비율 설정
  //   backgroundColor: '#f7f7f7',
  //   paddingVertical: 14,
  //   borderRadius: 12,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
  // modalOptionText: {
  //   fontSize: 16,
  //   textAlign: 'center',
  //   color: '#666666',
  //   fontWeight: '500',
  // },
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
