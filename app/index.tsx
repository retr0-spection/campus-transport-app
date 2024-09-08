import { Redirect, Slot } from "expo-router";
import Provider from "../context/auth";
import React, { useEffect } from "react";
import { AppState, StatusBar } from "react-native";
import { useSelector } from "react-redux";

const Index = () => {
  return (
    <Provider>
      {/* <StatusBar barStyle={darkMode ? "dark-content" : "light-content"} /> */}
      <Slot />
    </Provider>
  );
};
export default Index;
