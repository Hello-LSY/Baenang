import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

const MemberInput = ({ axiosInstance, onAddMember }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const addMemberHandler = async () => {
    try {
      const response = await axiosInstance.post('/api/members', { username, password });
      onAddMember((prevMembers) => [...prevMembers, response.data]);
      setUsername('');
      setPassword('');
      Alert.alert("Success", "Member added successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to add member.");
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
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Add Member" onPress={addMemberHandler} />
    </View>
  );
};

export default MemberInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 12,
  },
});
