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
import DocumentModal from './DocumentModal'; // 새로 만들 컴포넌트

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const DocumentWallet2 = ({ title, documents, backgroundColors = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useLayoutEffect(() => {
    const toValue = expanded ? contentHeight : Math.min(contentHeight, 3 * 60);
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
      </Pressable>
      <Animated.View
        style={[styles.contentWrapper, { height: animatedHeight }]}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#37415F',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  expandButton: {},
  expandButtonText: {
    fontSize: 18,
  },
  content: {
    padding: 10,
  },
  showMoreButton: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e0e0e0',
  },
  showMoreText: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
});

export default DocumentWallet2;
