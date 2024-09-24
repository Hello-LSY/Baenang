import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator, FlatList, Button, StyleSheet, TouchableOpacity } from 'react-native';
import createAxiosInstance from '../../services/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MemberList = ({ token, navigation }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 멤버 목록 조회 함수
  const fetchMembers = async () => {
    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.get('/api/members');
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
      Alert.alert('Error', 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  // 멤버 삭제 함수
  const deleteMember = async (id) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`/api/members/${id}`);
      fetchMembers(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error('Error deleting member:', error);
      Alert.alert('Error', 'Failed to delete member');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Members List</Text>
      <Button
        title="Add Member"
        onPress={() => navigation.navigate('MemberInput', { token, fetchMembers })} // 추가 화면으로 이동, fetchMembers 함수 전달
      />
      <FlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.memberItem}
            onPress={() => navigation.navigate('MemberDetail', { memberId: item.id, token })} // 회원 상세 화면으로 이동
          >
            <View>
              <Text style={styles.memberName}>{item.username}</Text>
              <Text>{item.email}</Text>
            </View>
            <Button title="Delete" onPress={() => deleteMember(item.id)} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  memberItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 18,
  },
});

export default MemberList;
