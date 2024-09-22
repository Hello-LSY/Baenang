import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import AppNavigator from './components/navigation/AppNavigator';
import AuthNavigator from './components/navigation/AuthNavigator';
import { AuthProvider, AuthContext } from './services/AuthContext';

const App = () => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* 토큰 유무에 따라 네비게이터 선택 */}
      {token ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// AuthProvider로 App을 감싸서 전역 상태를 제공
export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
