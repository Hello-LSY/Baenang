import React, { useCallback, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const calculateBorderRadius = (width) => {
  return width * 0.1;
};

const CustomButton = ({ title, onPress, style, textStyle }) => {
  const [borderRadius, setBorderRadius] = useState(0);
  const onLayout = useCallback((event) => {
    const { width } = event.nativeEvent.layout;
    setBorderRadius(calculateBorderRadius(width));
  }, []);

  return (
    <TouchableOpacity
      style={[styles.button, { borderRadius }, style]}
      onPress={onPress}
      onLayout={onLayout}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#87CEFA',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 15,
  },
  buttonText: {
    color: 'white',
  },
});

export default CustomButton;
