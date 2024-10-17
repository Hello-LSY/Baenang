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
  Modal,
  TouchableOpacity,
} from 'react-native';

import DocumentCard2 from './DocumentCard2';
import DocumentModal from './DocumentModal';
import { useNavigation } from '@react-navigation/native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CARD_HEIGHT = 60;
const CARD_MARGIN = 10;
const VISIBLE_CARDS = 3;

const DocumentWallet2 = ({ title, documents, backgroundColors = [] }) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [customAlertVisible, setCustomAlertVisible] = useState(false); // 커스텀 알림 모달 상태

  const navigation = useNavigation();

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
    const unavailableDocuments = [
      '예방접종증명서',
      '출입국사실증명서',
      '여행보험증명서',
    ];

    if (unavailableDocuments.includes(document.title)) {
      setCustomAlertVisible(true); // 서비스 준비중 모달 표시
    } else {
      setSelectedDocument(document);
      setModalVisible(true);
    }
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

      {/* 커스텀 알림 모달 */}
      <Modal
        transparent={true}
        visible={customAlertVisible}
        animationType="fade"
        onRequestClose={() => setCustomAlertVisible(false)}
      >
        <View style={styles.alertContainer}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>서비스 준비중</Text>
            <Text style={styles.alertMessage}>
              해당 문서는 아직 준비중입니다.
            </Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => setCustomAlertVisible(false)}
            >
              <Text style={styles.alertButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  alertContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  alertButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DocumentWallet2;
