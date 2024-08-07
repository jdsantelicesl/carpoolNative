import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import axios from 'axios';

const url = "http://192.168.1.23:5000/ride/locFind"

const LocFind = ({ style, query }) => {
    const [locations, setLocations] = useState(null)
    // placeholder for lat, long
    const lat = 38.5544
    const long = -121.7709

    useEffect(() => {
        const queryParam = encodeURIComponent(query);
        const reqUrl = `${url}?query=${queryParam}&lat=${lat}&long=${long}`;

        axios.get(reqUrl)
            .then(response => {
                console.log(response.data);
                setLocations(response.data.places)
            })
            .catch(error => {
                //handle error
            });
    }, [query]);

    return (
        <View style={style}>
            {locations ? (
                locations.map(location => (
                    <Text key={location.id}>{location.displayName.text}</Text>
                ))
            ) : (
                <Text>Loading.. </Text>
            )}
        </View>
    )
}

export default LocFind;