import React from 'react'
import { Text, View } from 'react-native'
import { Tabs } from 'expo-router'

import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Import GestureHandlerRootView

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabLayout = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Tabs screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#2E74DD",
                tabBarInactiveTintColor: "#000000"
            }}>
                <Tabs.Screen name='ride'
                    options={{
                        tabBarLabel: 'Ride',
                        tabBarIcon: ({ color }) => <FontAwesome6 name="car-side" size={24} color={color} />
                    }}
                />
                <Tabs.Screen name='messages'
                    options={{
                        tabBarLabel: 'Messages',
                        tabBarIcon: ({ color }) => <Ionicons name="mail" size={24} color={color} />
                    }}
                />
                <Tabs.Screen name='profile'
                    options={{
                        tabBarLabel: 'Profile',
                        tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />
                    }}
                />
            </Tabs>
        </GestureHandlerRootView>
    )
}

export default TabLayout;
