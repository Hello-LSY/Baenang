import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'authToken';  // 토큰을 저장할 키 값

const tokenStorage = {
  // 토큰 저장
  async setToken(token) {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      console.log("Token saved successfully");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  },

  // 토큰 가져오기
  async getToken() {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token !== null) {
        console.log("Token retrieved:", token);
        return token;
      } else {
        console.log("No token found");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  },

  // 토큰 삭제
  async clearToken() {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      console.log("Token cleared successfully");
    } catch (error) {
      console.error("Error clearing token:", error);
    }
  }
};

export default tokenStorage;
