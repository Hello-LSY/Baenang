// navigation/AppNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import BusinessCardScreen from '../screens/businessCard/BusinessCardScreen';
import CreateBusinessCardScreen from '../screens/businessCard/CreateBusinessCardScreen'; // CreateBusinessCardScreen 추가
import UpdateBusinessCardScreen from '../screens/businessCard/UpdateBusinessCardScreen'; // UpdateBusinessCardScreen 사용
import TravelCertificationMain from '../screens/travelCertification/TravelCertificationMain';
import TravelCertificationList from '../screens/travelCertification/TravelCertificationList';
import TravelCertificationDetail from '../components/travelCertification/TravelCertificationDetail';
import TravelCertificationEdit from '../components/travelCertification/TravelCertificationEdit';
import TravelCertificationProcess from '../components/travelCertification/TravelCertificationProcess';
import TravelerPersonalityTest from '../screens/travelpersonalitytest/TravelPersonalityTest.js';
import ExchangeRateListScreen from '../screens/exchangeRate/ExchangeRateListScreen';
import ExchangeRateDetailScreen from '../screens/exchangeRate/ExchangeRateDetailScreen.js';
import CustomerService from '../screens/customerService/CustomerService.js';

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
        name="CreateBusinessCard" // CreateBusinessCardScreen 추가
        component={CreateBusinessCardScreen}
        options={{ title: '명함 등록' }}
      />
      <Stack.Screen
        name="UpdateBusinessCard"
        component={UpdateBusinessCardScreen}
        options={{ title: '명함 수정' }}
      />
      <Stack.Screen
        name="TravelCertificationMain"
        component={TravelCertificationMain}
        options={{ title: '여행 인증서 메인' }}
      />
      <Stack.Screen
        name="TravelCertificationList"
        component={TravelCertificationList}
        options={{ title: '여행 인증서 리스트' }}
      />
      <Stack.Screen
        name="TravelCertificationDetail"
        component={TravelCertificationDetail}
        options={{ title: '여행 인증서' }}
      />
      <Stack.Screen
        name="TravelCertificationEdit"
        component={TravelCertificationEdit}
        options={{ title: '여행 인증서 수정' }}
      />
      <Stack.Screen
        name="TravelCertificationProcess"
        component={TravelCertificationProcess}
        options={{ title: '여행 인증서 등록 과정' }}
      />
      <Stack.Screen
        name="TravelerPersonalityTest"
        component={TravelerPersonalityTest}
        options={{ title: '여행 인증서 등록 과정' }}
      />
      <Stack.Screen
        name="ExchangeRateList"
        component={ExchangeRateListScreen}
        options={{ title: '환율 정보' }}
      />
      <Stack.Screen
        name="ExchangeRateDetail"
        component={ExchangeRateDetailScreen}
        options={{ title: '환율 상세' }}
      />
      <Stack.Screen
        name="CustomerService"
        component={CustomerService}
        options={{ title: '고객 센터' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
