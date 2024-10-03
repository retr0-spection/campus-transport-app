import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScooterImage from '../../../assets/images/scooter.png'
import Skateboard from '../../../assets/images/skateboard.png'
import Bicycle from '../../../assets/images/bicycle.png'
import { useNavigation, useRouter } from 'expo-router';


interface RentalItem {
  name: string;
  image: any; // You would use a proper type for images in a real app
  available: boolean;
  units: number;
  route: string;
}

const rentalItems: RentalItem[] = [
  {
    name: 'Electric Scooter',
    image: ScooterImage,
    available: true,
    units: 10,
    route: '/(rentals)/scooter-rental',

  },
  {
    name: 'Electric Skateboard',
    image: Skateboard,
    available: true,
    units: 3,
    route: '/(rentals)/skateboard-rental',
  },
  {
    name: 'Bicycle',
    image: Bicycle,
    available: true,
    units: 25,
    route: '/(rentals)/confirmation',
  },
];

const RentalScreen: React.FC = () => {
  const router = useRouter();

  

    const navigate = (route: string) => {
      router.push(route);
    }
    // const navigateToHistory = () => {
    //   navigate('/(rentals)/rental-history'); // Navigate to RentalHistory screen
    // };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Rentals</Text>
        {rentalItems.map((item, index) => (
          <View key={index} style={styles.rentalItem}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={[styles.availabilityText, item.available ? styles.available : styles.unavailable]}>
                {item.available ? 'Available' : 'Unavailable'}
              </Text>
              <Text style={styles.unitsText}>{item.units} units available</Text>
              <TouchableOpacity style={styles.rentButton} onPress={() =>navigate(item.route)}>
                <Text style={styles.rentButtonText}>Rent</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        ))}
        {/* Button to navigate to rental history
      <TouchableOpacity style={styles.historyButton} onPress={navigateToHistory}>
        <Text style={styles.historyButtonText}>View Rental History</Text>
      </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
  },
  rentalItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 16,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  availabilityText: {
    fontSize: 14,
    marginTop: 4,
  },
  available: {
    color: 'green',
  },
  unavailable: {
    color: 'red',
  },
  unitsText: {
    fontSize: 14,
    marginTop: 4,
  },
  rentButton: {
    backgroundColor: '#1a237e',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  rentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 8,
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  activeNavItem: {
    borderTopWidth: 2,
    borderTopColor: '#1a237e',
  },
  activeNavText: {
    color: '#1a237e',
  },
  // historyButton: {
  //   backgroundColor: '#ffa000',
  //   padding: 12,
  //   borderRadius: 8,
  //   alignItems: 'center',
  //   marginTop: 16,
  //   width: '100%',
  // },
  // historyButtonText: {
  //   color: 'white',
  //   fontSize: 16,
  //   fontWeight: 'bold',
  // },
});

export default RentalScreen;