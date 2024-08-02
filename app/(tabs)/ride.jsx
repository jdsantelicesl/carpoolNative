import React from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window');
const vh = height*0.01;
const vw = width*0.01;

const ride = () => {
    return (
        <>
            <Text style={styles.title}> Find a Ride </Text>
            <View style={styles.container}>

            </View>
        </>
    )
}

export default ride;

const styles = StyleSheet.create({
    title: {
        marginTop: 8*vh,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 4*vh,
    },
    container: {
        marginLeft: 20*vw,
        marginRight: 20*vw,
        marginTop: 10*vh,

        height: 20*vh,
        width: 60*vw,
        backgroundColor: 'red'
    }
});
