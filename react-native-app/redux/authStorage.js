// redux/authStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';
const MEMBER_ID_KEY = 'memberId';
const EMAIL_KEY = 'email';
const REGISTRATION_NUMBER_KEY = 'registrationNumber';
const NICKNAME_KEY = 'nickname';

const authStorage = {
  async storeCredentials(token, memberId, email, registrationNumber, nickname) {
    try {
      // token이 유효한지 확인 후 저장
      if (token) await AsyncStorage.setItem(TOKEN_KEY, token);

      // memberId가 유효한지 확인 후 저장
      if (memberId) await AsyncStorage.setItem(MEMBER_ID_KEY, String(memberId));

      // email이 유효한지 확인 후 저장
      if (email) await AsyncStorage.setItem(EMAIL_KEY, email);

      // registrationNumber가 유효한지 확인 후 저장
      if (registrationNumber) await AsyncStorage.setItem(REGISTRATION_NUMBER_KEY, registrationNumber);

      // nickname이 유효한지 확인 후 저장
      if (nickname) await AsyncStorage.setItem(NICKNAME_KEY, nickname);
    } catch (error) {
      console.error("Error saving credentials:", error);
    }
  },
  async getCredentials() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const memberId = await AsyncStorage.getItem(MEMBER_ID_KEY);
      const email = await AsyncStorage.getItem(EMAIL_KEY);
      const registrationNumber = await AsyncStorage.getItem(REGISTRATION_NUMBER_KEY);
      const nickname = await AsyncStorage.getItem(NICKNAME_KEY);
      return { token, memberId, email, registrationNumber, nickname };
    } catch (error) {
      console.error("Error getting credentials:", error);
      return { token: null, memberId: null, email: null, registrationNumber: null, nickname: null };
    }
  },
  async clearCredentials() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(MEMBER_ID_KEY);
      await AsyncStorage.removeItem(EMAIL_KEY);
      await AsyncStorage.removeItem(REGISTRATION_NUMBER_KEY);
      await AsyncStorage.removeItem(NICKNAME_KEY);
    } catch (error) {
      console.error("Error clearing credentials:", error);
    }
  }
};

export default authStorage;
