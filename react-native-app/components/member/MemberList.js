// components/member/MemberList.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import createAxiosInstance from '../../services/axiosInstance';

const MemberList = ({ navigation, token }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const deleteMember = async (id) => {
    try {
      const axiosInstance = createAxiosInstance(token);
      await axiosInstance.delete(`/api/members/${id}`);
      fetchMembers(); // 회원 삭제 후 목록 갱신
    } catch (error) {
      console.error('Error deleting member:', error);
      Alert.alert('Error', 'Failed to delete member');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Members List</Text>
      <Button
        title="Add New Member"
        onPress={() => navigation.navigate('MemberInput', { token })} // 회원 추가 화면으로 이동
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
