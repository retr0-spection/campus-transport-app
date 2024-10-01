import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";


const Layout = () => {
 

  return (
    <>

      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="confirmation" options={{ headerShown: false }} />
        <Stack.Screen name="skateboard-rental" options={{ headerShown: false }} />
        <Stack.Screen name="scooter-rental" options={{ headerShown: false , gestureEnabled: true} }/>
      </Stack>
    </>
  );
};

export default Layout;
