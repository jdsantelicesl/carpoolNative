import { StyleSheet, Text, View, Image, Dimensions } from 'react-native'
import React from 'react'

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const Loading = ({ text }) => {
  return (
    <View style={styles.container}>
        <Image style={styles.logo} source={require("../../assets/images/applogo-leaf.png")} />
        <Text style={styles.text}>{text}</Text>
    </View>
  )
}

export default Loading

const styles = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: "column",
        alignContent: 'center',
        alignItems: "center"
    },
    text: {
        marginTop: -5 * vh,
        fontSize: 5 * vw,
        fontWeight: "bold",
        color: "#888", 
        textAlign: 'center'
    },
    logo: {
		height: 30 * vh,
		width: 30 * vh,
		resizeMode: "contain",
	},
})