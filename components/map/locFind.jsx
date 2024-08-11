import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { TouchableOpacity } from 'react-native-gesture-handler';

const url = process.env.EXPO_PUBLIC_API_URL + "/ride/locFind";

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const LocFind = ({ style, query, handleLocClick }) => {
    const [locations, setLocations] = useState([])
    // placeholder for lat, long
    const lat = 38.5544
    const long = -121.7709

    useEffect(() => {
        const queryParam = encodeURIComponent(query);
        const reqUrl = `${url}?query=${queryParam}&lat=${lat}&long=${long}`;

        axios.get(reqUrl)
            .then(response => {
                setLocations(response.data.suggestions)
            })
            .catch(error => {
                console.log("bad request")
            });
    }, [query]);

    return (
        <View style={style}>
            {query === "" ? (
                <Text style={styles.message}> Enter a location to get suggestions... </Text>
            ) : (
                locations ? (
                    <FlatList
                        data={locations}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.locContainer}
                                onPress={() => handleLocClick(item.placePrediction.placeId, item.placePrediction.text.text)}
                            >
                                <Text style={styles.locText}>{item.placePrediction.text.text}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.placePrediction.placeId} // Use a unique identifier for key
                        scrollEnabled={true} // Disable scrolling for FlatList
                    />
                ) : (
                    <Text style={styles.message}>Loading.. </Text>
                ))}

        </View>
    )
}

const styles = StyleSheet.create({
    message: {
        fontSize: 2 * vh,
        fontWeight: 'bold',
        color: 'black'
    },
    locText: {
        marginHorizontal: 4*vw,
        fontSize: 2 * vh,
        fontWeight: 'bold',
        color: 'black'
    },
    locContainer: {
        marginVertical: .5*vh,
        backgroundColor: "#D9D9D9",
        width: 86 * vw,
        paddingVertical: 1.5 * vh,
        borderRadius: 3 * vh
    }

})

export default LocFind;