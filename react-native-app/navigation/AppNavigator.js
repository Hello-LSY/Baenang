// components/navigation/AppNavigator.js
<<<<<<< HEAD
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home/HomeScreen";
import BusinessCardScreen from "../screens/businessCard/BusinessCardScreen";
import CreateBusinessCardScreen from "../screens/businessCard/CreateBusinessCardScreen";
import TravelCertificationMain from "../screens/travelCertification/TravelCertificationMain";
import TravelCertificationList from "../screens/travelCertification/TravelCertificationList";
=======
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import BusinessCardScreen from '../screens/businessCard/BusinessCardScreen';
import CreateBusinessCardScreen from '../screens/businessCard/CreateBusinessCardScreen';
>>>>>>> dev

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
<<<<<<< HEAD
        options={{ title: "홈 화면" }}
=======
        options={{ title: '홈 화면' }}
>>>>>>> dev
      />
      <Stack.Screen
        name="BusinessCard"
        component={BusinessCardScreen}
<<<<<<< HEAD
        options={{ title: "명함 관리" }}
=======
        options={{ title: '명함 관리' }}
>>>>>>> dev
      />
      <Stack.Screen
        name="CreateBusinessCard"
        component={CreateBusinessCardScreen}
<<<<<<< HEAD
        options={{ title: "명함 등록" }}
      />
      <Stack.Screen
        name="TravelCertificationMain"
        component={TravelCertificationMain}
        options={{ title: "여행 인증서 메인" }}
      />
      <Stack.Screen
        name="TravelCertificationList"
        component={TravelCertificationList}
        options={{ title: "여행 인증서 리스트" }}
=======
        options={{ title: '명함 등록' }}
>>>>>>> dev
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
