import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform, 
  ScrollView,
  Animated,
  useColorScheme,
  ColorValue,
  Modal,
  Pressable
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import { Colors } from "@/constants/Colors";
import { useSelector, useDispatch } from 'react-redux';

import { markNotificationAsRead } from '../../redux/slices/notificationSlice';
import { deleteNotifications } from '../../redux/slices/notificationSlice';

const NotificationsScreen = () => {
    const [selectedIds, setSelectedIds] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedAlert, setSelectedAlert] = useState(null); // State for selected alert data

    // Function to toggle notification selection on long press
    const toggleSelectNotification = (id) => {
        if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
        } else {
        setSelectedIds([...selectedIds, id]);
        }
    };

    // Helper function to darken the color by a given percentage
    const darkenColor = (color, percentage) => {
        const decimalPercentage = percentage / 100;
        const colorValue = parseInt(color.replace('#', ''), 16);
        const r = (colorValue >> 16) & 0xff;
        const g = (colorValue >> 8) & 0xff;
        const b = colorValue & 0xff;
    
        const darkenedColor = `#${(
        ((1 - decimalPercentage) * r) << 16 |
        ((1 - decimalPercentage) * g) << 8 |
        ((1 - decimalPercentage) * b)
        ).toString(16).padStart(6, '0')}`;
    
        return darkenedColor;
    };

    const colorScheme = useColorScheme()

    const router = useRouter();

    const [Notifications, setNotifications] =  useState( [
        {_id:6, type:"Bus Alert", message:"The bus leaves WEC in 10 minutes.", timestamp: "Sep 16, 13:35", status: "sent"},
        {_id:7, type:"Schedule Change", message:"The bus schedule has been updated.", timestamp: "Sep 16, 12:18", status: "sent"},
        {_id:8, type:"Emergency Alert", message:"Safety concern near the Great Hall.", timestamp: "Sep 16, 12:10", status: "sent"},
        {_id:0, type:"Bus Alert", message:"The bus leaves Amic deck in 10 minutes.", timestamp: "Sep 16, 13:35", status: "read"},
        {_id:1, type:"Schedule Change", message:"The bus schedule has been updated.", timestamp: "Sep 16, 12:18", status: "read"},
        {_id:2, type:"Welcome", message:"Thanks for joining! Let’s get moving!", timestamp: "Sep 16, 12:10", status: "read"},
        {_id:3, type:"Bus Alert", message:"The bus leaves WEC in 10 minutes.", timestamp: "Sep 16, 13:35", status: "read"},
        {_id:4, type:"Schedule Change", message:"The bus schedule has been updated.", timestamp: "Sep 16, 12:18", status: "read"},
        {_id:5, type:"Welcome", message:"Thanks for joining! Let’s get moving!", timestamp: "Sep 16, 12:10", status: "read"},
    ])

    const notifications = useSelector((state) => state.notifications.notifications);
    const loading = useSelector((state) => state.notifications.loading);
    const error = useSelector((state) => state.notifications.error);


    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = (notificationDate) => {
        const notifDate = new Date(notificationDate);
        notifDate.setHours(0, 0, 0, 0);
        return today.getTime() === notifDate.getTime();
    };

    const todayNotifications = notifications.filter(notification => isToday(notification.createdAt));
    const earlierNotifications = notifications.filter(notification => !isToday(notification.createdAt));

    const options = {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
        timeZone: 'Africa/Johannesburg'
    };

    const dispatch = useDispatch();

    const deleteSelectedNotifications = async () => {
        try {
            await dispatch(deleteNotifications(selectedIds)).unwrap();
            setSelectedIds([]);
        } catch (error) {
            console.error("Failed to delete notifications:", error);
            alert('Error deleting notifications: ' + error.message);
        }
    };

    const markAsRead = async (id) => {
        try {
            // Assuming you have a function to make API calls
            await dispatch(markNotificationAsRead(id)).unwrap(); // Replace with your API call
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
            alert('Error marking notification as read: ' + error.message);
        }
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => {selectedIds.length > 0 ? setSelectedIds([]) : router.back();}}>
                <Ionicons name="arrow-back" color={Colors[colorScheme].text} size={26}/>
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: Colors[colorScheme].text }]}>
                {selectedIds.length > 0 ? `${selectedIds.length} Selected` : "Notifications"}
            </Text>
            {selectedIds.length > 0 ? (
                <TouchableOpacity onPress={deleteSelectedNotifications}>
                    <Ionicons name="trash" color="white" size={20}/>
                </TouchableOpacity>
            ) : (
                <View />
            )}
        </View>
        
    );

    const Notification = ({_id, type, message, createdAt, status}) => {

        const pulseAnimation = useRef(new Animated.Value(1)).current;

        // Start pulsing animation for unread notifications
        useEffect(() => {
            if (status !== "read") {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(pulseAnimation, {
                            toValue: 1.2,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulseAnimation, {
                            toValue: 1,
                            duration: 500,
                            useNativeDriver: true,
                        }),
                    ])
                ).start();
            }
        }, [status]);

        const icon = type === "Bus Alert" ? "bus" : type === "Schedule Change" ? "calendar" : type === "Welcome" ? "happy-outline" : "alert";

        if (loading) {
            return <Text>Loading...</Text>;
        }
    
        if (error) {
            return <Text>Error: {error}</Text>;
        }

        return (
            <TouchableOpacity 
                onPress={() => {
                    if (selectedIds.length > 0) {
                        toggleSelectNotification(_id);
                    } else {
                        status !="read" && markAsRead(_id); // This should call your function to mark the notification as read
                        setSelectedAlert({ _id, type, message, createdAt, status });
                        setModalVisible(true);
                    }
                }}                
                onLongPress={() => toggleSelectNotification(_id)}
                style={[
                    styles.notificationContainer,
                    {
                        backgroundColor: selectedIds.includes(_id)
                            ? darkenColor(Colors[colorScheme].background, 30) 
                            : (status != 'read'
                                ? (colorScheme === 'light' ? Colors.light.tint : darkenColor("#c5c6c7", 80)) // Lighter color for unread notifications
                                : Colors[colorScheme].background) // Default background for read notifications
                    }
                ]}
            >
                <View style={styles.notificationContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon} color={"white"} size={24}/>
                    </View>
                    <View style={styles.textContainer}>
                        <View style={{flexDirection:"row", alignItems:"center", gap: 3, justifyContent:"space-between"}}>
                            <Text style={[styles.notificationTitle, { color: Colors[colorScheme].text }]}>{type}</Text>
                            {status !== "read" && (
                                <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
                                    <Entypo name="dot-single" size={26} color={"#E0F7FA"} />
                                </Animated.View>
                            )}
                        </View>
                        <Text style={[styles.notificationMessage, { color: Colors[colorScheme].text }]} numberOfLines={2}>{message}</Text>
                        <Text style={styles.notificationTimestamp}>{new Date(createdAt).toLocaleString('en-US', options).replace(',', '')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
        
    };

    return (
        <SafeAreaView style={{ height: "100%", width: "100%", backgroundColor: Colors[colorScheme].background }}>
            {renderHeader()}
            <ScrollView style={{ height: "100%", }} 
                scrollEventThrottle={16}>
                {todayNotifications.length > 0 && <View style={styles.notificationsContent}>
                    <View style={styles.subHeader}>
                        <Text style={[styles.seubHeaderTitle, {color:Colors[colorScheme].text}]}>Today</Text>
                        <View style={styles.numContainer}>
                            <Text style={{color:"#173470", fontWeight:'bold'}}>{todayNotifications.length}</Text>
                        </View>
                    </View>
                    {todayNotifications.map((item, index) => (
                        <Notification {...item} key={index}/>
                    ))}
                </View>}
                {earlierNotifications.length > 0 && <View style={styles.notificationsContent}>
                    <View style={styles.subHeader}>
                        <Text style={[styles.seubHeaderTitle, {color:Colors[colorScheme].text}]}>Earlier</Text>
                        <View style={styles.numContainer}>
                            <Text style={{color:"#173470", fontWeight:'bold'}}>{earlierNotifications.length}</Text>
                        </View>
                    </View>
                    {earlierNotifications.map((item, index) => (
                        <Notification {...item} key={index}/>
                    ))}
                </View>}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} // Handle back button
            >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <Pressable style={styles.modalContainer} onPress={() => { /* Prevent closing when tapping inside */ }}>
                        <Text style={styles.modalTitle}>{selectedAlert?.type}</Text>
                        <Text style={styles.modalMessage}>{selectedAlert?.message}</Text>
                        <Text style={styles.modalTimestamp}>{new Date(selectedAlert?.createdAt).toLocaleString('en-US', options).replace(',', '')}</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>View Schedule</Text>
                        </TouchableOpacity>
                    </Pressable>
                </Pressable>
            </Modal>

        </SafeAreaView>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    headerContainer: {
      paddingVertical: 16,
      flexDirection: "row",
      paddingHorizontal: 16,
      //borderBottomWidth:1, 
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
    justifyContent:"space-between"
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: '#d0d0d0',
    },
    notificationContainer: {
        backgroundColor: "white", 
        paddingVertical:10, 
        paddingHorizontal:15, 
    },
    notificationContent: {
        flexDirection: "row",
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
    },
    notificationsContent: {
        marginTop:5,
        paddingVertical:10
    },
    subHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap:10,
        marginHorizontal:15,
        marginBottom: 15
    },
    seubHeaderTitle: {
        fontSize:18,
        fontWeight: 'bold'
        
    },
    numContainer: {
        width: 22,
        height: 22,
        borderRadius: 100,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: "#E0F7FA"
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'flex-end', // Align the modal to the bottom
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        elevation: 5, // For Android shadow
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalTimestamp: {
        fontSize: 14,
        color: '#888',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#173470',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    }
  });