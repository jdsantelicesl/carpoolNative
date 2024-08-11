import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FontAwesome6 } from '@expo/vector-icons';
import polyline from '@mapbox/polyline';
// Refer to docs: https://github.com/react-native-maps/react-native-maps
const MapScreen = ({onLatChange, onLongChange}) => {

	const [currentRegion, setCurrentRegion] = useState({
		latitude:  38.5655,
        longitude: -121.6346,
        latitudeDelta: 0.2591,
        longitudeDelta: 0.2251,
    });
	
	useEffect(() => {
        onLatChange(currentRegion.latitude);
        onLongChange(currentRegion.longitude);
    }, [currentRegion, onLatChange, onLongChange]);

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

	const lengthDecodedPointsArray = decodedPoints.length;
	destinationLat = decodedPoints[0]["latitude"]
	destinationLong = decodedPoints[0]["longitude"]
	originLat = decodedPoints[lengthDecodedPointsArray - 1]["latitude"]
	originLong = decodedPoints[lengthDecodedPointsArray - 1]["longitude"]

    return (
        <View style={styles.container}>
        <MapView
            // Make the styles changeable with a buttons
            style={styles.map}
            userInterfaceStyle="light"
            initialRegion={currentRegion}
            onRegionChangeComplete={handleRegionChangeComplete}
        >
			{/* Current Marker Position */}
            <Marker
            coordinate={{ latitude: currentRegion.latitude, longitude: currentRegion.longitude}}
            title={ "Title" }
            description={ "Desc" }
            tappable= {true}
            />

			{/* Origin Marker */}
			<Marker 
			 coordinate={{ latitude: originLat , longitude: originLong}}
			 title={ "Joe" }
			 description={ "Desc" }
			 tappable= {true}
			 color="blue"
			/>

			{/* Destination Marker */}
			<Marker 
			 coordinate={{ latitude: destinationLat, longitude: destinationLong}}
			 title={ "Joe" }
			 description={ "Desc" }
			 tappable= {true}
			 color="blue"
			/>

            <Polyline 
            coordinates={decodedPoints}
            strokeColor="red"
            strokeWidth={2}
            />
        </MapView>
        <View style={styles.iconContainer}>
            <FontAwesome6 name="location-dot" size={24} color="black" style={styles.iconContainer} />
        </View>
        
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