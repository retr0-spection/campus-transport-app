import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Make sure to install this package
import BusImage from '../../../assets/images/bus.png'
import API from '@/api';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [departures, setDepartures] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Fetch departures (live schedule) from API
  const fetchLiveSchedule = async () => {
    try {
        
      // const response = await API.V1.Schedules.GetSchedules({});
      // setDepartures(response); // Assuming the API returns a list of departures
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch live schedule.');
      console.error(error);
    }
  };

  // Fetch routes from API
  const fetchRoutes = async () => {
    try {
      const response =  await API.V1.Schedules.GetRoutes({}).data;
      console.warn(response)
      setRoutes(response); // Assuming the API returns a list of routes
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch routes.');
      console.error(error);
    }
  };

  // Call the API when the component mounts
  useEffect(() => {
    fetchLiveSchedule();
    fetchRoutes();
  }, []);

  const renderDeparture = ({ item }) => (
    <View style={styles.departure}>
      <Text style={styles.departureTime}>{item.time || item.departureTime}</Text>
      <Text>{item.route || item.routeName}</Text>
      <Text>{item.destination || item.stopName}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image source={BusImage} style={styles.centerImage} />
      <Text style={styles.title}>Next Departures</Text>

      <FlatList
        data={departures}
        renderItem={renderDeparture}
        keyExtractor={(item, index) => index.toString()}
      />

      <TouchableOpacity style={styles.filterButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="filter" size={30} color="white" />
      </TouchableOpacity>

      {/* Modal for filtering routes */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select Route</Text>
          {routes?.map((route, index) => (
            <TouchableOpacity
              key={index}
              style={styles.routeOption}
              onPress={() => {
                setSelectedRoute(route.routeId); // Handle route selection
                setModalVisible(false);
              }}
            >
              <Text style={styles.routeText}>{route.routeName}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* <TouchableOpacity style={styles.reserveButton}>
        <Text style={styles.reserveButtonText}>Subscribe to Route</Text>
      </TouchableOpacity> */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'white'
  },
  centerImage: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    alignSelf: 'center',
    marginBottom: 10,
  },
  departure: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  departureTime: {
    color: 'lightgreen',
    fontWeight: 'bold',
  },
  filterButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#173470',
    padding: 10,
    borderRadius: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    padding: 35,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  reserveButton: {
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  reserveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: 'gray',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
    fontSize: 16,
  },
});

export default App;
