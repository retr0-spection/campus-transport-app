import React, { Component } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from 'expo-router';

interface NotificationItem {
    id: number;
    title: string;
    message: string;
    timestamp: string;
  }

const NotificationsScreen = () => {

    const router = useRouter();

    const Notifications: NotificationItem[] = [
        {id:0, title:"Bus Alert", message:"The full circuit bus will be departing in 10 minutes. Make sure you're ready to catch your ride!", timestamp: "Sep 16, 13:35 PM"},
        {id:0, title:"Bus Alert", message:"The full circuit bus will be departing in 30 minutes. Make sure you're ready to catch your ride!", timestamp: "Sep 16, 13:15 PM"},
        {id:0, title:"Schedule Change", message:"The schedule for full circuit bus has been updated. Check the new timing.s", timestamp: "Sep 16, 12:18 AM"}
    ]

    const Notification: React.FC<NotificationItem> = ({title, message, timestamp}) => {
        const icon = title == "Bus Alert"? "bus" : "calendar";
        return(
            <View style={styles.notificationContainer}>
                <View style ={styles.notificationContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon} color={"white"} size={24}/>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.notificationTitle}>{title}</Text>
                        <Text style={styles.notificationMessage} numberOfLines={2}>{message}</Text>
                        <Text style={styles.notificationTimestamp}>{timestamp}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ height: "100%", width: "100%", backgroundColor: "white" }}>
            <View style={styles.headerContainer}>
                <Ionicons name="arrow-back" color={'black'} size={26} />
                <Text style={styles.headerTitle} /* onPress={() => router.push('/rentals')} */>Notifications</Text>
            </View>
            <View>
                {Notifications.map(item => (
                    <Notification {...item}/>
                ))}
            </View>
        </SafeAreaView>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    headerContainer: {
      paddingVertical: 16,
      //backgroundColor:'#c4c5c6',
      flexDirection: "row",
      gap: 10,
      paddingHorizontal: 10,
      borderBottomWidth:1, 
    borderBottomColor: "#e0e0e0"
    },
    headerTitle: {
      fontSize: 19,
      fontWeight: "bold",
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: '#d0d0d0',
        marginTop:5
    },
    notificationContainer: {
        //backgroundColor: "white", 
        paddingVertical:12, 
        paddingHorizontal:16, 
        borderBottomWidth:1, 
        borderBottomColor: "#e0e0e0"
    },
    notificationContent: {
        flexDirection: "row"
    },
    textContainer: {
        flex: 1
    },
    notificationTitle: {
        fontWeight: "bold", 
        fontSize:16,
        marginBottom: 2
    },
    notificationMessage: {
        fontSize: 14,
        color: "#333",
        marginBottom: 4
    },
    notificationTimestamp: {
        fontSize: 12,
        color: '#888',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: '#173470',
        marginTop:5,
        alignItems:'center',
        justifyContent: "center",
    }
  });