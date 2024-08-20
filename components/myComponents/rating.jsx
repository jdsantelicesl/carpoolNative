/**
 * Rating component. Using this for profile, but can be reused for posts ride and more.
 * Pass rating (star rating of a user), and total number of ratings.
 */


import React from 'react'
import { View, StyleSheet, Text } from 'react-native'

import FontAwesome from '@expo/vector-icons/FontAwesome';

const Rating = ({ style, size, rating, total }) => {
    // rounding allows input to be the exact average. This operation rounds it to nearest .5 star.
    const rounded = Math.round(rating*2)/2;

    // returns the total number of full stars
    const full = Math.floor(rounded);

    const half = (rounded - full) > 0 ? 1 : 0;
    const empty = 5 - (full + half);

    return (
        <View style={[style, styles.container]}>
            {/** For rating use FontAwesome, and either: star, star-o, star-half-o */}

            {/** Create an empty array in order to use map. 
             * Map from 0 to full to create total full stars */}
            {Array.from({ length: full }).map((_, index) => (
                <FontAwesome name="star" size={size} color="black" />
            ))}
            
            {/** same thing for half stars. It will technically only do one, but I just copy pasted */}
            {Array.from({ length: half }).map((_, index) => (
                <FontAwesome name="star-half-o" size={size} color="black" />
            ))}

            {/** empty stars */}
            {Array.from({ length: empty }).map((_, index) => (
                <FontAwesome name="star-o" size={size} color="black" />
            ))}
            {total !== undefined && total !== null && <Text>({total})</Text>}
        </View>
    )
}

export default Rating;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});