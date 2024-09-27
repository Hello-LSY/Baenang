// components/login/Login.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { useAuth } from '../../redux/authState';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';

const Login = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, auth } = useAuth();

  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const yOffset = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  useEffect(() => {
    if (auth.token) {
      Alert.alert('Success', '로그인 성공');
      navigation.navigate('Home');
    } else if (auth.error) {
      Alert.alert('Error', auth.error || '로그인 실패');
    }
  }, [auth.token, auth.error, navigation]);

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert('Error', '아이디와 비밀번호를 입력하세요.');
      return;
    }
    login(username, password);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>여행의 좋은 추억을 간직해요</Text>
      </View>
      <Animated.View style={{ transform: [{ translateY: yOffset }] }}>
        <Image
          source={require('../../assets/images/baenang_logo.png')}
          style={styles.logo}
        />
      </Animated.View>
      <Text style={styles.login}>로그인</Text>
      <CustomInput
        style={styles.textInput}
        placeholder="ID"
        value={username}
        onChangeText={setUsername}
      />
      <CustomInput
        style={styles.textInput}
        placeholder="PASSWORD"
        value={password}
        onChangeText={setPassword}
        isPassword={true}
      />
      <CustomButton
        style={styles.loginButton}
        onPress={handleLogin}
        title="로그인"
      />
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#D9EEFF',
  },
  title: {
    fontSize: 14,
    color: '#777777',
  },
  login: {
    fontSize: 18,
    marginBottom: 20,
  },
  textInput: {
    width: '80%',
    borderColor: '#87CEFA',
    color: '#87CEFA',
  },
  loginButton: {
    fontSize: 16,
    width: '40%',
  },
  signupText: {
    color: '#87CEFA',
    marginTop: 15,
    fontSize: 16,
  },
  logo: {
    width: 360,
    height: 180,
  },
});

export default Login;
