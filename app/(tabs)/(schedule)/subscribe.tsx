import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {
  const [userId, setUserId] = useState('');
  const [routeId, setRouteId] = useState('');

  const subscribeToRoute = () => {
    axios.post(`http://localhost:3000/users/${userId}/subscribe`, {
      routeId
    })
    .then((response) => {
      Alert.alert('Success', response.data.message || 'Subscribed successfully!');
    })
    .catch((error) => {
      Alert.alert('Error', 'Failed to subscribe. Please try again.');
      console.error(error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subscribe to a Bus Route</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter User ID"
        value={userId}
        onChangeText={setUserId}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Route ID"
        value={routeId}
        onChangeText={setRouteId}
      />

      <Button title="Subscribe" onPress={subscribeToRoute} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});
