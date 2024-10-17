import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Privacy = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>개인정보 처리방침</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. 개인정보의 수집 및 이용 목적</Text>
        <Text style={styles.content}>
          회사는 다음과 같은 목적으로 개인정보를 수집하고 이용합니다:
          {'\n'}- 서비스 제공 및 계약의 이행
          {'\n'}- 회원 관리
          {'\n'}- 신규 서비스 개발 및 마케팅에의 활용
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. 수집하는 개인정보의 항목</Text>
        <Text style={styles.content}>
          회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집하고 있습니다:
          {'\n'}- 필수항목: 이름, 이메일 주소, 비밀번호
          {'\n'}- 선택항목: 연락처, 주소
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. 개인정보의 보유 및 이용기간</Text>
        <Text style={styles.content}>
          회사는 회원탈퇴 시 또는 수집·이용목적이 달성된 후에는 해당 정보를 지체
          없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우
          회사는 관계법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
        </Text>
      </View>

      {/* 추가 개인정보 처리방침 섹션들... */}
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

export default Privacy;
