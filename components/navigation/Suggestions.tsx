import { Dimensions, ScrollView, Text, View } from "react-native"
import MapViewComponent from "./MapComponent"
import { CustomMarker } from "@/app/(tabs)/index.tsx"
import { LatLng } from "react-native-maps";
import { TouchableOpacity } from "react-native-gesture-handler";



interface CustomMarker {
    id: string;
    name: string;
    coordinate: LatLng;
    type: string;
}

interface Props {
    markers: CustomMarker[];
    modalRef: any
}

const Suggestions = ({markers,  modalRef, setDestination}:Props) => {

    return <View style={{ position: "absolute", bottom: 10, left: 0, right: 0 }}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToAlignment="center" snapToInterval={Dimensions.get('window').width} decelerationRate={"fast"}>
      {markers?.map((marker) => (<TouchableOpacity
        onPress={() => {
          setDestination(marker)
          modalRef.current.show()
        }}
        style={{
          flexDirection: "row",
          backgroundColor: "white",
          width: Dimensions.get("window").width * 0.9,
          justifyContent: "space-between",
          padding:20,
          borderRadius:20,
          marginHorizontal:20
        }}
      >
        <View style={{height:'100%', justifyContent:'space-between'}}>
          <View>
            <Text style={{fontSize:20, fontWeight:'bold' }}>{marker.name}</Text>
            <Text style={{fontSize:16, fontWeight:'bold', color:'gray' }}>1.2 km</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text>10 units available</Text>
          </View>
        </View>
        <View>
         <MapViewComponent scrollEnabled={false} style={{width:100, height:100, borderRadius:10}} />
        </View>
      </TouchableOpacity>))}
    </ScrollView>
  </View>
}

export default Suggestions