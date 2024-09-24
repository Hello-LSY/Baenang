import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import createAxiosInstance from '../../services/axiosInstance';

const MemberInput = ({ navigation, route }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // 비밀번호 상태 추가
  const { token, fetchMembers } = route.params; // route.params에서 fetchMembers 가져오기

  const saveMember = async () => {
    if (!username || !password) {  // username과 password가 비어 있는지 확인
      Alert.alert('Error', 'Username and Password are required.');
      return;
    }

    try {
      const axiosInstance = createAxiosInstance(token);
      const response = await axiosInstance.post('/api/members', {
        username,
        password,
      });
      Alert.alert('Success', 'Member saved successfully');

      // 리스트를 새로고침
      if (fetchMembers) {
        fetchMembers();
      }

      navigation.navigate('MemberList'); // 저장 후 MemberList로 이동
    } catch (error) {
      console.error('Error saving member:', error);
      Alert.alert('Error', 'Failed to save member');
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
        placeholder="Password"
        value={password} // 비밀번호 입력 필드
        onChangeText={setPassword} // 비밀번호 상태 업데이트
        secureTextEntry
      />
      <Button title="Save Member" onPress={saveMember} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 12,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default MemberInput;
