import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Terms = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>이용약관</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. 서비스 이용 약관</Text>
        <Text style={styles.content}>
          본 약관은 'BAENANG'이 제공하는 모든 서비스의 이용 조건 및 절차, 회사와
          회원 간의 권리, 의무 및 책임사항 등을 규정하고 있습니다.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. 개인정보 수집 및 이용</Text>
        <Text style={styles.content}>
          회사는 서비스 제공을 위해 필요한 최소한의 개인정보를 수집하며,
          이용자의 개인정보를 보호하기 위해 최선을 다하고 있습니다.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. 서비스 이용 제한</Text>
        <Text style={styles.content}>
          회사는 회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을
          방해한 경우, 서비스 이용을 제한할 수 있습니다.
        </Text>
      </View>

      {/* 추가 약관 섹션들... */}
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default Terms;
