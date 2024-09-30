import { useRef, useState, useEffect } from "react";
import { Dimensions, Linking, Platform, StyleSheet } from "react-native";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import MapView, {
  LatLng,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from 'expo-location';


const MapViewComponent = (props) => {

  const [origin, setOrigin] = useState<LatLng | null>(null);
  const [destination, setDestination] = useState<LatLng | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [markers, setMarkers] = useState<CustomMarker[]>([]);

  

  const { width, height } = Dimensions.get("window");

  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.02;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const mapref = useRef<MapView>(null);

  const moveTo = async (position: LatLng) => {
    const camera = await mapref.current?.getCamera();
    if (camera) {
      camera.center = position;
      mapref.current?.animateCamera(camera, { duration: 1000 });
    }
  };

  const INITIAL_POSITION = {
    latitude: -26.191632311834038,
    longitude: 28.030281354690963,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const edgePaddingValue = 10;
  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  type CustomMarker = {
    id: string;
    name: string;
    coordinate: LatLng;
  };
  
  let mockMarkers: CustomMarker[] = []
  
  const apiUrl = 'http://ec2-52-40-184-137.us-west-2.compute.amazonaws.com/api/v1/navigation/poi'; 
 

    useEffect(() => {

      const fetchData = async () => {
        try {
          const response = await fetch(apiUrl);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log(data)
          mockMarkers = data.map(item => ({
              id: item.id,
              name: item.name,
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
        setOrigin(currentPosition);
        moveTo(currentPosition);
      };


  
      fetchData();
      getCurrentLocation(); 
    }, []); 


  const traceRoute = () => {
    if (origin && destination) {
      setShowDirections(true);
      mapref.current?.fitToCoordinates([origin, destination], { edgePadding });
    }
  };

  const onPlaceSelected = (
    details: GooglePlaceDetail | null,
    flag: "origin" | "destination"
  ) => {
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

      Linking.openURL(url as string).catch((err) =>
        console.error("An error occurred", err)
      );
    }
  };

  return (

    <MapView
      ref={mapref}
      style={{ width: "100%", height: "100%", ...props.style  }}
      provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      initialRegion={INITIAL_POSITION}
      showsUserLocation
      scrollEnabled={props.scrollEnabled}
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
        />
      )}

   {  markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
            >
            </Marker>
          ))  }
    </MapView>
  );
};

export default MapViewComponent

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
  