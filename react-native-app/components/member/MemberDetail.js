// components/member/MemberDetail.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import createAxiosInstance from '../../services/axiosInstance';

const MemberDetail = ({ route, navigation }) => {
  const { memberId, token } = route.params;
  const [member, setMember] = useState(null);

  const fetchMemberDetail = async () => {
    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.get(`/api/members/${memberId}`);
      setMember(response.data);
    } catch (error) {
      console.error('Error fetching member detail:', error);
      Alert.alert('Error', 'Failed to fetch member detail');
    }
  };

  useEffect(() => {
    fetchMemberDetail();
  }, []);

  if (!member) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <Text style={styles.value}>{member.username}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{member.email}</Text>
      <Button
        title="Edit Member"
        onPress={() => navigation.navigate('MemberInput', { token, member })} // 회원 수정 화면으로 이동
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default MemberDetail;
