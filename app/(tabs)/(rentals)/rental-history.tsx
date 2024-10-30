//All the rentals that a user has had
// Date and time, vehicle pick up rental station & vehicle drop off rental station
import React, { useRef } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, useColorScheme, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScooterImage from '../../../assets/images/scooter.png';
import SkateboardImage from '../../../assets/images/skateboard.png';
import BicycleImage from '../../../assets/images/bicycle.png';
import API from '@/api';
import { useSelector } from 'react-redux';
import { selectProfile } from '@/redux/slices/userSlice';
import { Colors } from '@/constants/Colors';
import { styles as style } from '@/styles';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import ActionSheet from 'react-native-actions-sheet';
import QRCode from 'react-native-qrcode-svg';

interface RentalHistoryItem {
  name: string;
  image: any;
  date: string;
  price: string;
}


const RentalHistoryScreen: React.FC = () => {
  const profile = useSelector(selectProfile)
  const [rentalHistory, setRentalHistory] = React.useState([])
  const [highlighted, setHighlighted] = React.useState(null)
  const colorScheme = useColorScheme()
  const qrCodeModalRef = useRef()

  const imageToRender = (type:string) => {
    if (type == 'Scooter'){
      return ScooterImage
    } else if (type == 'Bicycle'){
      return BicycleImage
    }else if (type == 'Skateboard'){
      return SkateboardImage
    }
  }


  const getHistory = async () => {
    const config = {
      headers: {
        Authorization:'Bearer ' + profile.token
      }
    }

    const history = await API.V1.Rental.GetRentalHistory(config)
    setRentalHistory(history)
  }

  React.useEffect(() => {
    getHistory()
  },[])
  


  return (
    <SafeAreaView style={[styles.container, {backgroundColor: Colors[colorScheme ?? 'light'].background}]}>
      <View style={{flexDirection:'row', width:'100%', alignItems:'center'}}>
        <TouchableOpacity onPress={router.back}>
                <Ionicons name="arrow-back" color={Colors[colorScheme].text} size={26}/>
        </TouchableOpacity>
        <Text style={[styles.title,{color:Colors[colorScheme].text}]}>Rental History</Text>
      </View>
      {rentalHistory?.length ?<ScrollView>
        {rentalHistory.map((item, index) => {
          const image = imageToRender(item.vehicle?.type)
          const _date = new Date(item.rentTimestamp)
          const date = new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(_date)
          return <>
          {item?.vehicle ?
        <View key={index} style={styles.historyItem}>
            <Image source={image} style={styles.image} />
            <View style={styles.itemInfo}>
              <Text style={[styles.itemName, {color:Colors[colorScheme ?? 'light'].text}]}>{item.vehicle?.name}</Text>
              <Text style={[styles.itemPickup]}>{item.pickupPoint}</Text>
              <Text style={[styles.dateText,{color:Colors[colorScheme ?? 'light'].text}]}>{date}</Text>
              <Text style={[styles.priceText, {color:Colors[colorScheme ?? 'light'].text}]}>R {item.amount}</Text>
            </View>
            <TouchableOpacity style={{backgroundColor:'gray', padding:5, borderRadius:2.5}} onPress={() => {
              setHighlighted(item)
              qrCodeModalRef.current.show()
            }}>
              <AntDesign name='qrcode' color='white' size={25} />
            </TouchableOpacity>
          </View> : null}
       
       
          </> 
}
        )}
      </ScrollView> : <View style={{height:'100%', width:'100%', justifyContent:'center', alignItems:'center'}}><Text style={{color:Colors[colorScheme].text, fontSize:20,}}>No past rentals</Text></View>}
      <ActionSheet
        ref={qrCodeModalRef}
        containerStyle={{ height: "60%", backgroundColor: "#1a237e" }}
      >
        <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 20,
              color: "white",
              fontWeight: "bold",
              marginVertical: 20,
              paddingHorizontal: 20,
            }}
          >
            Show this QR Code to scanner to unlock a {highlighted?.vehicle?.type}
          </Text>
          <QRCode
            value={highlighted?._id}
            size={Dimensions.get("window").width * 0.8}
          />
        </View>
      </ActionSheet>
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
    paddingHorizontal:20,
    color:'white'
  },
  historyItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems:'center'
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
  itemPickup: {
    fontSize: 14,
    fontWeight: 'bold',
    color:'gray'
  },
  dateText: {
    fontSize: 14,
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
