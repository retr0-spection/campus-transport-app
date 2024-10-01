import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Scooter from '../../../assets/images/scooter.png'
import { useRouter } from 'expo-router';

const ScooterRentalScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const router = useRouter();

  const goBack = () => {
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Electric Scooter</Text>
      </View>
      <Image
        source={Scooter}
        style={styles.scooterImage}
        resizeMode="contain"
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.locationContainer}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>Matrix Rental Station</Text>
            </View>
            <View style={styles.availabilityContainer}>
              <Text style={styles.availabilityLabel}>Availability:</Text>
              <Text style={styles.availabilityValue}>10 scooters are currently available</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Rental Price:</Text>
              <Text style={styles.priceValue}>39.9 Kudu bucks</Text>
            </View>
            <TouchableOpacity style={styles.rentButton} onPress={goBack}>
              <Text style={styles.rentButtonText}>Rent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    fontSize: 24,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scooterImage: {
    width: '100%',
    height: '50%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a237e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  locationText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  availabilityContainer: {
    marginBottom: 16,
  },
  availabilityLabel: {
    color: 'white',
    fontSize: 16,
  },
  availabilityValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  priceLabel: {
    color: 'white',
    fontSize: 16,
  },
  priceValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rentButton: {
    backgroundColor: '#ffa000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  rentButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ScooterRentalScreen;