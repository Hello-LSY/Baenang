// components/navigation/AuthNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/login/Login';  // 경로 수정
import Signup from '../screens/signup/Signup';  // 경로 수정

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: '로그인' }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ title: '회원가입' }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
