import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScooterImage from '../../../assets/images/scooter.png'
import Skateboard from '../../../assets/images/skateboard.png'
import Bicycle from '../../../assets/images/bicycle.png'
import { useNavigation, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import API, { RentalItem } from '@/api';
import { useSelector } from 'react-redux';
import { selectProfile } from '@/redux/slices/userSlice';
import { Feather } from '@expo/vector-icons';




const RentalScreen: React.FC = () => {
  const router = useRouter();
  const colorScheme = useColorScheme()
  const profile = useSelector(selectProfile)

  const [vehicles, setVehicles] = React.useState<RentalItem[]>([])



    const imageToRender = (type:string) => {
      if (type == 'Scooter'){
        return ScooterImage
      } else if (type == 'Bicycle'){
        return Bicycle
      }else if ('Skateboard'){
        return Skateboard
      }
    }

    const getVehicles = async () => {
      const config = {
        headers: {
          Authorization:'Bearer ' + profile.token
        }
      }
      const res = await API.V1.Rental.GetVehicles(config)
      console.warn(res)
      setVehicles(res)

    }

    React.useEffect(() => {
      getVehicles()
    },[])


  return (
    <SafeAreaView style={[styles.container, {backgroundColor: Colors[colorScheme ?? 'light'].background}]}>
      <ScrollView>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingRight:20}}>
          <Text style={[styles.title, {color:Colors[colorScheme ?? 'light'].text}]}>Rentals</Text>
          <TouchableOpacity activeOpacity={.7} onPress={() => null}>
          <Feather name="more-horizontal" color={Colors[colorScheme ?? 'light'].text} size={20} />

          </TouchableOpacity>
        </View>
        {vehicles.map((item, index) => {
          const image = imageToRender(item.name)
          return (
          <View key={index} style={styles.rentalItem}>
            <Image source={image} style={styles.image} />
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, {color:Colors[colorScheme ?? 'light'].text}]}>{item.name}</Text>
              <Text style={[styles.itemName, {color:Colors[colorScheme ?? 'light'].text, fontSize:16}]}>R{item.price}</Text>
              <TouchableOpacity style={styles.rentButton} onPress={() => router.push(`/confirmation/${item.name}`)}>
                <Text style={styles.rentButtonText}>Rent</Text>
              </TouchableOpacity>
            </View>
          </View>
        )})}
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
    justifyContent:'space-between'
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