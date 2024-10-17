import React, { useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DocumentCard from './DocumentCard';

const DocumentWallet = () => {
  const navigation = useNavigation();
  const [expandedId, setExpandedId] = useState(null);
  const expandAnimation = useRef(new Animated.Value(1)).current;

  const documents = [
    { id: '1', title: '주민등록증', color: '#4158D0' },
    { id: '2', title: '운전면허증', color: '#0093E9' },
    { id: '3', title: '여권', color: '#8EC5FC' },
    { id: '4', title: '건강보험증', color: '#FF9A8B' },
  ];

  const handleCardPress = (document) => {
    if (expandedId === document.id) {
      // 이미 확장된 카드를 다시 누르면 상세 페이지로 이동
      navigation.navigate('DocumentDetail', { document });
    } else {
      // 카드 확장
      setExpandedId(document.id);
      Animated.spring(expandAnimation, {
        toValue: 1.1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <ScrollView style={styles.container}>
      {documents.map((doc, index) => (
        <View
          key={doc.id}
          style={[styles.cardWrapper, { zIndex: documents.length - index }]}
        >
          <DocumentCard
            title={doc.title}
            color={doc.color}
            isExpanded={expandedId === doc.id}
            onPress={() => handleCardPress(doc)}
            expandAnimation={
              expandedId === doc.id ? expandAnimation : new Animated.Value(1)
            }
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  cardWrapper: {
    marginBottom: -60, // 카드 겹침 효과
  },
});

export default DocumentWallet;
