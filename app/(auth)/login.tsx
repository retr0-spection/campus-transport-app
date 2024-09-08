//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { setAuthenticated, setProfile } from "../../redux/slices/userSlice";
import { router } from "expo-router";
import axios from "axios";
import { styles } from "../../styles";
import Kudu from "../../assets/images/kudu.png";
import { AntDesign } from "@expo/vector-icons";
import {
  GoogleOneTapSignIn,
  statusCodes,
  isErrorWithCode,
  GoogleSignin,
  isSuccessResponse,
  isNoSavedCredentialFoundResponse,
} from '@react-native-google-signin/google-signin';


const SCREEN_WIDTH = Dimensions.get("screen").width;
const SCREEN_HEIGHT = Dimensions.get("screen").height;

// create a component
const LoginComponent = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  const formCheck = () => {
    if (email && email.length > 0) {
      if (!validateEmail(email)) {
        Alert.alert("Invalid Email", "Please enter a valid email", [
          { text: "Ok", onPress: () => null, style: "cancel" },
        ]);
        return false;
      }
    } else {
      setErrorMessage("Enter your email");
      setError(true);
      return false;
    }

    if (password && password.length > 0) {
    } else {
      setErrorMessage("Enter your password");
      setError(true);
      return false;
    }

    return true;
  }
  
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleOneTapSignIn.signIn();
  
      if (isSuccessResponse(response)) {
        // read user's info
        console.log(response.data);
      } else if (isNoSavedCredentialFoundResponse(response)) {
        // Android and Apple only.
        // No saved credential found, call `createAccount`
      }
    } catch (error) {
      console.warn(error)
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.ONE_TAP_START_FAILED:
            // Android-only, you probably have hit rate limiting.
            // You can still call `presentExplicitSignIn` in this case.
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android: play services not available or outdated
            // Web: when calling an unimplemented api (requestAuthorization)
            break;
          default:
          // something else happened
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  };


  return (
    <SafeAreaView
      style={{ height: "100%", width: "100%", ...styles.mainBackgroundContainer }}
    >
      <View>
        <View>
          {/* <Image source={LoginIllustration} style={{ height: '35%', width: '100%' }} resizeMode='cover' /> */}
          <View style={{ paddingHorizontal: "5%", paddingVertical: "2%", flexDirection:'row', justifyContent:'center' }}>
            <Text style={{ fontFamily:'NicoMoji', fontSize: 50, fontWeight: "bold", color: "white" }}>
             KuduNav
            </Text>
          </View>

          <View>
            <Image source={Kudu} style={{width:SCREEN_WIDTH, height:450}} resizeMode="contain"/>
          </View>

          <View style={{paddingHorizontal:'5%'}}>
            <Text style={{color:'white', fontSize:30, fontWeight:'bold'}}>Let's get started</Text>
            <Text style={{color:'white', fontSize:24} }>To continue, sign in with your wits account.</Text>
          </View>

          <TouchableOpacity onPress={signIn} activeOpacity={0.7} style={{backgroundColor:'white', marginHorizontal:'10%',marginVertical:'5%',paddingHorizontal:'7%',paddingVertical:'3%',borderRadius:7,  flexDirection:'row', alignItems:'center', }}>
            <AntDesign name="google" color={'black'} size={24} />
            <Text style={{color:'black', fontSize:20, paddingHorizontal:'10%'}}>Continue with Google</Text>
          </TouchableOpacity>

         
        </View>
      </View>
    </SafeAreaView>
  );
};

//make this component available to the app
export default LoginComponent;
