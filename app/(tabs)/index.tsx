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
} from "react-native";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import { useState, useRef, useEffect } from "react";
import MapViewDirections from "react-native-maps-directions";
import MapViewComponent from "@/components/navigation/MapComponent";
import Suggestions from "@/components/navigation/Suggestions";


import { requestNotificationPermission, setupNotifications } from '../../firebaseservices/firebaseService';

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

  return (
    <View style={styles.container}>
     <MapViewComponent scrollEnabled={true} />

     
      <Suggestions />
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
