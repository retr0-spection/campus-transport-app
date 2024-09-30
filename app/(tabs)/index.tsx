import MapView, { LatLng, Marker, PROVIDER_DEFAULT, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { Dimensions, StyleSheet, TouchableOpacity, View, Text, Platform, Linking } from 'react-native';
import { GooglePlaceDetail, GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { useState, useRef, useEffect } from 'react';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';

type CustomMarker = {
  id: string;
  name: string;
  coordinate: LatLng;
};

const mockMarkers: CustomMarker[] = [
  { id: '1', name: 'Station A', coordinate: { latitude: -26.191596389368428, longitude: 28.030743249532968 } },
  { id: '2', name: 'Station B', coordinate: { latitude: -26.190380729086375, longitude: 28.02668363291219} },
  { id: '3', name: 'Station C', coordinate: { latitude: -26.188031636154673, longitude: 28.0320882840975} },
];


const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const INITIAL_POSITION = { 
  latitude: -26.191632311834038,
  longitude: 28.030281354690963,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA 
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
          key: 'AIzaSyBepa0FXkdVrf36i_0cgj1C4oJV-uf7qrs',
          language: 'en',
        }}
      />
    </>
  );
}

export default function App() {

  const [origin, setOrigin] = useState<LatLng | null>(null); // set the origin to always be the cuurent location.
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [initialPosition, setInitialPosition] = useState<LatLng | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [markers, setMarkers] = useState<CustomMarker[]>([]);

  const mapref = useRef<MapView>(null);

  

  const setMarkerAsDestination = (marker: CustomMarker) => {
    console.log("Setting destination to:", marker); 
    setDestination(marker.coordinate);
    moveTo(marker.coordinate);
  };

  useEffect(() => {
    setMarkers(mockMarkers);
    getCurrentLocation();
  }, []);

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
    setOrigin(currentPosition);
    moveTo(currentPosition);
  };

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

  // change to be the walking route as well as add accessebility
  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      mapref.current?.fitToCoordinates([origin, destination], { edgePadding });
    }
  };

  const onPlaceSelected = (details: GooglePlaceDetail | null, flag: "origin" | "destination") => {
    const set = flag === "destination" ? setDestination : setOrigin;

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
        android: `google.navigation:q=${destinationStr}&mode=w`,
      });

      Linking.openURL(url as string)
        .catch((err) => console.error('An error occurred', err));
    }
  };

  return (
    <View style={styles.container}>

      <MapView 
        ref={mapref} 
        style={styles.map} 
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        initialRegion={INITIAL_POSITION} 
        showsUserLocation
      >
        {origin && <Marker coordinate={origin} />}
        {destination && <Marker coordinate={destination} />}
        {showDirections && origin && destination && (
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey="AIzaSyBepa0FXkdVrf36i_0cgj1C4oJV-uf7qrs"
            strokeColor="#6644ff"
            strokeWidth={4}
            mode="WALKING"
            precision="high"
            timePrecision="now"
            onReady={result => {
              console.log(`Walking Distance: ${result.distance} km`)
              console.log(`Walking Duration: ${result.duration} min.`)
            }}
          />
        )}

        {  markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              onPress = { ()=> setMarkerAsDestination(marker)}
            >
            </Marker>
          ))  }
      </MapView>

      <View style={styles.searchContainer}>
      {/* <InputAutocomplete 
          label="Origin (Current Location)" 
          onPlaceSelected={(details) => onPlaceSelected(details, "origin")}
          placeholder={origin ? `${origin.latitude}, ${origin.longitude}` : "Loading..."}
        /> */}

        <InputAutocomplete 
          label="Destination" 
          onPlaceSelected={(details) => onPlaceSelected(details, "destination")}
          placeholder={destination ? `${destination.latitude}, ${destination.longitude}` : " "}
        />

        <TouchableOpacity style={styles.button} onPress={traceRoute}>
          <Text style={styles.buttonText}>Trace Route</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={openNativeMapsApp}>
          <Text style={styles.buttonText}>Open in Maps App</Text>
        </TouchableOpacity>
      </View>

    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
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
    top: 20,
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
  calloutButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
});