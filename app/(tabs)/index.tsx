import MapView, {
  LatLng,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
  Linking,
  ScrollView,
  TextInput,
} from "react-native";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { requestNotificationPermission, setupNotifications } from '../../firebaseservices/firebaseService';

import React, { useState, useRef } from "react";
import MapViewDirections from "react-native-maps-directions";
import MapViewComponent from "@/components/navigation/MapComponent";
import Suggestions from "@/components/navigation/Suggestions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchComponent from "@/components/navigation/SearchComponent";
import * as Location from 'expo-location';
import { Ionicons } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = {
  latitude: -26.191632311834038,
  longitude: 28.030281354690963,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};

type InputAutocompleteProps = {
  label: string;
  placeholder?: string;
  onPlaceSelected: (details: GooglePlaceDetail | null) => void;
};

function InputAutocomplete({
  label,
  placeholder,
  onPlaceSelected,
}: InputAutocompleteProps) {
  return (
    <>
      <Text>{label}</Text>
      <GooglePlacesAutocomplete
        styles={{ textInput: styles.input }}
        placeholder={placeholder || ""}
        fetchDetails
        onPress={(data, details = null) => {
          onPlaceSelected(details);
        }}
        query={{
          key: "AIzaSyBepa0FXkdVrf36i_0cgj1C4oJV-uf7qrs",
          language: "en",
        }}
      />
    </>
  );
}


export interface CustomMarker  {
  id: string;
  name: string;
  coordinate: LatLng;
  type: string;
};

export default function App() {

  /* useEffect(() => {
    const userId = 'user1';
    requestNotificationPermission(userId);
    setupNotifications();
  }, []); */

  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [showDirections, setShowDirections] = useState(false);

  const mapref = useRef<MapView>(null);

  const moveTo = async (position: LatLng) => {
    const camera = await mapref.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapref.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const edgePaddingValue = 10;
  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      mapref.current?.fitToCoordinates([origin, destination], { edgePadding });
    }
  };

  const onPlaceSelected = (details: GooglePlaceDetail | null, flag: "origin" | "destination") => {
    const set = flag === "origin" ? setOrigin : setDestination;
    const position = {
      latitude: details?.geometry.location.lat || 0,
      longitude: details?.geometry.location.lng || 0,
    };
    set(position);
    moveTo(position);
  };

  const openNativeMapsApp = () => {
    if (origin && destination) {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destinationStr = `${destination.latitude},${destination.longitude}`;

      const url = Platform.select({
        ios: `http://maps.apple.com/?saddr=${originStr}&daddr=${destinationStr}`,
        android: `google.navigation:q=${destinationStr}&mode=d`,
      });

      Linking.openURL(url as string)
        .catch((err) => console.error('An error occurred', err));
    }
  };
  const insets = useSafeAreaInsets()
  const [expandSearch, setExpandSearch] = React.useState(true)
  const [markers, setMarkers] = useState<CustomMarker[]>([]);

  
  
  let mockMarkers: CustomMarker[] = []
  
  const apiUrl = 'http://ec2-52-40-184-137.us-west-2.compute.amazonaws.com/api/v1/navigation/poi'; 
 

  React.useEffect(() => {

      const fetchData = async () => {
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          mockMarkers = data.map(item => ({
              id: item.id,
              name: item.name,
              type: item.type,
              coordinate: {
          latitude: item.coordinates.latitude,
          longitude: item.coordinates.longitude,
        },
      }));

        setMarkers(mockMarkers)
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }
    
        let location = await Location.getCurrentPositionAsync({});
        const currentPosition = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
      };


  
      fetchData();
      getCurrentLocation(); 
    }, []); 



  return (
    <View style={styles.container}>
     <MapViewComponent scrollEnabled={true} markers={markers} />
      <View style={{position:'absolute', top:insets.top,left:0, right:0,paddingHorizontal:30, flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
        <View style={{backgroundColor:'white', padding:5, borderRadius:13}}>
          <Ionicons name="notifications-outline" size={27} />
        </View>
        <TextInput placeholder="Search places" style={{backgroundColor:'white', width:Dimensions.get('window').width * 0.75, padding:10, borderRadius:10}}/>
      </View>
      <Suggestions markers={markers} />
      {/* <SearchComponent /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    padding: 8,
    top: 40,
    borderRadius: 20,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#bbb",
    paddingVertical: 8,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: "center",
  },
});
