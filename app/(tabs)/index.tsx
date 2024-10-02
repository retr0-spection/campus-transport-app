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
  useColorScheme,
} from "react-native";
import {
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from "react-native-google-places-autocomplete";
import {
  requestNotificationPermission,
  setupNotifications,
} from "../../firebaseservices/firebaseService";

import React, { useState, useRef, useCallback } from "react";
import MapViewDirections from "react-native-maps-directions";
import MapViewComponent from "@/components/navigation/MapComponent";
import Suggestions from "@/components/navigation/Suggestions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchComponent from "@/components/navigation/SearchComponent";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import NavModalComponent from "@/components/navigation/navModal";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
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

export interface CustomMarker {
  id: string;
  name: string;
  coordinate: LatLng;
  type: string;
}

export default function App() {
  /* useEffect(() => {
    const userId = 'user1';
    requestNotificationPermission(userId);
    setupNotifications();
  }, []); */

  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<CustomMarker | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const insets = useSafeAreaInsets();
  const [query, setQuery] = React.useState<String>("");
  const [expandSearch, setExpandSearch] = React.useState(true);
  const [markers, setMarkers] = useState<CustomMarker[]>([]);
  const [mode, setMode] = useState<String>("WALKING");
  const modalRef = useRef();
  const router = useRouter();
  const queryRef = useRef()
  const colorScheme = useColorScheme();

  const editText = useCallback((text) => {
    queryRef.current?.setNativeProps({text});
    setQuery(text)
  }, []);

  const mapref = useRef<MapView>(null);

  const moveTo = async (position: LatLng) => {
    const camera = await mapref.current?.getCamera();
    if (camera) {
      const _position = {...position, latitude:position.latitude - 5e-3}
      camera.center = _position;
      camera.altitude = 5000
      mapref.current?.animateCamera(camera);
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
      moveTo(destination.coordinate);
      mapref.current?.fitToCoordinates([origin, destination.coordinate], {
        edgePadding,
      });
    }
  };

  const apiUrl =
    "http://ec2-52-40-184-137.us-west-2.compute.amazonaws.com/api/v1/navigation/poi";

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const currentPosition = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setOrigin(currentPosition);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const _mockMarkers = data.map((item) => ({
        id: item.id,
        name: item.name,
        type: item.type,
        coordinate: {
          latitude: item.coordinates.latitude,
          longitude: item.coordinates.longitude,
        },
      }));

      setMarkers(_mockMarkers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onCloseCallBack = () => {
    setDestination(null);
    setShowDirections(false);
  };

  React.useEffect(() => {
    fetchData();
    getCurrentLocation();
  }, []);

  React.useEffect(() => {
    if (destination) {
      traceRoute();
      modalRef.current.show()
    }
  }, [destination]);


  const highlightLocation = (location:CustomMarker) => {
    setDestination(location)
  }

  const FilterMarkers = ({ query }) => {
    const _ = markers.filter((marker) => marker.name.toLowerCase().includes(query.toLowerCase()));

    return (
      <View style={{ borderRadius: 10, marginTop: 10, backgroundColor:Colors[colorScheme ?? 'light'].background }}>
        {_.map((item, index) => {
          return (
            <TouchableOpacity
            onPress={() => {
              queryRef.current?.blur()
              editText(item.name)
              setQuery(item.name)
              highlightLocation(item)
            }}
            activeOpacity={0.7}
              style={{
         
                borderTopLeftRadius: index == 0 ? 10 : 0,
                borderTopRightRadius: index == 0 ? 10 : 0,
                borderBottomLeftRadius: index == _.length - 1 ? 10 : 0,
                borderBottomRightRadius: index == _.length - 1 ? 10 : 0,
                width: "100%",
                padding: 10,
                paddingVertical:15,
                borderColor: "#bebebe",
              }}
            >
              <Text style={{color:Colors[colorScheme ?? 'light'].text}}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <MapViewComponent
        scrollEnabled={true}
        ref={mapref}
        origin={origin}
        destination={destination}
        showDirections={showDirections}
        markers={markers}
        modalRef={modalRef}
        mode={mode}
        setMode={setMode}
      />
      <View
        style={{
          position: "absolute",
          top: insets.top,
          left: 0,
          right: 0,
          paddingHorizontal: '5%',
          flexDirection: "row",
          justifyContent: "space-between",
          gap:20,
        }}
      >
        <View style={{flexGrow:0, alignSelf:'flex-start',flexShrink:0, borderRadius: 10,backgroundColor: Colors[colorScheme ?? 'light'].background, padding: 5  }}>
          <Ionicons
            name="notifications-outline"
            size={27}
            onPress={() => router.push("/notifications")}
            color={Colors[colorScheme ?? 'light'].text}
          />
        </View>
        <View>
          <TextInput
            ref={queryRef}
            placeholder="Search places on campus"
            placeholderTextColor={'gray'}
            onChangeText={editText}
            onFocus={() => setExpandSearch(true)}
            onBlur={() => setExpandSearch(false)}
            autoCorrect={false}
            autoComplete="off"
            style={{
              backgroundColor:Colors[colorScheme ?? 'light'].background,
              color:Colors[colorScheme ?? 'light'].text,
              width: Dimensions.get("window").width * 0.75,
              padding: 10,
              borderRadius: 10,
            }}
          />
          {query.length && expandSearch ? <FilterMarkers query={query} /> : null}
        </View>
      </View>
      <Suggestions
        markers={markers}
        modalRef={modalRef}
        highlightLocation={highlightLocation}
        editText={editText}
        queryRef={queryRef}
        origin={origin}
      />
      <NavModalComponent
        ref={modalRef}
        onCloseCallBack={onCloseCallBack}
        destination={destination}
        origin={origin}
        setMode={setMode}
      />
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
