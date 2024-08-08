import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
// Refer to docs: https://github.com/react-native-maps/react-native-maps
const MapScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        userInterfaceStyle="light"
        initialRegion={{
          latitude: 38.5384,
          longitude: -121.4845,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 38.5384, longitude: -121.4845}}
          title={"Marker Title"}
          description={"Marker Description"}
        />
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
});

export default MapScreen;