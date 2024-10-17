import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const ResidentRegistrationMain = () => {
  return (
    <View style={styles.container}>
      <View style={styles.modal}>
        {/* <Image
          source={require('./assets/resident_photo.png')} // 여기에 주민등록증 사진을 추가
          style={styles.image}
        /> */}
        <Text style={styles.nameText}>이태웅짱짱</Text>
        <Text style={styles.idText}>991231-2******</Text>
        <Text style={styles.addressText}>서울특별시 마포구 성암로 4층</Text>
        <Text style={styles.dateText}>2009. 07. 13.</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.verifyButton}>
            <Text style={styles.buttonText}>인증하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  idText: {
    fontSize: 18,
    marginBottom: 5,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  verifyButton: {
    backgroundColor: '#FFEB3B',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ResidentRegistrationMain;
