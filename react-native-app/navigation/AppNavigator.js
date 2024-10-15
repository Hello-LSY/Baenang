import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, Platform, StatusBar } from 'react-native';

import HomeScreen from '../screens/home/HomeScreen';
import BusinessCardScreen from '../screens/businessCard/BusinessCardScreen';
import CreateBusinessCardScreen from '../screens/businessCard/CreateBusinessCardScreen';
import UpdateBusinessCardScreen from '../screens/businessCard/UpdateBusinessCardScreen';
import TravelCertificationMain from '../screens/travelCertification/TravelCertificationMain';
import TravelCertificationList from '../screens/travelCertification/TravelCertificationList';

import TravelCertificationDetail from '../components/travelCertification/TravelCertificationDetail';
import TravelCertificationEdit from '../components/travelCertification/TravelCertificationEdit';
import TravelCertificationProcess from '../components/travelCertification/TravelCertificationProcess';
import TravelerPersonalityTest from '../screens/travelpersonalitytest/TravelPersonalityTest.js';
import ResultScreen from '../screens/travelpersonalitytest/ResultScreen.js';
import ExchangeRateListScreen from '../screens/exchangeRate/ExchangeRateListScreen';
import ExchangeRateDetailScreen from '../screens/exchangeRate/ExchangeRateDetailScreen.js';
import CommunityHome from '../screens/community/CommunityHome.js';
import CreatePost from '../screens/community/CreatePost';
import EditPost from '../screens/community/EditPost';
import UserProfile from '../screens/UserProfile.js';
import CustomerService from '../screens/customerService/CustomerService.js';
import Login from '../screens/login/Login';
import Signup from '../screens/signup/Signup';
import ResidentRegistrationMain from '../screens/DocumentInfo/ResidentRegistrationMain.js';
import DriverLicense from '../screens/DocumentInfo/DriverLicenseMain.js';
import Passport from '../screens/DocumentInfo/PassportMain.js';
import ISIC from '../screens/DocumentInfo/ISICMain.js';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const MainTabs = () => {
  const statusBarHeight = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' },
          tabBarStyle: {
            backgroundColor: 'white',
            paddingTop: Platform.OS === 'ios' ? 50 : statusBarHeight,
            elevation: 0, // Android에서 그림자 제거
            shadowOpacity: 0, // iOS에서 그림자 제거
          },
          tabBarIndicatorStyle: { backgroundColor: '#ea4c89' },
        }}
      >
        <Tab.Screen name="홈" component={HomeScreen} />
        <Tab.Screen name="커뮤니티" component={CommunityHome} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: '로그인', headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ title: '회원가입' }}
      />
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
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
        options={{ title: '여행 유형 테스트' }}
      />
      <Stack.Screen
        name="ResultScreen"
        component={ResultScreen}
        options={{ title: '여행 유형 테스트 결과' }}
      />
      <Stack.Screen
        name="Community"
        component={CommunityHome}
        options={{ title: '커뮤니티' }}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePost}
        options={{ title: '게시글 작성' }}
      />
      <Stack.Screen
        name="EditPost"
        component={EditPost}
        options={{ title: '게시글 수정' }}
      />
      <Stack.Screen
        name="ExchangeRateListScreen"
        component={ExchangeRateListScreen}
        options={{ title: '환율 정보' }}
      />
      <Stack.Screen
        name="ExchangeRateDetail"
        component={ExchangeRateDetailScreen}
        options={{ title: '환율 상세' }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ title: '내 프로필' }}
      />
      <Stack.Screen
        name="CustomerService"
        component={CustomerService}
        options={{ title: '고객 센터' }}
      />
      <Stack.Screen
        name="ResidentRegistrationMain"
        component={ResidentRegistrationMain}
        options={{ presentation: 'modal' }} // 모달처럼 보이게 설정
      />
      <Stack.Screen
        name="DriverLicense"
        component={DriverLicense}
        options={{ presentation: 'modal' }} // 모달처럼 보이게 설정
      />
      <Stack.Screen
        name="Passport"
        component={Passport}
        options={{ presentation: 'modal' }} // 모달처럼 보이게 설정
      />
      <Stack.Screen
        name="ISIC"
        component={ISIC}
        options={{ presentation: 'modal' }} // 모달처럼 보이게 설정
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
