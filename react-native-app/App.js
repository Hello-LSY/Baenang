import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import storeConfig from './redux/storeConfig';
import { useAuth } from './redux/authState';
import AppNavigator from './navigation/AppNavigator';

const MainApp = () => {
  const { auth, initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth(); 
  }, []);

  if (auth.loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {/* 로그인 여부에 따라 AppNavigator 내에서 처리 */}
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function AppWrapper() {
  return (
    <Provider store={storeConfig}>
      <MainApp />
    </Provider>
  );
}
