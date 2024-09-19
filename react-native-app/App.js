// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, ActivityIndicator, Button, StyleSheet, Alert } from 'react-native'; // Alert 추가
import Login from './components/login/Login';
import AppNavigator from './components/navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLoginSuccess = async (token) => {
    setToken(token);
    await AsyncStorage.setItem('token', token);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setToken(null);
      Alert.alert('Logged out', 'You have been logged out.');
    } catch (error) {
      console.error('Logout Error:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      if (savedToken) {
        setToken(savedToken);
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? (
        <AppNavigator token={token} />
      ) : (
        <View style={styles.container}>
          <Login onLoginSuccess={handleLoginSuccess} />
        </View>
      )}
      {token && <Button title="Logout" onPress={handleLogout} />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
