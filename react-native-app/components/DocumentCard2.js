import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

const DocumentCard2 = ({
  title,
  isNew,
  onPress,
  backgroundColor = '#e0f0ff',
}) => (
  <Pressable onPress={onPress} style={[styles.card, { backgroundColor }]}>
    <Text style={styles.title}>{title}</Text>
    {isNew && <Text style={styles.newTag}>NEW</Text>}
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,

    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  newTag: {
    fontSize: 12,
    color: '#fff',
    backgroundColor: '#4a90e2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
});

export default DocumentCard2;
