import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios"; // Make sure to install this package
import BusImage from "../../../assets/images/bus.png";
import API from "@/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Feather } from '@expo/vector-icons';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [departures, setDepartures] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const colorScheme = useColorScheme();

  // Fetch departures (live schedule) from API
  const fetchLiveSchedule = async () => {
    try {
      const response = await API.V1.Schedules.GetSchedules({});
      setDepartures(response); // Assuming the API returns a list of departures
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch routes from API
  const fetchRoutes = async () => {
    try {
      const response = await API.V1.Schedules.GetRoutes({});
      setRoutes(response);
    } catch (error) {
      console.error(error);
    }
  };

  // Call the API when the component mounts
  useEffect(() => {
    fetchLiveSchedule();
    fetchRoutes();
  }, []);

  const renderDeparture = ({ item }) => (
    <View style={styles.departure}>
      <Text style={{color: colorScheme == 'dark' ?'gold': styles.departureTime.color}}>
        {item.time || item.departureTime}
      </Text>
      <Text style={[{fontSize:18, fontWeight:'bold'}, { color: Colors[colorScheme ?? "light"].text }]}>{item.route || item.routeName}</Text>
      <Text style={[{fontWeight:'medium', fontSize:16}, { color: Colors[colorScheme ?? "light"].text }]}>{item.destination || item.stopName}</Text>
    </View>
  );

  return (
    <SafeAreaView
      style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
    >
     
        <ScrollView style={{paddingHorizontal:'5%'}}>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingRight:20}}>
        <Text
          style={[styles.title, { color: Colors[colorScheme ?? "light"].text }]}
        >
          Bus schedule
        </Text>
        <TouchableOpacity activeOpacity={.7} onPress={() => null}>
          <Feather name="more-horizontal" color={Colors[colorScheme ?? 'light'].text} size={20} />

          </TouchableOpacity>
          </View>
          {departures?.map((item) => renderDeparture({ item }))}
        </ScrollView>
     
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

export default App;
