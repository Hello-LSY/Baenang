// components/navigation/AppNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/home/HomeScreen";
import BusinessCardScreen from "../screens/businessCard/BusinessCardScreen";
import CreateBusinessCardScreen from "../screens/businessCard/CreateBusinessCardScreen";
import TravelCertificationMain from "../screens/travelCertification/TravelCertificationMain";
import TravelCertificationList from "../screens/travelCertification/TravelCertificationList";
import TravelCertificationDetail from "../components/travelCertification/TravelCertificationDetail";
import TravelCertificationProcess from '../components/travelCertification/TravelCertificationProcess';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "홈 화면" }}
      />
      <Stack.Screen
        name="BusinessCard"
        component={BusinessCardScreen}
        options={{ title: "명함 관리" }}
      />
      <Stack.Screen
        name="CreateBusinessCard"
        component={CreateBusinessCardScreen}
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
      />
      <Stack.Screen
        name="TravelCertificationDetail"
        component={TravelCertificationDetail}
        options={{ title: "여행 인증서" }}
      />
      <Stack.Screen
        name="TravelCertificationProcess"
        component={TravelCertificationProcess}
        options={{ title: "여행 인증 과정" }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
