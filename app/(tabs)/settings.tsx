import { Colors } from "@/constants/Colors";
import { setAuthenticated, setProfile } from "@/redux/slices/userSlice";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const Settings = () => {
  const colorScheme = useColorScheme();
  const ref = useRef();
  const [dispatched, setDispatched] = React.useState(false)
  const dispatch = useDispatch()
  const router = useRouter()


  return (
    <SafeAreaView style={{ backgroundColor: Colors[colorScheme].background }}>
      <View style={{ height: "100%" }}>
        <Text
          style={[styles.title, { color: Colors[colorScheme ?? "light"].text }]}
        >
          Settings
        </Text>
        <ScrollView style={{ paddingHorizontal: "5%" }}>
          <TouchableOpacity
            style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            activeOpacity={0.7}
            onPress={() => ref.current.show()}
          >
            <MaterialCommunityIcons
              name="car-emergency"
              size={20}
              color={"red"}
            />
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "red" }}>
              Panic Button
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flexDirection: "row", gap: 10, alignItems: "center" , marginVertical:10}}
            activeOpacity={0.7}
            onPress={() => {
                dispatch(setAuthenticated(null))
                dispatch(setProfile(null))
                router.replace('/(auth)/login')
            }}
          >
            <Ionicons
              name="exit-outline"
              size={24}
              color={ Colors[colorScheme ?? 'light'].text}
            />
            <Text style={{ fontWeight: "bold", fontSize: 18, color: Colors[colorScheme ?? 'light'].text }}>
              Log out
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <ActionSheet ref={ref} onClose={() => setDispatched(false)}>
        <View
          style={{
            height: "70%",
            alignItems: "center",
            paddingVertical: "20%",
          }}
        >
       {!dispatched ? <View style={{ alignItems: "center",}}>
          <MaterialCommunityIcons
            name="car-emergency"
            size={60}
            color={"red"}
          />
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 18,
              color: "black",
              paddingVertical: "5%",
              paddingHorizontal: "3%",
            }}
          >
            Are you sure you want to dispatch Campus Security to your location?
          </Text>
          <TouchableOpacity
            style={{  gap: 10, alignItems: "center", backgroundColor:'red', width:'100%', paddingHorizontal:'30%',paddingVertical:'2%', borderRadius:5 }}
            activeOpacity={0.7}
            onPress={() =>setDispatched(true)}
          >
      
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{  gap: 10, alignItems: "center",marginVertical:20, width:'100%', paddingHorizontal:'20%',paddingVertical:'2%', borderRadius:5, borderColor:'black', borderWidth:3 }}
            activeOpacity={0.7}
            onPress={() => ref.current.hide()}
          >
      
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "black" }}>
              Nevermind
            </Text>
          </TouchableOpacity>
          </View> : <View style={{paddingHorizontal:'5%', alignItems:'center'}}>
          <MaterialCommunityIcons
            name="car-emergency"
            size={60}
            color={"red"}
          />
                <Text style={{fontSize:18, fontWeight:'bold', textAlign:'center', marginVertical:10}}>Campus Security has been dispatched to your location!</Text>
            </View>}
        </View>
      </ActionSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: "100%",
  },
  centerImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 16,
  },
  departure: {
    marginVertical: 10,
  },
  departureTime: {
    color: "#093574",
    fontWeight: "bold",
  },
  filterButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#173470",
    padding: 10,
    borderRadius: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    margin: 20,
    padding: 35,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  reserveButton: {
    backgroundColor: "orange",
    padding: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  reserveButtonText: {
    color: "white",
    fontSize: 16,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderColor: "gray",
    paddingVertical: 10,
  },
  navItem: {
    alignItems: "center",
    fontSize: 16,
  },
});

export default Settings;
