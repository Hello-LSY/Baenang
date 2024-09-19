import React from 'react';
import { FlatList, View, Text, Button, StyleSheet } from 'react-native';
import MemberItem from './MemberItem';

const MemberList = ({ members, onRemoveMember, axiosInstance }) => {
  return (
    <FlatList
      data={members}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <MemberItem
          member={item}
          onRemoveMember={onRemoveMember}
          axiosInstance={axiosInstance}
        />
      )}
    />
  );
};

export default MemberList;
