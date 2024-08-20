import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FontAwesome6 } from '@expo/vector-icons';
import polyline from '@mapbox/polyline';

import apiClient from '../../components/utilities/apiClient';
import { getUserData } from '../../components/utilities/cache';
// Refer to docs: https://github.com/react-native-maps/react-native-maps

const MapScreen = ({ origin, dest }) => {

  console.log("origin: ", origin);
  console.log("dest: ", dest);
  const [polylineAvailable, setPolylineAvailable] = useState(false)
  const [decodedPolyline, setPolyline] = useState(null);

  const [currentRegion, setCurrentRegion] = useState({
    latitude: 38.5655,
    longitude: -121.6346,
    latitudeDelta: 0.26,
    longitudeDelta: 0.23,
  });

  useEffect(() => {
    if (origin.lat && origin.long && dest.lat && dest.long) {
      const setLat = (origin.lat + dest.lat) / 2;
      const setLong = (origin.long + dest.long) / 2;
      const deltaLat = Math.abs(setLat - origin.lat) * 4;
      const deltaLong = Math.abs(setLong - origin.long) * 3;

      setCurrentRegion({
        latitude: setLat,
        longitude: setLong,
        latitudeDelta: deltaLat,
        longitudeDelta: deltaLong,
      })

      const send_data = {
        origin: {
          lat: origin.lat,
          long: origin.long
        },
        destination: {
          lat: dest.lat,
          long: dest.long
        }
      }

      const polyline_url = process.env.EXPO_PUBLIC_API_URL + "/ride/getRoute" // placeholder

      apiClient.post(polyline_url, send_data)
        .then(response => {
          const encodedPolyline = response.data.routes[0].polyline.encodedPolyline

          const decodedPoints = polyline.decode(encodedPolyline).map(point => ({
            latitude: point[0],
            longitude: point[1],
          }));
          setPolyline(decodedPoints);
          setPolylineAvailable(true);
        })
        .catch((error) => {
          console.log("error fetching polyline", error);
        })

    }
  }, [origin, dest]);



  const handleRegionChangeComplete = (region) => {
    setCurrentRegion(region);
  };

  return (
    <View style={styles.container}>
      <MapView
        // Make the styles changeable with a buttons
        style={styles.map}
        userInterfaceStyle="light"
        region={currentRegion}
        /*region={{
          latitude: 38.6485,
          longitude: -121.51426,
          latitudeDelta: 0.271,
          longitudeDelta: 0.23,
        }}*/
        onRegionChangeComplete={handleRegionChangeComplete}
      >

        {/* Origin Marker, renders if origin has coordinates */}
        {origin.lat && origin.long && <Marker
          coordinate={{ latitude: origin.lat, longitude: origin.long }}
          title={"Joe"}
          description={"Desc"}
          tappable={true}
          color="blue"
        />}

        {/* Destination Marker, renders if dest has coordinates */}
        {dest.lat && dest.long && <Marker
          coordinate={{ latitude: dest.lat, longitude: dest.long }}
          title={"Joe"}
          description={"Desc"}
          tappable={true}
          color="blue"
        />}

        {polylineAvailable &&
          <Polyline
            coordinates={decodedPolyline}
            strokeColor="purple"
            strokeWidth={3}
          />
        }
      </MapView>
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
    top: '46.5%',
    left: '47.5%',
  },
});

export default MapScreen;