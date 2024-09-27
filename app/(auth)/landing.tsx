import React, { useCallback } from "react";
import {
  View,
  Text,
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
import Animated, { Extrapolation, interpolate, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AnimatedScrollView } from "react-native-reanimated/lib/typescript/reanimated2/component/ScrollView";

// create a component
const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

const LandingComponent = () => {
  const dispatch = useDispatch();
  const idx  = useSharedValue(0)
  const offsetX = useSharedValue(0)
  const AnimatedSafeAreaView = Animated.createAnimatedComponent(SafeAreaView)
  const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign)
  const scrollViewRef = React.useRef<AnimatedScrollView>()

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      offsetX.value,
      [0, SCREEN_WIDTH, 2*SCREEN_WIDTH],
      ['#173470', 'white', '#173470']
    ),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      offsetX.value,
      [0, SCREEN_WIDTH, 2*SCREEN_WIDTH],
      ['white', 'black', 'white']
    ),
    
  }));





  const next = () => {
    scrollViewRef.current?.scrollTo({x:offsetX.value + SCREEN_WIDTH, animated:true})
    if (offsetX.value == 2*SCREEN_WIDTH){
      router.replace('/(auth)/login')
      return 
    }
  }

  const skip = () => {
    router.replace('/(auth)/login')

  }

  const handleScrollEvent = (e) => {
    const _ = e.nativeEvent.contentOffset.x
    if (_ == 0){
      idx.value == 0

    }
    if (_ == SCREEN_WIDTH){
      idx.value == 1

    }else if (_ == 2*SCREEN_WIDTH){
      idx.value == 2
    }

  }



  
  return (
    <AnimatedSafeAreaView style={animatedStyle}>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={[{
          height: "100%",
          paddingHorizontal: "3%",
          flexDirection:'row',
          paddingTop: "15%",
          
        }, animatedStyle]}
        showsHorizontalScrollIndicator={false}
        horizontal
        snapToOffsets={[0, SCREEN_WIDTH, 2*SCREEN_WIDTH]}
        decelerationRate={'fast'}
        onScroll={(e) => offsetX.value = e.nativeEvent.contentOffset.x}
        onMomentumScrollEnd={handleScrollEvent}
      >
        <View style={{width:SCREEN_WIDTH}}>
          <Text style={{ fontSize: 40, color:'white', fontWeight: "bold" }}>
            Need a Ride on Campus?
          </Text>
          <View style={{ width: "80%", paddingVertical: "5%" }}>
            <Text style={{ fontSize: 18, color: 'white' }}>
            Getting around just got easier. Discover convenient transportation options tailored for students.
            </Text>
          </View>
          <View>
            <Image
              source={NavPana}
              style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={{width:SCREEN_WIDTH}}>

          <Text style={{ fontSize: 40, color:'black', fontWeight: "bold" }}>
          Find and Unlock Nearby Scooters
          </Text>
          <View style={{ width: "80%", paddingVertical: "5%" }}>
            <Text style={{ fontSize: 18, color:'black' }}>
            Easily locate available scooters around campus and unlock them with just a tap.
            </Text>
          </View>
          <View>
            <Image
              source={ScooterAmico}
              style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
              resizeMode="contain"
            />
          </View>
        </View>
        <View style={{width:SCREEN_WIDTH}}>

          <Text style={{ fontSize: 40, color:'white', fontWeight: "bold" }}>
          Ride Safely and Stay on Time
          </Text>
          <View style={{ width: "80%", paddingVertical: "5%" }}>
            <Text style={{ fontSize: 18, color: 'white' }}>
            Whether on a scooter or a bus, we've got you covered. Enjoy reliable transportation every time.
            </Text>
          </View>
          <View>
            <Image
              source={CityBus}
              style={{ width: SCREEN_WIDTH, height: SCREEN_WIDTH }}
              resizeMode="contain"
            />
          </View>
        </View>

      </Animated.ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            position: "absolute",
            bottom: 30,
            paddingHorizontal: "5%",
            width:SCREEN_WIDTH,
       
          }}
        >
          <TouchableOpacity onPress={skip}>
            <Animated.Text style={[{ fontSize: 20, paddingRight:'10%' }, animatedTextStyle]}>Skip</Animated.Text>
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
                backgroundColor: idx.value == 0 ? "white" : 'gray',
                width: 15,
                height: 15,
                borderRadius: 7.5,
                marginHorizontal: 10,
              }}
            />
            <View
              style={{
                backgroundColor: idx.value == 1 ? "white" : 'gray',
                width: 15,
                height: 15,
                borderRadius: 7.5,
                marginHorizontal: 10,
              }}
            />
            <View
              style={{
                backgroundColor: idx.value == 2 ? "white" : 'gray',
                width: 15,
                height: 15,
                borderRadius: 7.5,
                marginHorizontal: 10,
              }}
            />
          </View>
          <TouchableOpacity onPress={next}>
            <Animated.Text style={[{ fontSize: 20 }, animatedTextStyle]}>{idx.value == 2 ? 'Get started' : 'Continue'}</Animated.Text>
          </TouchableOpacity>
        </View>
    </AnimatedSafeAreaView>
  );
};

// define your styles

//make this component available to the app
export default LandingComponent;
