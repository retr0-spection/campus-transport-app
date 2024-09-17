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
        <Stack.Screen name="rentalItem" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default Layout;