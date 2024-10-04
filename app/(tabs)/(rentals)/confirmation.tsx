import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Bicycle from '../../../assets/images/bicycle.png'
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import  { Paystack }  from 'react-native-paystack-webview';

const BicycleRentalScreen = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();
  const ref = React.useRef()

  const pay = () => {
    ref.current.startTransaction()
  }

  const goBack = () => {
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Bicycle</Text>
      </View>
      <Image
        source={Bicycle}
        style={styles.bicycleImage}
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
              <Text style={styles.locationText}>Sturrock Park Rental Station</Text>
            </View>
            <View style={styles.availabilityContainer}>
              <Text style={styles.availabilityLabel}>Availability:</Text>
              <Text style={styles.availabilityValue}>10 bicycles are currently available</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Rental Price:</Text>
              <Text style={styles.priceValue}>49.9 Kudu bucks</Text>
            </View>
            <TouchableOpacity style={styles.rentButton} onPress={pay}>
              <Text style={styles.rentButtonText}>Rent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Paystack
        ref={ref}
        paystackKey="your-public-key-here"
        amount={'25000.00'}
        billingEmail="paystackwebview@something.com"
        activityIndicatorColor="green"
        onCancel={(e) => {
          // handle response here
        }}
        onSuccess={(res) => {
          // handle response here
        }}
        autoStart={true}
      />
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
  bicycleImage: {
    width: '100%',
    height: '50%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    height:'50%'
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

export default BicycleRentalScreen;