// screens/businessCard/UpdateBusinessCardScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { updateBusinessCard } from '../../redux/businessCardSlice';

const UpdateBusinessCardScreen = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { businessCard } = route.params;
  const auth = useSelector((state) => state.auth);

  const [name, setName] = useState(businessCard.name || '');
  const [country, setCountry] = useState(businessCard.country || '');
  const [email, setEmail] = useState(businessCard.email || '');
  const [sns, setSns] = useState(businessCard.sns || '');
  const [introduction, setIntroduction] = useState(businessCard.introduction || '');

  const handleUpdateCard = () => {
    const updatedBusinessCardData = { name, country, email, sns, introduction };

    dispatch(updateBusinessCard({ cardId: businessCard.cardId, businessCardData: updatedBusinessCardData }))
      .then(() => {
        alert('명함이 성공적으로 수정되었습니다.');
        navigation.goBack();
      })
      .catch((error) => {
        console.error('명함 수정 중 오류:', error);
        alert('명함 수정 중 오류가 발생했습니다.');
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>명함 수정</Text>
      <TextInput
        style={styles.input}
        placeholder="이름"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="국가"
        value={country}
        onChangeText={setCountry}
      />
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="SNS"
        value={sns}
        onChangeText={setSns}
      />
      <TextInput
        style={styles.input}
        placeholder="소개"
        value={introduction}
        onChangeText={setIntroduction}
      />
      <Button title="명함 수정" onPress={handleUpdateCard} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5, 
  },
});

export default UpdateBusinessCardScreen;
