// components/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import BusinessCardScreen from '../screens/BusinessCardScreen';
import CreateBusinessCard from '../screens/CreateBusinessCardScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '홈 화면' }}
      />
      <Stack.Screen
        name="BusinessCard"
        component={BusinessCardScreen}
        options={{ title: '명함 관리' }}
      />
      <Stack.Screen
        name="CreateBusinessCard"
        component={CreateBusinessCard}
        options={{ title: '명함 등록' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
