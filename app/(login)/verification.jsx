// Page 2
// Users enter access token and stores it in cache

// Todo: Create logic to prevent user from spamming resquest and prevent brute force attacks on access tokens
import { StyleSheet, Dimensions, Text, View, TextInput, 
  TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, {useState, useEffect} from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

// @params
// onBackPress: func
// onResendCode: func
// onAccessTokenChange : func
const Verification = ({onBackPress, onResendCode, onSubmitCode}) => {

    const [localAccessToken, setLocalAccessToken] = useState(null);

    const handleLogin = (localAccessToken) =>{
        onSubmitCode(localAccessToken);
    }

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

        <View style={styles.container}>

            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>

            {/* App Logo */}
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require("../../assets/images/applogo-leaf.png")} />
            </View>

            {/* Title */}
            <Text style={styles.title}>One Last Step</Text>
            
            {/* Text Input */}
            <TextInput 
                style={styles.input} 
                placeholder="Enter your verification code" 
                onChangeText={setLocalAccessToken}
                placeholderTextColor="#888" />
            
            {/* Login Button */}
            <TouchableOpacity style={styles.button} disabled={!localAccessToken} onPress={() => {handleLogin(localAccessToken)}}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>

            {/* Resend Button */}
            <View style={styles.resendButtonContainer}>
                <TouchableOpacity onPress={onResendCode} style={styles.resendButton}> 
                    <Text style={{color: "#367CE5"}}> Resend Code</Text>
                </TouchableOpacity>
            </View>

        </View>
      </TouchableWithoutFeedback>
    )
}

export default Verification

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
    marginBottom: 1.5 * vh,
  },
  input: {
    width: "80%",
    height: 5 * vh,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 2 * vw,
    marginBottom: 1.5 * vh,
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
