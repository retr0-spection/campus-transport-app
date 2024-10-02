import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform, 
  ScrollView,
  Animated
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useRouter } from 'expo-router';

const NotificationsScreen = () => {

    const [showIcons, setShowIcons] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;

    const router = useRouter();

    const Notifications = [
        {id:0, title:"Bus Alert", message:"The bus leaves Amic deck in 10 minutes.", timestamp: "Sep 16, 13:35", status: "read"},
        /* {id:0, title:"Bus Alert", message:"The full circuit bus leaves in 30 minutes.", timestamp: "Sep 16, 13:15"}, */
        {id:0, title:"Schedule Change", message:"The bus schedule has been updated.", timestamp: "Sep 16, 12:18", status: "read"},
        {id:0, title:"Welcome", message:"Thanks for joining! Let’s get moving!", timestamp: "Sep 16, 12:10", status: "read"},
        {id:0, title:"Bus Alert", message:"The bus leaves WEC in 10 minutes.", timestamp: "Sep 16, 13:35", status: "read"},
        /* {id:0, title:"Bus Alert", message:"The full circuit bus leaves in 30 minutes.", timestamp: "Sep 16, 13:15"}, */
        {id:0, title:"Schedule Change", message:"The bus schedule has been updated.", timestamp: "Sep 16, 12:18", status: "read"},
        {id:0, title:"Welcome", message:"Thanks for joining! Let’s get moving!", timestamp: "Sep 16, 12:10", status: "read"},
        {id:0, title:"Bus Alert", message:"The bus leaves WEC in 10 minutes.", timestamp: "Sep 16, 13:35", status: "sent"},
        /* {id:0, title:"Bus Alert", message:"The full circuit bus leaves in 30 minutes.", timestamp: "Sep 16, 13:15"}, */
        {id:0, title:"Schedule Change", message:"The bus schedule has been updated.", timestamp: "Sep 16, 12:18", status: "sent"},
        {id:0, title:"Emergency Alert", message:"Safety concern near the Great Hall.", timestamp: "Sep 16, 12:10", status: "sent"},
    ]

    const notificationTypes = [...new Set(Notifications.map(item => item.title))];

    const unreadNotifications = Notifications.filter(notification => notification.status != "read");
    const readNotifications = Notifications.filter(notification => notification.status == "read");

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
            useNativeDriver: false,
            listener: (event) => {
                if (event.nativeEvent.contentOffset.y > 1) {
                    setShowIcons(true);
                } else {
                    setShowIcons(false);
                }
            },
        }
    );

    const Notification = ({title, message, timestamp, status}) => {

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

        const icon = title === "Bus Alert" ? "bus" : title === "Schedule Change" ? "calendar" : title === "Welcome" ? "happy-outline" : "alert";

        return(
            <TouchableOpacity style={[
                styles.notificationContainer,
                /* status === "read" && { backgroundColor: "#F2F3F4" } */
            ]}>
                <View style ={styles.notificationContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={icon} color={"white"} size={24}/>
                    </View>
                    <View style={styles.textContainer}>
                        <View style={{flexDirection:"row", alignItems:"center", gap: 3, justifyContent:"space-between"}}>
                            <Text style={styles.notificationTitle}>{title}</Text>
                            {status !== "read" && (
                            <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
                                <Entypo name="dot-single" size={26} color={"#ff9f00"} />
                            </Animated.View>
                            )}
                        </View>
                        <Text style={styles.notificationMessage} numberOfLines={2}>{message}</Text>
                        <Text style={styles.notificationTimestamp}>{timestamp}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={{ height: "100%", width: "100%", backgroundColor: "#ffffff" }}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={router.back}>
                    <Ionicons name={"arrow-back"} color={"black"} size={26}/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View />
                {/* <TouchableOpacity>
                    <Entypo name={"dots-three-horizontal"} color={"black"} size={20}/>
                </TouchableOpacity> */}
            </View>
            <ScrollView style={{ height: "100%" }} 
                onScroll={handleScroll}
                scrollEventThrottle={16}>
                <View style={styles.notificationsContent}>
                    <View style={styles.subHeader}>
                        <Text style={styles.seubHeaderTitle}>Today</Text>
                        <View style={styles.numContainer}>
                            <Text style={{color:"#173470", fontWeight:'bold'}}>{unreadNotifications.length}</Text>
                        </View>
                        {/* {showIcons ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {notificationTypes.map((type, index) => (
                                <TouchableOpacity key={index} style={{marginRight:7}}>
                                    <View style={styles.numContainer}>
                                        <Ionicons name={type === "Bus Alert" ? "bus" : type === "Schedule Change" ? "calendar" : "alert"} size={16} color="#173470" />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        ) : (
                            <View style={styles.numContainer}>
                                <Text style={{ color: "#173470", fontWeight: 'bold' }}>{Notifications.length}</Text>
                            </View>
                        )} */}
                    </View>
                    {unreadNotifications.map((item, index) => (
                        <Notification {...item} key={index}/>
                    ))}
                </View>
                <View style={styles.notificationsContent}>
                    <View style={styles.subHeader}>
                        <Text style={styles.seubHeaderTitle}>Earlier</Text>
                        <View style={styles.numContainer}>
                            <Text style={{color:"#173470", fontWeight:'bold'}}>{readNotifications.length}</Text>
                        </View>
                    </View>
                    {readNotifications.map((item, index) => (
                        <Notification {...item} key={index}/>
                    ))}
                </View>
            </ScrollView>
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
      fontSize: 21,
      fontWeight: "bold",
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: '#d0d0d0',
        //marginTop:5
    },
    notificationContainer: {
        backgroundColor: "white", 
        paddingVertical:10, 
        paddingHorizontal:16, 
        //borderBottomWidth:1, 
        borderBottomColor: "#e0e0e0",
        borderRadius: 15,
        ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            },
            android: {
              elevation: 10,
            },
          }),
    },
    notificationContent: {
        flexDirection: "row",
        alignItems: "center"
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
        marginTop:15,
        gap: 20,
        paddingHorizontal: 15
    },
    subHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap:10,
        marginHorizontal:10
    },
    seubHeaderTitle: {
        fontSize:18,
        fontWeight: 'bold'
    },
    numContainer: {
        width: 25,
        height: 25,
        borderRadius: 100,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: "#E0F7FA"
    }
  });