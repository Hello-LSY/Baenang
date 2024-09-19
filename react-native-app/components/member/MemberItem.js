import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const MemberItem = ({ member, onRemoveMember, axiosInstance }) => {
  const deleteMemberHandler = async () => {
    try {
      await axiosInstance.delete(`/api/members/${member.id}`);
      onRemoveMember((prevMembers) => prevMembers.filter((m) => m.id !== member.id));
      Alert.alert("Success", "Member deleted.");
    } catch (error) {
      Alert.alert("Error", "Failed to delete member.");
    }
  };

  return (
    <View style={styles.container}>
      <Text>{member.username}</Text>
      <Button title="Delete" onPress={deleteMemberHandler} />
    </View>
  );
};

export default MemberItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
});
