import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FontAwesome6 } from '@expo/vector-icons';
import polyline from '@mapbox/polyline';
// Refer to docs: https://github.com/react-native-maps/react-native-maps
const MapScreen = () => {
    
    const [currentRegion, setCurrentRegion] = useState({
        latitude: 38.5655,
        longitude: -121.6346,
        latitudeDelta: 0.2591,
        longitudeDelta: 0.2251,
    });

    const handleRegionChangeComplete = (region) => {
        setCurrentRegion(region);
    };

    // Hardcoded for now
    // Make this call fetchRoute(); instead
    const encodedString = "ygfjFppodVDNRVBXAJdDp@FAZKj@nGGLK~BfJrBxB`@LNrCj@uHpn@q@fF_@vAcApBk@hAs@hA{ApCc@bAuE~NmAnEgB`GiDiB{@[eBg@oDq@_@Jo@O}C_@uAIyCA_CH_D^wCl@mMpDqJhD}HfDmDhAmAVwQ`DsAXeGfBMGsFfAaDXoADwBGSJ_CUgCg@iCy@kB{@{A}@uAcAaAiAo@kAm@aBSy@]cCe@wDU_A]o@Y]s@e@s@Qg@Cw@Jk@Vk@d@c@r@Y|@MdABtARjD@rAEbBWtBKn@[bAg@lAQ^?`@cBzBkOdQaEbF}G`Iq@~@qA`CaAdCmAdEYbB]~CMdC?zCJhDXtC|@xFxAlI\\`CjArG`@jDX~BRxBTzDLhDFhD?xk@?~OAnH?`QCtC@~JCzDU~P_@xNKbF]hPItH?hCBtGN~ATjFVbEn@tH`AxMzApR~@`LnBdQhEjd@fBfPxNxvAvJ~aArJp_A~AjNnJp_ArAxNdK`cAt@lIlA`QZxD`AxNr@tIxBfZd@dIjAnL|Inp@jM~~@z@fFvBpJnArF~@pFj@xE`@hF`AlNz@|GpZlxB~F`b@x@rEn@rClB`HbBzEnBnEzBdElAnB`CbDbc@dj@~KvNfAdBlCbEhB`DdBrDrBjFvAnEnA|Ez@hEx@bFf@`En@`Gp@jF|@nFXnAKd@dCrMtA`GjArDjAxClFrL^pAVnBF~AEdBKdA[|Ag@rAq@hAw@x@m@d@iAf@u@RyAJeELKFuNIe|@y@uJQUOoIw@aDq@mA_@W@AjMGbEm@CeF@k@Cu@Ka@KHw@F_A?kAC]GOMGsBE_DAAh@K??fA"

    const decodedPoints = polyline.decode(encodedString).map(point => ({
      latitude: point[0],
      longitude: point[1],
    }));

    console.log(" ")
    console.log(" ")
    console.log(" ")
    console.log(decodedPoints);

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
            title={ "Title" }
            description={ "Desc" }
            tappable= {true}
            />

            <Polyline 
            coordinates={decodedPoints}
            strokeColor="red"
            strokeWidth={4}
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