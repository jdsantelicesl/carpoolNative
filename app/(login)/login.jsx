// Page 1
// Landing Page 
// Inputs email for access token
// Caching: Skips Login & Verification & Credentials if Access Token found in Cache
// TODO: Implement Cache
import { StyleSheet, Dimensions, Text, View, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native'
import React, {useState, useEffect} from 'react'

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

// @params
// onSendCode : func
const Login = ({ onSendCode }) => {
	const [email, setEmail] = useState('');

	const handleSendCode = () => {
		if (onSendCode) {
			onSendCode(email); // Call the onSendCode function with email
		}
	};

  	return (
		<View style={styles.container}>
				<StatusBar barStyle={"dark-content"}/>
				{/* App Logo */}
				<View style={styles.logoContainer}>
					<Image style={styles.logo} source={require("../../assets/images/applogo-removebg.png")} />
				</View>

				<Text style={styles.title}>Need a ride?</Text>

				<TextInput
					style={styles.input}
					placeholder="Email@school.edu"
					value={email} // Controlled component
					onChangeText={setEmail}
					placeholderTextColor="#888"
					keyboardType="email-address"
				/>

				<TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={!email}>
					<Text style={styles.buttonText}>SEND CODE</Text>
				</TouchableOpacity>
		</View>
		);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 5 * vw,
		marginTop: -10 * vh,
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
