import { Redirect, Slot } from "expo-router";
import Provider from "../context/auth";
import React, { useEffect } from "react";
import { AppState, StatusBar } from "react-native";
import { useSelector } from "react-redux";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Index = () => {
  React.useEffect(() => {
    const clientGoogleId =
      "852854144164-bpgaon6krp6nf795kfe04r4rdqbnvio3.apps.googleusercontent.com";
    const iosClientId =
      "852854144164-m2frvklvaeesil11dc8f6sfkf9r2rdap.apps.googleusercontent.com";
    GoogleSignin.configure({
      hostedDomain: "students.wits.ac.za",
      webClientId: clientGoogleId,
      iosClientId,
      offlineAccess: true,
      scopes: ["email", "profile"],
    });
  }, []);

  return (
    <Provider>
      {/* <StatusBar barStyle={darkMode ? "dark-content" : "light-content"} /> */}
      <Slot />
    </Provider>
  );
};
export default Index;
