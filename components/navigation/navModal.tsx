import {
  Linking,
  Platform,
  StyleSheet,
  Modal,
  View,
  Text,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import ActionSheet from "react-native-actions-sheet";

const NavModalComponent = React.forwardRef((props, ref) => {
  const { origin, destination, onCloseCallBack } = props;
  const openNativeMapsApp = () => {
    if (origin && destination) {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destinationStr = `${destination.coordinate.latitude},${destination.coordinate.longitude}`;

      
const url = Platform.select({
  ios: `http://maps.apple.com/?saddr=${originStr}&daddr=${destinationStr}&t=m&dirflg=w&dname=${destination.name}`,
  android: `google.navigation:q=${destinationStr}&mode=w&destination=${destination.name}`,
});

      Linking.openURL(url as string).catch((err) =>
        console.error("An error occurred", err)
      );
    }
  };

  const styles = StyleSheet.create({
    modalBackground: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      width: "80%",
      padding: 20,
      backgroundColor: "white",
      borderRadius: 10,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 10,
    },
    closeButton: {
      marginTop: 20,
      backgroundColor: "#007AFF",
      padding: 10,
      borderRadius: 5,
    },
    closeButtonText: {
      color: "white",
      textAlign: "center",
    },
  });

  return (
    <ActionSheet
      containerStyle={{ height: "50%" }}
      ref={ref}
      onClose={onCloseCallBack}
    >
      <View style={{ padding: 20 }}>
        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
          {destination?.name}
        </Text>
        <Text style={{ fontWeight: "bold", color: "gray" }}>
          Destination Address
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Text>Walking</Text>
          <Text>Bicycle</Text>
          <Text>Driving</Text>
          <Text>Transit</Text>
        </View>
        <Text>10 Km</Text>
        <Button title="Navigate" onPress={openNativeMapsApp}></Button>
      </View>
    </ActionSheet>
  );
});

export default NavModalComponent;
