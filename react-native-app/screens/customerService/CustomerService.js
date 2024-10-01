import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FAQ from './FAQ';
import Inquiry from './Inquiry';
import Terms from './Terms';
import Privacy from './Privacy';
import Notice from './Notice';
import AppInfo from './AppInfo';

const CustomerService = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const serviceItems = [
    { id: '1', title: '자주 묻는 질문', component: FAQ },
    { id: '2', title: '1:1 문의', component: Inquiry },
    { id: '3', title: '공지사항', component: Notice },
    { id: '4', title: '이용약관', component: Terms },
    { id: '5', title: '개인정보 처리방침', component: Privacy },
    { id: '6', title: '앱 정보', component: AppInfo },
  ];

  const renderContent = () => {
    if (!selectedItem) {
      return (
        <View>
          <Text style={styles.description}>
            고객 센터에 문의하시려면 아래 연락처로 연락해 주세요.
          </Text>
          <Text style={styles.contact}>전화: 02-1234-5678</Text>
          <Text style={styles.contact}>이메일: support@example.com</Text>
        </View>
      );
    }
    const SelectedComponent = selectedItem.component;
    return <SelectedComponent />;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>고객 센터</Text>

      <View style={styles.grid}>
        {serviceItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.gridItem,
              selectedItem?.id === item.id && styles.selectedItem,
            ]}
            onPress={() => setSelectedItem(item)}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.contentContainer}>{renderContent()}</View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItem: {
    width: '48%',
    aspectRatio: 3,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
  },
  selectedItem: {
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  itemTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  contentContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  contact: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default CustomerService;
