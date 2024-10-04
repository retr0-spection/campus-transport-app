//All the rentals that a user has had
// Date and time, vehicle pick up rental station & vehicle drop off rental station
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScooterImage from '../../../assets/images/scooter.png';
import SkateboardImage from '../../../assets/images/skateboard.png';
import BicycleImage from '../../../assets/images/bicycle.png';

interface RentalHistoryItem {
  name: string;
  image: any;
  date: string;
  price: string;
}

const rentalHistory: RentalHistoryItem[] = [
  {
    name: 'Electric Scooter',
    image: ScooterImage,
    date: '2024-09-15',
    price: '49.9 Kudu bucks',
  },
  {
    name: 'Electric Skateboard',
    image: SkateboardImage,
    date: '2024-09-10',
    price: '39.9 Kudu bucks',
  },
  {
    name: 'Bicycle',
    image: BicycleImage,
    date: '2024-09-05',
    price: '29.9 Kudu bucks',
  },
];

const RentalHistoryScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Rental History</Text>
      <ScrollView>
        {rentalHistory.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.dateText}>Date: {item.date}</Text>
              <Text style={styles.priceText}>Price: {item.price}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.clearButton}>
        <Text style={styles.clearButtonText}>Clear History</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  historyItem: {
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
  dateText: {
    fontSize: 14,
    color: '#1a237e',
    marginTop: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffa000',
    marginTop: 4,
  },
  clearButton: {
    backgroundColor: '#1a237e',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RentalHistoryScreen;
