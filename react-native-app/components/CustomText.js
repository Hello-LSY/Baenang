import React from 'react';
import { Text } from 'react-native';

const CustomText = (props) => (
  <Text {...props} style={[{ fontFamily: 'RiaSans-ExtraBold' }, props.style]}>
    {props.children}
  </Text>
);

export default CustomText;
