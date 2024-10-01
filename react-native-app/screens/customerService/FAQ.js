import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FAQ = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>자주 묻는 질문</Text>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>Q: 앱을 어떻게 사용하나요?</Text>
        <Text style={styles.answer}>A: 앱 사용 방법에 대한 자세한 설명...</Text>
      </View>
      <View style={styles.questionContainer}>
        <Text style={styles.question}>Q: 비밀번호를 잊어버렸어요.</Text>
        <Text style={styles.answer}>A: 비밀번호 재설정 방법 설명...</Text>
      </View>
      {/* 추가 FAQ 항목들... */}
    </View>
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
  questionContainer: {
    marginBottom: 15,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  answer: {
    fontSize: 14,
  },
});

export default FAQ;
