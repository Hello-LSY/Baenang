// components/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import BusinessCardScreen from '../screens/businessCard/BusinessCardScreen';
import CreateBusinessCardScreen from '../screens/businessCard/CreateBusinessCardScreen';

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
        component={CreateBusinessCardScreen}
        options={{ title: '명함 등록' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
