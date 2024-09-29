import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, ActivityIndicator, View } from 'react-native';
import { Provider } from 'react-redux';
import storeConfig from './redux/storeConfig';
import { useAuth } from './redux/authState';
import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';

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
      {auth.token ? <AppNavigator /> : <AuthNavigator />}
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
