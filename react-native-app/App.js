//App.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import Login from './components/login/Login';
import HomeScreen from './components/home/HomeScreen';
import createAxiosInstance from './services/axiosInstance';

export default function App() {
  const [token, setToken] = useState(null);
  const [axiosInstance, setAxiosInstance] = useState(null);

const handleLoginSuccess = (token) => {
  setToken(token);
  const instance = createAxiosInstance(token);

  if (instance instanceof Promise) {
    console.error('Axios instance is a Promise, which is unexpected.');
  } else {
    console.log('Axios instance after login:', instance);
    setAxiosInstance(instance);
  }
};



  const handleLogout = () => {
    setToken(null);
    setAxiosInstance(null);
  };

  if (!token) {
    return (
      <View style={styles.container}>
        <Login onLoginSuccess={handleLoginSuccess} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {axiosInstance ? (
        <>
          <HomeScreen axiosInstance={axiosInstance} />
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>Loading Axios instance...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
