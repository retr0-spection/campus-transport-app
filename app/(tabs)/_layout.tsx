import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(rentals)"
        options={{
          title: 'Rentals',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="electric-bike" color={color} size={22} />

          ),
        }}
      />
       <Tabs.Screen
        name="(schedule)"
        options={{
          title: 'Schedules',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="calendar" color={color} size={22} />
          ),
        }}
      />
       <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="notifications" color={color} size={22} />

          ),
        }}
      />
    </Tabs>
  );
}
