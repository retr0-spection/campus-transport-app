import React, { useRef, useState, useEffect } from "react";
import { Dimensions, Linking, Platform, StyleSheet, Text } from "react-native";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import MapView, {
  LatLng,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import CustomMarker from "./CustomMarker";

const MapViewComponent = React.forwardRef((props, ref) => {
  const {origin, destination, showDirections, mode, setMode, zoom} = props
  const markers = props.markers || [];

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


  const openNativeMapsApp = (origin, destination) => {
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
      ref={ref}
      style={{ width: "100%", height: "100%", ...props.style }}
      provider={Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
      initialRegion={INITIAL_POSITION}
      showsUserLocation
      scrollEnabled={props.scrollEnabled}
      showsBuildings={true}
      showsIndoors={true}
      showsIndoorLevelPicker={true}
      
    >
      {/* {origin && <Marker coordinate={origin} />} */}
      {destination && <CustomMarker
        id={destination.id}
        name={destination.name}
        openNativeMapsApp={openNativeMapsApp}
        coordinate={destination.coordinate}
        origin={origin}
        type={destination.type}
      />}
      {showDirections && origin && destination && (
        <MapViewDirections
          origin={origin}
          destination={destination.coordinate}
          apikey="AIzaSyBepa0FXkdVrf36i_0cgj1C4oJV-uf7qrs"
          strokeColor="#6644ff"
          strokeWidth={4}
          optimizeWaypoints={true}
          mode={mode}
          onError={() => setMode("WALKING")}
        />
        
      )}

      {/* {markers.map((marker) => {

        return  <>
        {!destination ? <CustomMarker
        id={marker.id}
        name={marker.name}
        openNativeMapsApp={openNativeMapsApp}
        coordinate={marker.coordinate}
        origin={INITIAL_POSITION}
        type={marker.type}
      /> :null}
        </>
      }
      )} */}
    </MapView>
  );
});

export default React.memo(MapViewComponent);

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
