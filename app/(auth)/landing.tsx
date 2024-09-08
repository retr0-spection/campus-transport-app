//import liraries
import React, { Component, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { Link, router } from "expo-router";
import { styles } from "../../styles";

import { setAuthenticated, setProfile } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";
import NavPana from "../../assets/images/Navigation-pana.png";
import ScooterAmico from "../../assets/images/Scooter-amico.png";
import CityBus from "../../assets/images/citybus.png";
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";

// create a component
const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

const LandingComponent = () => {
  const dispatch = useDispatch();
  const [idx, setIdx] = React.useState(0);

  const signIn = async () => {
    const res = await axios.get("http://localhost:3000/api/login");

    console.warn(res.data);
  };

  const onboadingInfo = [
    {
      title: "Need a Ride on Campus?",
      description:
        "Getting around just got easier. \n Discover convenient transportation options tailored for students.",
      image: NavPana,
      bgColor: "#173470",
      textColor: "white",
    },
    {
      title: "Find and Unlock Nearby Scooters",
      description:
        "Easily locate available scooters around campus and unlock them with just a tap.",
      image: ScooterAmico,
      bgColor: "white",
      textColor: "black",
    },
    {
      title: "Ride Safely and Stay on Time",
      description:
        "Whether on a scooter or a bus, we've got you covered. Enjoy reliable transportation every time.",
      image: CityBus,
      bgColor: "#173470",
      textColor: "white",
    },
  ];


  const next = () => {
    if (idx < 2){
      setIdx(idx + 1)
    }else{
      router.replace('/(auth)/login')
    }
  }



  
  return (
    <SafeAreaView style={{ backgroundColor: onboadingInfo[idx].bgColor }}>
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: onboadingInfo[idx].bgColor,
          paddingHorizontal: "3%",
          paddingTop: "15%",
        }}
      >
        <Text style={{ fontSize: 40, color:onboadingInfo[idx].textColor, fontWeight: "bold" }}>
          {onboadingInfo[idx].title}
        </Text>
        <View style={{ width: "80%", paddingVertical: "5%" }}>
          <Text style={{ fontSize: 18, color: onboadingInfo[idx].textColor }}>
            {onboadingInfo[idx].description}
          </Text>
        </View>
        <View>
          <Image
            source={onboadingInfo[idx].image}
            style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
            resizeMode="contain"
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            position: "absolute",
            bottom: 0,
            paddingHorizontal: "10%",
            right: 0,
            left: 0,
          }}
        >
          <TouchableOpacity onPress={signIn}>
            <Text style={{ color:onboadingInfo[idx].textColor, fontSize: 24 }}>skip</Text>
          </TouchableOpacity>
          <View
            style={{
              paddingVertical: 10,
              backgroundColor: "#3e3e3e",
              borderRadius: 20,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                backgroundColor: idx == 0 ? "white" : 'gray',
                width: 15,
                height: 15,
                borderRadius: 7.5,
                marginHorizontal: 10,
              }}
            />
            <View
              style={{
                backgroundColor: idx == 1 ? "white" : 'gray',
                width: 15,
                height: 15,
                borderRadius: 7.5,
                marginHorizontal: 10,
              }}
            />
            <View
              style={{
                backgroundColor: idx == 2 ? "white" : 'gray',
                width: 15,
                height: 15,
                borderRadius: 7.5,
                marginHorizontal: 10,
              }}
            />
          </View>
          <TouchableOpacity onPress={next}>
            <AntDesign name="right" color={onboadingInfo[idx].textColor} size={26} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// define your styles

//make this component available to the app
export default LandingComponent;
