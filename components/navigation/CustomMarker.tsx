import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Marker } from "react-native-maps";

const Icon = ({type}) => {



  return (
    <View>
      {type == "Restaurant" ? <MaterialIcons name="restaurant" size={16} /> : null}
      {type == "Lecture" ? <MaterialIcons name="school" size={16} /> : null}
      {type == "Station" ? <FontAwesome5 name="charging-station" size={16} /> : null}
    </View>
  );
};

const CustomMarker = ({ id, coordinate, origin, type, name, showModal, marker }) => {
  return (
    <Marker key={id} coordinate={coordinate} onPress={() => showModal(marker)}>
      <View style={{padding:5, justifyContent:'center', alignItems:'center', flexDirection:'row', backgroundColor:'white', borderRadius:10, paddingHorizontal:10}}>
        <Icon type={type} />
        <Text style={{paddingHorizontal:10, fontSize:12}}>{name}</Text>
      </View>
    </Marker>
  );
};

export default CustomMarker;
