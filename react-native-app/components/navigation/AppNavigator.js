// components/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MemberList from '../member/MemberList';
import MemberDetail from '../member/MemberDetail';
import MemberInput from '../member/MemberInput';

const Stack = createStackNavigator();

const AppNavigator = ({ token }) => {
  return (
    <Stack.Navigator initialRouteName="MemberList">
      <Stack.Screen name="MemberList" options={{ title: 'Members' }}>
        {(props) => <MemberList {...props} token={token} />}
      </Stack.Screen>
      <Stack.Screen name="MemberDetail" options={{ title: 'Member Detail' }}>
        {(props) => <MemberDetail {...props} token={token} />}
      </Stack.Screen>
      <Stack.Screen name="MemberInput" options={{ title: 'Member Input' }}>
        {(props) => <MemberInput {...props} token={token} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AppNavigator;
