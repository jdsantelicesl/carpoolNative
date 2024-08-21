// Page 3
// This file is for posting user's credentials and caching them
// 1. userFullName
// 2. userSchool
// 3. userBio
// For profile picture, let them edit in profile page

import { StyleSheet, Dimensions, Text, View, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, {useState, useEffect} from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

// @params
// onBackPress: func
// setUserCredentials : func 
const Credentials = ({lastCreds, onBackPress, setUserCredentials}) => {

    // Passes user creds as object 
    const handleSubmit = () => {
        const localUserCredentials = {
            name: localName,
            school: localSchool,
            bio : localBio
        }
        setUserCredentials(localUserCredentials)
    }

    const [localName, setLocalName] = lastCreds ? useState(lastCreds.name) : useState(null);
    const [localSchool, setLocalSchool] = lastCreds ? useState(lastCreds.school) : useState(null);
    const [localBio, setLocalBio] = lastCreds ? useState(lastCreds.bio) : useState(null);

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <View style={styles.container}>
            {/* Just adding spacing */}
            <View style={{marginTop: 10 * vh}}></View>

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>

            {/* Title */}
            <Text style={styles.title}>Get Started</Text>
            
            {/* Text Input */}
            <TextInput 
                style={styles.input} 
                placeholder="Full Name" 
                onChangeText={setLocalName}
                placeholderTextColor="#888" />
            
            <TextInput 
                style={styles.input} 
                placeholder="School" 
                onChangeText={setLocalSchool}
                placeholderTextColor="#888" />

            <TextInput 
                style={styles.input} 
                placeholder="Bio" 
                onChangeText={setLocalBio}
                placeholderTextColor="#888" />    

            {/* Carpool Button */}
            <TouchableOpacity style={styles.button} onPress={() => {handleSubmit();}}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

        </View>
      </TouchableWithoutFeedback>
    )
}

export default Credentials

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5 * vw,
    marginTop: -20 * vh,
  },
  backButton : {
    position: "absolute",
    top: 30 * vh,
    left: 8 * vw,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: -8 * vh,
  },
  logo: {
    height: 30 * vh,
    width: 30 * vh,
    resizeMode: "contain",
  },
  title: {
    fontSize: 4 * vh,
    fontWeight: "bold",
    color: "#6E6B6B",
    marginBottom: 5 * vh,
  },
  input: {
    width: "80%",
    height: 5 * vh,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 2 * vw,
    marginBottom: 2 * vh,
    fontSize: 1.8 * vh,
    color: "#333",
  },
  resendButtonContainer: {
    marginTop: -2 * vh,
    width: "80%"
  },
  resendButton: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  button: {
    flexDirection: "column",
    backgroundColor: "#367CE5",
    width: "80%",
    height: 5 * vh,
    borderRadius: 5,
    paddingHorizontal: 2 * vw,
    marginBottom: 3 * vh,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 1.5 * vh,
    fontWeight: "bold",
  },
})
