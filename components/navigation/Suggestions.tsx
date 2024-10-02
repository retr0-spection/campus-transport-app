import { Dimensions, ScrollView, Text, View } from "react-native";
import MapViewComponent from "./MapComponent";
import { CustomMarker } from "@/app/(tabs)/index.tsx";
import { LatLng } from "react-native-maps";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
import MapComponent from "./MapComponent";
import axios from "axios";

const googleMapsApiKey = "AIzaSyBepa0FXkdVrf36i_0cgj1C4oJV-uf7qrs";
const googlePlacesApiKey = "AIzaSyBepa0FXkdVrf36i_0cgj1C4oJV-uf7qrs";

interface CustomMarker {
  id: string;
  name: string;
  coordinate: LatLng;
  type: string;
}

interface Props {
  markers: CustomMarker[];
  modalRef: any;
}

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

  return {
    distance: distance.text,
    destinationInfo,
  };
};

const SuggestionComponent = ({marker, editText, queryRef, modalRef, highlightLocation, origin}) => {
  const mapRef = useRef();
  const { distance:_distance, destinationInfo:_destinationInfo } = getDistanceAndDestinationInfo(marker);
  const [distance, setDistance] = useState("")
  const [destinationInfo, setDestinationInfo] = useState(null)


const _load = async () => {
  const { distance:_distance, destinationInfo:_destinationInfo } = await getDistanceAndDestinationInfo(origin, marker);
  setDestinationInfo(_destinationInfo)
  setDistance(_distance)
}

  useEffect(() => {
    _load()
  },[])

  return (
    <TouchableOpacity
      onPress={() => {
        editText("");
        queryRef.current.blur();
        highlightLocation(marker);
        modalRef.current.show();
      }}
      style={{
        flexDirection: "row",
        backgroundColor: "white",
        width: Dimensions.get("screen").width * 0.9,
        justifyContent: "space-between",
        padding: 20,
        borderRadius: 20,
        marginHorizontal:Dimensions.get("screen").width * 0.05,
        gap:15
      }}
    >
      <View style={{ height: "100%", justifyContent: "space-between", width:'40%' }}>
        <View>
          <Text ellipsizeMode="tail" numberOfLines={2} style={{ fontSize: 20, fontWeight: "bold", overflow:'hidden' }}>
            {marker.name}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "gray" }}>
            {destinationInfo?.vicinity}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text>{distance}</Text>
        </View>
      </View>
      <View style={{width:'60%'}}>
        <MapComponent
          ref={mapRef}
          scrollEnabled={false}
          zoom={3000}
          pindrop
          destination={marker}
          style={{ width: 200, height: 100, borderRadius: 10 }}
        />
      </View>
    </TouchableOpacity>
  );
};

const Suggestions = ({
  markers,
  modalRef,
  highlightLocation,
  editText,
  queryRef,
  origin,
}: Props) => {
 

  

  return (
    <View style={{ position: "absolute", bottom: 10, left: 0, right: 0 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={Dimensions.get("screen").width}
        decelerationRate={"fast"}
      >
        {markers?.map((marker) => <SuggestionComponent queryRef={queryRef} modalRef={modalRef} origin={origin} highlightLocation={highlightLocation} editText={editText} marker={marker} />)}
      </ScrollView>
    </View>
  );
};

export default Suggestions;
