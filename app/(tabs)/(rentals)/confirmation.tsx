import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Bicycle from '../../../assets/images/bicycle.png'
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import  { Paystack }  from 'react-native-paystack-webview';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ActionSheet from 'react-native-actions-sheet';
import { useSelector } from 'react-redux';
import { selectProfile } from '@/redux/slices/userSlice';

const BicycleRentalScreen = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const router = useRouter();
  const navigation = useNavigation();
  const ref = React.useRef()
  const modalRef = React.useRef()
  const profile = useSelector(selectProfile)
  const [vehicle, setVehicle ] = useState({
    name: 'Bicycle',
    image: Bicycle,
    available: true,
    units: 25,
    route: '/(rentals)/confirmation',
    price:10
  })
  const [rentalStations, setRentalStations] = React.useState(['Sturrock Park', 'Matrix'])
  const [selectedRentalStation, setSelectedRentalStation] = React.useState({id:0, name:'Sturrock Park'})

  const pay = () => {
    ref.current.startTransaction()
  }

  const goBack = () => {
    router.back()
  }

  React.useEffect(() => {
    modalRef.current.show()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{vehicle.name}</Text>
      </View>
      <Image
        source={Bicycle}
        style={styles.bicycleImage}
        resizeMode="contain"
      />
      <ActionSheet
      ref={modalRef}
      containerStyle={{height:'35%', backgroundColor:'#1a237e'}}
      backgroundInteractionEnabled={true}
      
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.locationContainer}>
              <Text style={styles.locationIcon}>📍</Text>
              <Text style={styles.locationText}>{selectedRentalStation.name}</Text>
            </View>
            <View style={styles.availabilityContainer}>
              <Text style={styles.availabilityLabel}>Availability:</Text>
              <Text style={styles.availabilityValue}>{vehicle.units} units available</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Rental Price:</Text>
              <Text style={styles.priceValue}>R10</Text>
            </View>
            <TouchableOpacity style={styles.rentButton} onPress={pay}>
              <Text style={styles.rentButtonText}>Rent</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ActionSheet>
      <Paystack
        ref={ref}
        buttonText="Pay Now"
        paystackKey="pk_test_4cc7003e0c4e33e880efd904f53bb4963cca5441"
        paystackSecretKey="sk_test_bde5e1521517f82b9818495d5c4837d730c75483"
        amount={vehicle.price}
        currency='zar'
        billingEmail={profile.email || 'ratinailana@icloud.com'}
        activityIndicatorColor="#093574"
        onCancel={(e) => {
          // handle response here
        }}
        onSuccess={(res) => {
          // handle response here
        }}
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
    justifyContent: 'flex-end',
    height:'100%'
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
    // justifyContent: 'space-between',
    gap:10,
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