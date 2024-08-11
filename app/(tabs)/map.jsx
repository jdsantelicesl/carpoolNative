import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { FontAwesome6 } from '@expo/vector-icons';
// Refer to docs: https://github.com/react-native-maps/react-native-maps
const MapScreen = () => {
    
    const [currentRegion, setCurrentRegion] = useState({
        latitude: 40.7128,
        longitude: -74.0060,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const handleRegionChangeComplete = (region) => {
        setCurrentRegion(region);
    };

    return (
        <View style={styles.container}>
        <MapView
            // Make the styles changeable with a buttons
            style={styles.map}
            userInterfaceStyle="light"
            initialRegion={currentRegion}
            onRegionChangeComplete={handleRegionChangeComplete}
        >
            <Marker
            coordinate={{ latitude: currentRegion.latitude, longitude: currentRegion.longitude}}
            title={"Real marker"}
            description={"The other marker on screen is fake"}
            tappable= {true}
            />
        </MapView>
        <View style={styles.iconContainer}>
            <FontAwesome6 name="location-dot" size={24} color="black" style={styles.iconContainer} />
            <FontAwesome6 name="location-dot" size={24} color="black" style={styles.iconContainer} />
        </View>
        <Text style= {styles.text}> 
            Current Region: 
            {"\n"}Latitude: {currentRegion.latitude.toFixed(4)}
            {"\n"}Longitude: {currentRegion.longitude.toFixed(4)}
            {"\n"}LatitudeDelta: {currentRegion.latitudeDelta.toFixed(4)}
            {"\n"}LongitudeDelta: {currentRegion.longitudeDelta.toFixed(4)}
        </Text>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  text: {
    padding: 30
  },
  iconContainer: {
    position: 'absolute',
    top: '40.5%',
    left: '48%',
  },
});

export default MapScreen;