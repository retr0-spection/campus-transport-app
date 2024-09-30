import {  Linking, Platform, StyleSheet, Modal, View, Text, TouchableOpacity} from "react-native";


const navModalComponent = (props) => {

    // props -origin -destination -destination name -distance -duration
    const {origin, destination, distance, duration, locationname} = props

    const openNativeMapsApp = () => {
        if (origin && destination) {
          const originStr = `${origin.latitude},${origin.longitude}`;
          const destinationStr = `${destination.latitude},${destination.longitude}`;
    
          const url = Platform.select({
            ios: `http://maps.apple.com/?saddr=${originStr}&daddr=${destinationStr}`,
            android: `google.navigation:q=${destinationStr}&mode=w`,
          });
    
          Linking.openURL(url as string)
            .catch((err) => console.error('An error occurred', err));
        }
      };

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

            <Text>Destination: {destination ? locationname : "N/A"}</Text>

            <Text>Duration: {duration ? `${duration.toFixed(0)} minutes` : "Calculating..."}</Text>

            <Text>Distance: {distance ? `${distance.toFixed(3)} metres` : "Calculating..."}</Text>

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

