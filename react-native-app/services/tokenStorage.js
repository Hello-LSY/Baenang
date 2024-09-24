import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';
const MEMBER_ID_KEY = 'memberId';

const tokenStorage = {
  async setCredentials(token, memberId) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      await AsyncStorage.setItem(MEMBER_ID_KEY, String(memberId)); // memberId를 문자열로 저장
    } catch (error) {
      console.error("Error saving credentials:", error);
    }
  },
  async getCredentials() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const memberId = await AsyncStorage.getItem(MEMBER_ID_KEY);
      return { token, memberId };
    } catch (error) {
      console.error("Error getting credentials:", error);
      return { token: null, memberId: null };
    }
  },
  async clearCredentials() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(MEMBER_ID_KEY);
    } catch (error) {
      console.error("Error clearing credentials:", error);
    }
  }
};

export default tokenStorage;
