import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { Platform } from 'react-native';

export const requestNotificationPermission = async (userId: string) => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        const token = await messaging().getToken();

        const deviceType = Platform.OS;
        
        try {
            await axios.post(`http://localhost/users/${userId}/device`, {
                deviceToken: token,
                deviceType,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log('Device token sent successfully');
        } catch (error) {
            console.error('Error sending device token:', error);
        }
    }
};

// Handle background and foreground messages
export const setupNotifications = () => {
    messaging().onMessage(async remoteMessage => {
        console.log('Notification received in foreground:', remoteMessage);
        // Handle your notification display here
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Notification received in background:', remoteMessage);
        // Handle your background notification display here
    });
};
