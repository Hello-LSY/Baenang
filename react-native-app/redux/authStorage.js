// authStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';
const MEMBER_ID_KEY = 'memberId';
const EMAIL_KEY = 'email';
const REGISTRATION_NUMBER_KEY = 'registrationNumber';
const NICKNAME_KEY = 'nickname';
const FULLNAME_KEY = 'fullName'; // fullName 추가

const authStorage = {
  async storeCredentials(token, memberId, email, registrationNumber, nickname, fullName) {
    try {
      if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
      if (memberId) await AsyncStorage.setItem(MEMBER_ID_KEY, String(memberId));
      if (email) await AsyncStorage.setItem(EMAIL_KEY, email);
      if (registrationNumber) await AsyncStorage.setItem(REGISTRATION_NUMBER_KEY, registrationNumber);
      if (nickname) await AsyncStorage.setItem(NICKNAME_KEY, nickname);
      if (fullName) await AsyncStorage.setItem(FULLNAME_KEY, fullName); // fullName 저장
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  },

  async getCredentials() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const memberId = await AsyncStorage.getItem(MEMBER_ID_KEY);
      const email = await AsyncStorage.getItem(EMAIL_KEY);
      const registrationNumber = await AsyncStorage.getItem(REGISTRATION_NUMBER_KEY);
      const nickname = await AsyncStorage.getItem(NICKNAME_KEY);
      const fullName = await AsyncStorage.getItem(FULLNAME_KEY); // fullName 불러오기
      return { token, memberId, email, registrationNumber, nickname, fullName };
    } catch (error) {
      console.error('Error getting credentials:', error);
      return { token: null, memberId: null, email: null, registrationNumber: null, nickname: null, fullName: null };
    }
  },

  async clearCredentials() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(MEMBER_ID_KEY);
      await AsyncStorage.removeItem(EMAIL_KEY);
      await AsyncStorage.removeItem(REGISTRATION_NUMBER_KEY);
      await AsyncStorage.removeItem(NICKNAME_KEY);
      await AsyncStorage.removeItem(FULLNAME_KEY); // fullName 제거
    } catch (error) {
      console.error('Error clearing credentials:', error);
    }
  },
};

export default authStorage;
