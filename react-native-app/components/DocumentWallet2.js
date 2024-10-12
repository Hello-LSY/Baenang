import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

import DocumentCard2 from './DocumentCard2';
import DocumentModal from './DocumentModal';
import { useNavigation } from '@react-navigation/native'; // navigation 추가

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CARD_HEIGHT = 60; // 각 카드의 높이
const CARD_MARGIN = 10; // 카드 사이의 간격
const VISIBLE_CARDS = 3; // 접혀있을 때 보이는 카드 수

const DocumentWallet2 = ({ title, documents, backgroundColors = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const navigation = useNavigation(); // navigation 가져오기

  useLayoutEffect(() => {
    const toValue = expanded
      ? contentHeight
      : VISIBLE_CARDS * (CARD_HEIGHT + CARD_MARGIN) - CARD_MARGIN;
    Animated.timing(animatedHeight, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [expanded, contentHeight]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const onContentLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setContentHeight(height);
  };

  const openModal = (document) => {
    setSelectedDocument(document);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={toggleExpand} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.expandButton}>{expanded ? '접기' : '펼치기'}</Text>
      </Pressable>
      <Animated.View
        style={[
          styles.contentWrapper,
          { height: animatedHeight, overflow: 'hidden' },
        ]}
      >
        <View style={styles.content} onLayout={onContentLayout}>
          {documents.map((doc, index) => (
            <DocumentCard2
              key={index}
              title={doc.title}
              isNew={doc.isNew}
              onPress={() => openModal(doc)}
              backgroundColor={
                backgroundColors[index % backgroundColors.length] || '#e0f0ff'
              }
            />
          ))}
        </View>
      </Animated.View>
      {!expanded && documents.length > VISIBLE_CARDS && (
        <Pressable onPress={toggleExpand} style={styles.showMoreButton}>
          <Text style={styles.showMoreText}></Text>
        </Pressable>
      )}
      <DocumentModal
        visible={modalVisible}
        document={selectedDocument}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#37415F',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#37415F',
    padding: 15,
  },
  title: {
    fontSize: 18,

    fontWeight: 'bold',
    color: '#fff',
  },
  expandButton: {
    color: '#fff',
    fontSize: 14,
  },
  contentWrapper: {
    overflow: 'hidden',
  },
  content: {
    padding: 10,
  },
  showMoreButton: {
    alignItems: 'center',
    backgroundColor: '#37415F',
  },
  showMoreText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DocumentWallet2;
