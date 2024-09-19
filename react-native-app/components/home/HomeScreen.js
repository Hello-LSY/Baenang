//HomeScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';

const HomeScreen = ({ axiosInstance }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        console.log('axiosInstance received in HomeScreen:', axiosInstance);
        console.log('axiosInstance type:', typeof axiosInstance);

        if (axiosInstance && typeof axiosInstance.get === 'function') {
          const response = await axiosInstance.get('/api/members');
          setMembers(response.data);
        } else {
          throw new Error('axiosInstance is undefined or not a function');
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        Alert.alert('Error', 'Failed to fetch members');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [axiosInstance]);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <Text>Members List</Text>
      {/* Render your members here */}
    </View>
  );
};

export default HomeScreen;
