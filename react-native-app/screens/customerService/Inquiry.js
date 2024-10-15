import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

const initialInquiries = [
  { id: '1', title: '문서 인증 관련 문의', date: '2024-09-15', status: '답변 대기' },
  { id: '2', title: '인증서 불러오기 오류', date: '2024-09-10', status: '답변 완료' },
  { id: '3', title: '기능 피드백드립니다.', date: '2024-09-05', status: '처리 중' },
];

const InquiryItem = ({ item }) => (
  <View style={styles.inquiryItem}>
    <Text style={styles.inquiryTitle}>{item.title}</Text>
    <Text style={styles.inquiryContent}>{item.content}</Text>
    <Text style={styles.inquiryDate}>{item.date}</Text>
    <Text style={styles.inquiryStatus}>{item.status}</Text>
  </View>
);

const Inquiry = () => {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [newInquiryTitle, setNewInquiryTitle] = useState('');
  const [newInquiryContent, setNewInquiryContent] = useState('');

  const addInquiry = () => {
    if (newInquiryTitle.trim() === '' || newInquiryContent.trim() === '')
      return;

    const newInquiry = {
      id: Date.now().toString(),
      title: newInquiryTitle,
      content: newInquiryContent,
      date: new Date().toISOString().split('T')[0],
      status: '답변 대기',
    };

    setInquiries([newInquiry, ...inquiries]);
    setNewInquiryTitle('');
    setNewInquiryContent('');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>1:1 문의</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newInquiryTitle}
          onChangeText={setNewInquiryTitle}
          placeholder="문의 제목"
        />
        <TextInput
          style={[styles.input, styles.contentInput]}
          value={newInquiryContent}
          onChangeText={setNewInquiryContent}
          placeholder="문의 내용"
          multiline
          numberOfLines={4}
        />
        <TouchableOpacity style={styles.addButton} onPress={addInquiry}>
          <Text style={styles.addButtonText}>문의하기</Text>
        </TouchableOpacity>
      </View>

      {inquiries.map((item) => (
        <InquiryItem key={item.id} item={item} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inquiryItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  inquiryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inquiryContent: {
    fontSize: 14,
    marginBottom: 5,
  },
  inquiryDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  inquiryStatus: {
    fontSize: 14,
    color: '#007AFF',
  },
});

export default Inquiry;
