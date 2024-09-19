// components/navigation/MemberNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MemberList from '../member/MemberList';
import MemberDetail from '../member/MemberDetail';
import MemberInput from '../member/MemberInput';

const Stack = createStackNavigator();

const MemberNavigator = ({ route }) => {
  const { token } = route.params; // route.params로 token 확인

  return (
    <Stack.Navigator initialRouteName="MemberList">
      <Stack.Screen name="MemberList" options={{ title: 'Member List' }}>
        {(props) => <MemberList {...props} token={token} />} {/* token 전달 */}
      </Stack.Screen>
      <Stack.Screen name="MemberDetail" options={{ title: 'Member Detail' }}>
        {(props) => <MemberDetail {...props} token={token} />} {/* token 전달 */}
      </Stack.Screen>
      <Stack.Screen name="MemberInput" options={{ title: 'Member Input' }}>
        {(props) => <MemberInput {...props} token={token} />} {/* token 전달 */}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default MemberNavigator;
