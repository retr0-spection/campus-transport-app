//View reserved vehicles and be able to start the rental.
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';


const rentalStations = [
  { id: 1, name: 'Sturrock Park Rental Station' },
  { id: 2, name: 'Bozolli Rental Station' },
  { id: 3, name: 'Library Lawns Rental Station' },
  { id: 4, name: 'Wits Science Stadium Station' },
  { id: 5, name: 'Hall 29 Station' },
];

const RentalStationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const router = useRouter();


  const navigateToHistory = () => {
    router.push('/(rentals)/rental-history'); // Navigate to RentalHistory screen
  };

  const confirmStation = () => {
    if (selectedStation !== null) {
      navigation.navigate('index', { stationId: selectedStation });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose a Rental Station</Text>
      <ScrollView>
        {rentalStations.map((station) => (
          <TouchableOpacity
            key={station.id}
            style={[
              styles.stationButton,
              selectedStation === station.id && styles.selectedStationButton,
            ]}
            onPress={() => setSelectedStation(station.id)}
          >
            <Text
              style={[
                styles.stationButtonText,
                selectedStation === station.id && styles.selectedStationButtonText,
              ]}
            >
              {station.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.confirmButton, selectedStation === null && styles.disabledButton]}
        onPress={confirmStation}
        disabled={selectedStation === null}
      >
        <Text style={styles.confirmButtonText}>Confirm Station</Text>
      </TouchableOpacity>
       {/* Button to navigate to rental history */}
       <TouchableOpacity style={styles.historyButton} onPress={navigateToHistory}>
        <Text style={styles.historyButtonText}>View Rental History</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  stationButton: {
    backgroundColor: '#1a237e',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedStationButton: {
    backgroundColor: '#ffa000',
  },
  stationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedStationButtonText: {
    color: '#1a237e',
  },
  confirmButton: {
    backgroundColor: '#ffa000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#d3d3d3',
  },
  historyButton: {
    backgroundColor: '#ffa000',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    width: '100%',
  },
  historyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RentalStationScreen;
