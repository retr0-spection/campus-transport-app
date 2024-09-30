import { useRef, useState, useEffect } from "react";
import { Dimensions, Linking, Platform, StyleSheet, Modal, View, Text, TouchableOpacity} from "react-native";
import { GooglePlaceDetail } from "react-native-google-places-autocomplete";
import MapView, {
  LatLng,
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const navModalComponent = (props) => {

    // props -origin -destination -destination name -distance -duration

    const styles = StyleSheet.create({
        modalBackground: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContainer: {
          width: '80%',
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          elevation: 5,
        },
        modalTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        closeButton: {
          marginTop: 20,
          backgroundColor: '#007AFF',
          padding: 10,
          borderRadius: 5,
        },
        closeButtonText: {
          color: 'white',
          textAlign: 'center',
        },
      });

    return (

        <Modal
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>

            <Text style={styles.modalTitle}>Destination: {destination ? "Your Destination" : "N/A"}</Text>

            <Text>Duration: {duration ? `${duration.toFixed(0)} minutes` : "Calculating..."}</Text>

            <Text>Distance: {distance ? `${distance.toFixed(0)} minutes` : "Calculating..."}</Text>

            <TouchableOpacity style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Show Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton}>
              <Text style={styles.closeButtonText}> Cancel</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    )

   

};

export default navModalComponent;

