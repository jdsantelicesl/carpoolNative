import React from 'react'
import { Text, View } from 'react-native'
import { Tabs } from 'expo-router'

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabLayout = () => {
    return (
        <Tabs screenOptions={{ 
            headerShown: false,
            tabBarActiveTintColor:"#2E74DD",
            tabBarInactiveTintColor:"#000000"
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

            {/* <Tabs.Screen name='map'
                // This is used to make map a hidden tab
                // Uncomment line 35-41 to hide tab
                options={{
                    href:null,
                }}
            /> */}

            <Tabs.Screen name='LocFindSlide'
                // This is used to make map a hidden tab
                // Uncomment line 35-41 to hide tab
                options={{
                    href:null,
                }}
            />
        </Tabs>
    )
}

export default TabLayout;
