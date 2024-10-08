import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const UserProfile = () => {
  const [username, setUsername] = useState(''); // 사용자 이름 상태
  const [email, setEmail] = useState(''); // 이메일 상태

  const handleSaveChanges = () => {
    // 개인정보 변경 저장 로직 (예: API 호출)
    Alert.alert('변경사항이 저장되었습니다.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>개인정보 변경</Text>

      <View style={styles.inputContainer}>
        <Feather name="user" size={20} color="#333" style={styles.icon} />
        <TextInput
          placeholder="사용자 이름"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Feather name="mail" size={20} color="#333" style={styles.icon} />
        <TextInput
          placeholder="이메일"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity onPress={handleSaveChanges}>
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.saveButton}
        >

          <Text style={styles.saveButtonText}>변경사항 저장</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

export default UserProfile;