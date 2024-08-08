import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

const url = "http://192.168.1.23:5000/ride/locFind"

const LocFind = ({ style, query }) => {
    const [locations, setLocations] = useState([])
    // placeholder for lat, long
    const lat = 38.5544
    const long = -121.7709

    useEffect(() => {
        const queryParam = encodeURIComponent(query);
        const reqUrl = `${url}?query=${queryParam}&lat=${lat}&long=${long}`;

        axios.get(reqUrl)
            .then(response => {
                setLocations(response.data.places)
            })
            .catch(error => {
                //handle error
            });
    }, [query]);

    return (
        <View style={style}>
            {locations ? (
                <FlatList
                    data={locations}
                    renderItem={({ item }) =>
                        <Text key={item.id}>{item.displayName.text}</Text>
                    }
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false} // Disable scrolling for FlatList
                />
            ) : (
                <Text>Loading.. </Text>
            )}
        </View>
    )
}

export default LocFind;