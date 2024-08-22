// Page 1
// Landing Page 
// Inputs email for access token
// Caching: Skips Login & Verification & Credentials if Access Token found in Cache
// TODO: Implement Cache
import { StyleSheet, Dimensions, Text, View, TextInput, TouchableOpacity,
		 Image, StatusBar, TouchableWithoutFeedback, Keyboard} from 'react-native'
import React, {useState, useEffect} from 'react'

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

// @params
// onSendCode : func
const Login = ({ lastEmail, passEmail }) => {
	const [email, setEmail] = lastEmail ? useState(lastEmail) : useState('');

	const handleSetEmail = () => {
			passEmail(email); // Call the onSendCode function with email
	};

  	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
		<View style={styles.container}>
				<StatusBar barStyle={"dark-content"}/>
				{/* App Logo */}
				<View style={styles.logoContainer}>
					<Image style={styles.logo} source={require("../../assets/images/applogo-leaf.png")} />
				</View>

				<Text style={styles.title}>Need a ride?</Text>

				<TextInput
					style={styles.input}
					placeholder="Enter your school email (.edu)"
					value={email} // Controlled component
					onChangeText={setEmail}
					placeholderTextColor="#888"
					keyboardType="email-address"
					/>

				<TouchableOpacity style={styles.button} onPress={handleSetEmail} disabled={!email}>
					<Text style={styles.buttonText}>Continue</Text>
				</TouchableOpacity>
		</View>
		</TouchableWithoutFeedback>
		);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 5 * vw,
		marginTop: -20 * vh,
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
});

export default Login;
