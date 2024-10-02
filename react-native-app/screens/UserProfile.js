import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

const UserProfile = () => {
  const [username, setUsername] = useState(''); // 사용자 이름 상태
  const [email, setEmail] = useState(''); // 이메일 상태

  const handleLogout = () => {
    // 로그아웃 로직 (예: 세션 삭제, 상태 초기화 등)
    Alert.alert('로그아웃되었습니다.');
  };

  const handleSaveChanges = () => {
    // 개인정보 변경 저장 로직 (예: API 호출)
    Alert.alert('변경사항이 저장되었습니다.');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>개인정보 변경</Text>

      <Text>사용자 이름:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          marginBottom: 20,
          padding: 10,
        }}
      />

      <Text>이메일:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          marginBottom: 20,
          padding: 10,
        }}
        keyboardType="email-address"
      />

      <Button title="변경사항 저장" onPress={handleSaveChanges} />
      <Button title="로그아웃" onPress={handleLogout} color="red" />
    </View>
  );
};

export default UserProfile;
