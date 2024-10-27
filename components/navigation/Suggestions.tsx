import { Dimensions, Image, ScrollView, Text, useColorScheme, View } from "react-native";
import MapViewComponent from "./MapComponent";
import { CustomMarker } from "@/app/(tabs)/index.tsx";
import { LatLng } from "react-native-maps";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";
import MapComponent from "./MapComponent";
import axios from "axios";
import { Colors } from "@/constants/Colors";

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

  // Get the place ID of the destination
  const placeId = destinationInfo.place_id;

  // Use the place ID to get the details of the destination place
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,opening_hours,photos&key=${googlePlacesApiKey}`;
  const detailsResponse = await axios.get(detailsUrl);
  const destinationDetails = detailsResponse.data.result;

  // Get the photos of the destination place
  const photos = destinationDetails.photos;
  const photoUrls = photos.map((photo) => {
    return `https://maps.googleapis.com/maps/api/place/photo/v1/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${googlePlacesApiKey}`;
  });

  return {
    distance: distance.text,
    destinationInfo,
    destinationDetails,
    photoUrls,
  
  }
}

const SuggestionComponent = ({marker, editText, queryRef, modalRef, highlightLocation, origin}) => {
  const mapRef = useRef();
  const { distance:_distance, destinationInfo:_destinationInfo } = getDistanceAndDestinationInfo(marker);
  const [distance, setDistance] = useState("")
  const [destinationInfo, setDestinationInfo] = useState(null)
  const [photos, setPhotos] = useState<string[]>([])
  const colorScheme = useColorScheme();

const _load = async () => {
  const { distance:_distance, destinationInfo:_destinationInfo, photoUrls } = await getDistanceAndDestinationInfo(origin, marker);
  setDestinationInfo(_destinationInfo)
  setDistance(_distance)
  setPhotos(photoUrls)
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
        backgroundColor: Colors[colorScheme ?? 'light'].background ,
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
          <Text ellipsizeMode="tail" numberOfLines={2} style={{ color: Colors[colorScheme ?? 'light'].text,fontSize: 20, fontWeight: "bold", overflow:'hidden' }}>
            {marker.name}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: colorScheme == 'dark' ?Colors[colorScheme ?? 'light'].text: "gray" }}>
            {destinationInfo?.vicinity}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={{color:Colors[colorScheme ?? 'light'].text, fontWeight:'bold'}}>{distance}</Text>
        </View>
      </View>
      <View style={{width:'60%',height:'100%' }}>
        <MapComponent
          ref={mapRef}
          scrollEnabled={false}
          zoom={3000}
          pindrop
          destination={marker}
          style={{ width: '100%', height: 100, borderRadius: 10,alignSelf:'flex-end', marginRight:10 }}
        />
        {/* <Image source={photos[0]} style={{height:100, width:100}}  resizeMode="contain" /> */}
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
