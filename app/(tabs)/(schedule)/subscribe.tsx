// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
// import axios from 'axios';

// export default function App() {
//   const [userId, setUserId] = useState('');
//   const [routeId, setRouteId] = useState('');

//   const subscribeToRoute = () => {
//     axios.post(`http://localhost:3000/users/${userId}/subscribe`, {
//       routeId
//     })
//     .then((response) => {
//       Alert.alert('Success', response.data.message || 'Subscribed successfully!');
//     })
//     .catch((error) => {
//       Alert.alert('Error', 'Failed to subscribe. Please try again.');
//       console.error(error);
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Subscribe to a Bus Route</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter User ID"
//         value={userId}
//         onChangeText={setUserId}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Route ID"
//         value={routeId}
//         onChangeText={setRouteId}
//       />

//       <Button title="Subscribe" onPress={subscribeToRoute} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 12,
//     paddingLeft: 8,
//   },
// });

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import API from "@/api";
import { useSelector, useDispatch } from 'react-redux';
import { selectProfile } from '@/redux/slices/userSlice';


  export default function RouteSubscriptionList() {
    // const userId  = useSelector(selectProfile).id;
    const userID = "U12356";
    const [routes, setRoutes] = useState([]);
    const [subscribedRoutes, setSubscribedRoutes] = useState(new Set());
  
    const fetchRoutes = async () => {
      try {
        const response = await API.V1.Schedules.GetRoutedetails({});
        setRoutes(response);
      } catch (error) {
        console.error(error);
      }
    };
  

    const fetchUserSubscriptions = async () => {
      try {
        const response = await API.V1.Schedules.Getsubscription({}); // Replace with your subscription API if different
        setSubscribedRoutes(new Set(response.data.map(sub => sub.RouteID)));
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
        Alert.alert('Error', 'Failed to fetch subscriptions');
      }
    };
  
    useEffect(() => {
      fetchRoutes();
      fetchUserSubscriptions();
    }, []);
  
    const handleSubscribe = async (RouteID) => {
      try {
        if (subscribedRoutes.has(RouteID)) {
          // Unsubscribe
          await API.V1.Schedules.RemovesubscriptionObject({ userID, RouteID }, {}); // Replace with correct unsubscribe endpoint
          setSubscribedRoutes(prev => {
            const next = new Set(prev);
            next.delete(RouteID);
            return next;
          });
        } else {
          // Subscribe
          await API.V1.Schedules.CreatesubscriptionObject({ userID, RouteID }, {}); // Replace with correct subscribe endpoint
          setSubscribedRoutes(prev => new Set([...prev, RouteID]));
        }
      } catch (error) {
        console.error("Error updating subscription:", error);
        Alert.alert('Error', 'Failed to update subscription');
      }
    };
  
    const renderRouteItem = ({ item }) => (
      <View style={styles.routeItem}>
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{item.RouteName}</Text>
          <Text style={styles.routeDetails}>{item.Details}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.subscribeButton,
            subscribedRoutes.has(item.id) && styles.subscribedButton
          ]}
          onPress={() => handleSubscribe(item.id)}
        >
          <Text style={styles.buttonText}>
            {subscribedRoutes.has(item.id) ? 'Subscribed' : 'Subscribe'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Available Routes</Text>
        <FlatList
          data={routes}
          renderItem={renderRouteItem}
          keyExtractor={item => item.RouteID.toString()}
          style={styles.list}
        />
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  routeItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  routeDetails: {
    fontSize: 14,
    color: '#666',
  },
  subscribeButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    minWidth: 100,
    alignItems: 'center',
  },
  subscribedButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
