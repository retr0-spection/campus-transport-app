import {
  Linking,
  Platform,
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableOpacity,
  Button,
  useColorScheme,
  Dimensions,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import ActionSheet from "react-native-actions-sheet";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import TransportationModes from "./TransportationModes";
import MapComponent from "./MapComponent";
import { Colors } from "@/constants/Colors";

const googleMapsApiKey = "AIzaSyBepa0FXkdVrf36i_0cgj1C4oJV-uf7qrs";
const googlePlacesApiKey = "AIzaSyBepa0FXkdVrf36i_0cgj1C4oJV-uf7qrs";

const NavModalComponent = React.forwardRef((props, ref) => {
  const [distance, setDistance] = useState(null);
  const [destinationInfo, setDestinationInfo] = useState(null);
  const { origin, destination, onCloseCallBack, setMode } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const mapRef = useRef()
  const colorScheme = useColorScheme();

  const getDistanceAndDestinationInfo = async (origin, destination) => {
    const originCoords = `${origin.latitude},${origin.longitude}`;
    const destinationCoords = `${destination.coordinate.latitude},${destination.coordinate.longitude}`;

    // Calculate distance using Google Maps API
    const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords}&destinations=${destinationCoords}&mode=driving&units=metric&key=${googleMapsApiKey}`;
    const distanceResponse = await axios.get(distanceUrl);
    const distance = distanceResponse.data.rows[0].elements[0].distance;

    // Retrieve destination information using Google Places API
    const placeUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${destinationCoords}&radius=100&key=${googlePlacesApiKey}`;
    const placeResponse = await axios.get(placeUrl);
    const destinationInfo = placeResponse.data.results[0];

    setDistance(distance.text);
    setDestinationInfo(destinationInfo);
  };

  useEffect(() => {
    if (origin && destination) {
      getDistanceAndDestinationInfo(origin, destination);
    }
  }, [origin, destination]);

  useEffect(() => {
    if (activeIndex == 0) {
      setMode("WALKING");
    } else if (activeIndex == 1) {
      setMode("BICYCLING");
    } else if (activeIndex == 2) {
      setMode("DRIVING");
    } else {
      setMode("TRANSIT");
    }
  }, [activeIndex]);

  const openNativeMapsApp = () => {
    if (origin && destination) {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destinationStr = `${destination.coordinate.latitude},${destination.coordinate.longitude}`;

      let url;
      switch (activeIndex) {
        case 0:
          url = Platform.select({
            ios: `http://maps.apple.com/?saddr=${originStr}&daddr=${destinationStr}&t=m&dirflg=w&dname=${destination.name}`,
            android: `google.navigation:q=${destinationStr}&mode=w&destination=${destination.name}`,
          });
          break;
        case 1:
          url = Platform.select({
            ios: `http://maps.apple.com/?saddr=${originStr}&daddr=${destinationStr}&t=m&dirflg=b&dname=${destination.name}`,
            android: `google.navigation:q=${destinationStr}&mode=b&destination=${destination.name}`,
          });
          break;
        case 2:
          url = Platform.select({
            ios: `http://maps.apple.com/?saddr=${originStr}&daddr=${destinationStr}&t=m&dirflg=d&dname=${destination.name}`,
            android: `google.navigation:q=${destinationStr}&mode=d&destination=${destination.name}`,
          });
          break;
        case 3:
          url = Platform.select({
            ios: `http://maps.apple.com/?saddr=${originStr}&daddr=${destinationStr}&t=m&dirflg=r&dname=${destination.name}`,
            android: `google.navigation:q=${destinationStr}&mode=r&destination=${destination.name}`,
          });
          break;
        default:
          console.error("Invalid mode");
          return;
      }

      Linking.openURL(url as string).catch((err) =>
        console.error("An error occurred", err)
      );
    }
  };

  const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      width: "80%",
      padding: 20,
      backgroundColor: "white",
      borderRadius: 10,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    closeButton: {
      marginTop: 20,
      backgroundColor: "#007AFF",
      padding: 10,
      borderRadius: 5,
    },
    closeButtonText: {
      color: "white",
      textAlign: "center",
    },
  });

  return (
    <ActionSheet
      containerStyle={{ height: "60%", backgroundColor:Colors[colorScheme ?? 'light'].background }}
      ref={ref}
      onClose={onCloseCallBack}
    >
      <View
        style={{ padding: 20, justifyContent: "space-between", height: "100%" }}
      >
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 20, color:Colors[colorScheme ?? 'light'].text }}>
            {destination?.name}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "medium", color:Colors[colorScheme ?? 'light'].text }}>{distance}</Text>
          <Text style={{ fontWeight: "bold", color: "gray" }}>
            {destinationInfo?.vicinity}
          </Text>
          <TransportationModes
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
          />
          <View>
            <MapComponent 
            ref={mapRef}
              scrollEnabled={false}
              zoom={300}
              // markers={markers}
              origin={destination}
              // modalRef={modalRef}
              destination={destination}
              style={{ width: "100%", height: Dimensions.get('window').height * .20, borderRadius: 10 }}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={openNativeMapsApp}
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            paddingVertical: 20,
            backgroundColor: "#173470",
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </ActionSheet>
  );
});

export default NavModalComponent;
