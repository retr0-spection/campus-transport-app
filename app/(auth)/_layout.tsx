import { SYSMESSAGE } from "@/components/announcements/systemStatus";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const Layout = () => {
 

  return (
    <>
      <SYSMESSAGE />

      <Stack>
        <Stack.Screen name="landing" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="emailSignUp" options={{ headerShown: false }} />
        <Stack.Screen name="emailLogIn" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default Layout;
