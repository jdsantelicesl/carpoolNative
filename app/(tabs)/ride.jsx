import { React, useState } from 'react'
import { Text, View, StyleSheet, Dimensions, SafeAreaView, TextInput } from 'react-native'

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const ride = () => {
    const [destination, onChangeDest] = useState("");
    return (
        <SafeAreaView>
            <Text style={styles.title}> Find a Carpool </Text>
            <TextInput
                style={styles.locInput}
                placeholder="Where to?"
                placeholderTextColor="#6E6B6B"
                value={destination}
                onChangeText={onChangeDest}
            />

        </SafeAreaView>
    )
}

export default ride;

const styles = StyleSheet.create({
    title: {
        marginTop: 7 * vh,
        marginLeft: 6 * vw,

        color: "#5A5A5A",
        textAlign: "left",
        fontWeight: "bold",
        fontSize: 4 * vh,
    },
    locInput: {
        margin: 2 * vh,
        padding: 2*vw,
        height: 4 * vh,
        width: 90 * vw,
        borderRadius: 3*vh,


        backgroundColor: "#D9D9D9",
        color: "#6E6B6B",
    }
});
