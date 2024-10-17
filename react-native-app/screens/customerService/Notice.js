import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const notices = [
  {
    id: '1',
    title: '시스템 점검 안내',
    date: '2024-09-15',
    content: '9월 16일 새벽 2시부터 4시까지 시스템 점검이 있을 예정입니다.',
  },
  {
    id: '2',
    title: '새로운 기능 업데이트',
    date: '2024-09-10',
    content: '이번 업데이트에서는 사용자 인터페이스가 개선되었습니다.',
  },
  {
    id: '3',
    title: '개인정보 처리방침 변경 안내',
    date: '2024-09-05',
    content:
      '개인정보 처리방침이 변경되었습니다. 자세한 내용은 공지사항을 확인해주세요.',
  },
  {
    id: '4',
    title: '개인정보 처리방침 변경 안내',
    date: '2024-09-05',
    content:
      '개인정보 처리방침이 변경되었습니다. 자세한 내용은 공지사항을 확인해주세요.',
  },
  {
    id: '5',
    title: '개인정보 처리방침 변경 안내',
    date: '2024-09-05',
    content:
      '개인정보 처리방침이 변경되었습니다. 자세한 내용은 공지사항을 확인해주세요.',
  },
  {
    id: '6',
    title: '개인정보 처리방침 변경 안내',
    date: '2024-09-05',
    content:
      '개인정보 처리방침이 변경되었습니다. 자세한 내용은 공지사항을 확인해주세요.',
  },
];

const NoticeItem = ({ item }) => (
  <View style={styles.noticeItem}>
    <Text style={styles.noticeTitle}>{item.title}</Text>
    <Text style={styles.noticeDate}>{item.date}</Text>
    <Text style={styles.noticeContent}>{item.content}</Text>
  </View>
);
const Notice = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>공지사항</Text>
      {notices.map((item) => (
        <NoticeItem key={item.id} item={item} />
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
  noticeItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noticeDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  noticeContent: {
    fontSize: 14,
  },
});

export default Notice;
