// components/member/MemberInput.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import createAxiosInstance from '../../services/axiosInstance';

const MemberInput = ({ route, navigation }) => {
  const { token, member } = route.params || {};
  const [username, setUsername] = useState(member ? member.username : '');
  const [email, setEmail] = useState(member ? member.email : '');
  const [loading, setLoading] = useState(false);

  const saveMember = async () => {
    if (!username || !email) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    try {
      setLoading(true);
      const axiosInstance = createAxiosInstance(token);
      if (member) {
        // 회원 수정
        await axiosInstance.put(`/api/members/${member.id}`, { username, email });
        Alert.alert('Success', 'Member updated successfully.');
      } else {
        // 회원 추가
        await axiosInstance.post('/api/members', { username, email });
        Alert.alert('Success', 'Member added successfully.');
      }
      navigation.goBack(); // 이전 화면으로 이동
    } catch (error) {
      console.error('Error saving member:', error);
      Alert.alert('Error', 'Failed to save member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title={member ? 'Update Member' : 'Add Member'} onPress={saveMember} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
    padding: 8,
  },
});

export default MemberInput;
