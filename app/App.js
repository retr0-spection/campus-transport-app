import React , { useState }  from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install this package

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const departures = [
    { time: '10:00 AM', route: 'Route 1A', destination: 'Wits to Education Campus' },
    { time: '10:15 AM', route: 'Route 38', destination: 'Education Campus to Wits' },
    { time: '10:30 AM', route: 'Route 14', destination: 'Wits to Education Campus' },
    { time: '10:45 AM', route: 'Route 38', destination: 'Education Campus to Wits' },
    { time: '11:00 AM', route: 'Route 1A', destination: 'Wits to Education Campus' },
  ];

  const routes = ['Route 1A', 'Route 2B', 'Route 14', 'Route 38']; 

  const renderDeparture = ({ item }) => (
    <View style={styles.departure}>
      <Text style={styles.departureTime}>{item.time}</Text>
      <Text>{item.route}</Text>
      <Text>{item.destination}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <Image source={require('../src/images/bus.jpg')} style={styles.centerImage} />
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
          {routes.map((route, index) => (
            <TouchableOpacity
              key={index}
              style={styles.routeOption}
              onPress={() => {
                // Handle route filtering here
                setModalVisible(false);
              }}
            >
              <Text style={styles.routeText}>{route}</Text>
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
      <TouchableOpacity style={styles.reserveButton}>
        <Text style={styles.reserveButtonText}>Subscribe to Route</Text>
      </TouchableOpacity>
      <View style={styles.navBar}>
      <View style={styles.navItem}>
          <Ionicons name="home" size={30} color="gray" />
          <Text>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="bicycle" size={30} color="gray" />
          <Text>Rentals</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="calendar" size={30} color="gray" />
          <Text>Schedule</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    color: 'lightgreen', // Light green color for the departure time
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
