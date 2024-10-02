import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';

const AppInfo = () => {
  const appVersion = '1.0.0'; // 실제 앱에서는 이 값을 동적으로 가져올 수 있습니다.

  const openAppStore = () => {
    const url =
      Platform.OS === 'ios'
        ? 'https://apps.apple.com/app/id아이디번호' // iOS App Store URL
        : 'https://play.google.com/store/apps/details?id=패키지명'; // Google Play Store URL
    Linking.openURL(url);
  };

  const sendFeedback = () => {
    Linking.openURL('mailto:support@example.com?subject=앱 피드백');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>앱 정보</Text>

      <View style={styles.infoSection}>
        <Text style={styles.label}>버전</Text>
        <Text style={styles.value}>{appVersion}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>개발사</Text>
        <Text style={styles.value}>예시 주식회사</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>고객센터</Text>
        <Text style={styles.value}>02-1234-5678</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>이메일</Text>
        <Text style={styles.value}>support@example.com</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={openAppStore}>
        <Text style={styles.buttonText}>앱 평가하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={sendFeedback}>
        <Text style={styles.buttonText}>피드백 보내기</Text>
      </TouchableOpacity>

      <View style={styles.licenseSection}>
        <Text style={styles.licenseTitle}>오픈소스 라이선스</Text>
        <Text style={styles.licenseText}>
          이 앱은 다음의 오픈소스 라이브러리를 사용합니다:
          {'\n'}- React Native (MIT License)
          {'\n'}- React Navigation (MIT License)
          {'\n'}- ... (기타 사용된 라이브러리들)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  licenseSection: {
    marginTop: 30,
  },
  licenseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  licenseText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default AppInfo;
