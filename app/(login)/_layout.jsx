import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Login from './login'; // Adjust the import path if needed
import Verification from './verification'; // Adjust the import path if needed
import Credentials from './credentials'; // Adjust the import path if needed
import axios from 'axios';

import { saveUserData } from '../../components/utilities/cache';

const Stack = createStackNavigator();

// Just styling for navigating
const customTransitionSpec = {
	open: { animation: 'timing', config: { duration: 0 } },
	close: { animation: 'timing', config: { duration: 0 } },
};

const customCardStyleInterpolator = ({ current, next, layouts }) => {
	const translateX = current.progress.interpolate({
		inputRange: [0, 1],
		outputRange: [layouts.screen.width, 0],
	});
	const opacity = current.progress.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1],
	});

	return {
		cardStyle: {
			transform: [{ translateX }],
			opacity,
		},
	};
};

const LoginStack = () => {
	const navigation = useNavigation();

	const [email, setEmail] = useState(null);
	const [userData, setUserData] = useState(null);
	const [page, setPage] = useState("email");
	const [userId, setId] = useState(null);

	const handleEmailSubmit = (passEmail) => {
		setEmail(passEmail);
		console.log(passEmail);
		setPage("credentials");
	}

	const handleUserCredentials = (creds) => {
		setUserData(creds);
		console.log("creds: ", creds);

		const sendData = {
			name: creds.name,
			email: email,
			school: creds.school,
			bio: creds.bio
		};

		console.log("send data: ", sendData);

		const sendUrl = process.env.EXPO_PUBLIC_API_URL + "/user/createUser";
		axios.post(sendUrl, sendData)
			.then(response => {
				setId(response.data.id);
				console.log("new id: ", response.data.id);
				setPage("verify");
			})
			.catch(error => {
				alert("error creating user");
				console.log("error creating user: ", error);
				setPage("verify");
			});
	}

	const onSubmitCode = (code) => {
		const sendId = encodeURIComponent(userId);
		const sendUrl = process.env.EXPO_PUBLIC_API_URL + `/user/getRefresh?client_id=${sendId}&code=${code}`;

		axios.get(sendUrl)
			.then(response => {
				saveUserData("clientId", userId);
				saveUserData("token", response.data.accessToken);
				saveUserData("expiry", response.data.expiry);
				saveUserData("refresh", response.data.refreshToken);
				console.log("cached tokens", response.data);
				navigation.navigate('(tabs)');
			})
			.catch(error => {
				alert("error getting tokens");
				console.log("error fetching token: ", error);
			});
	}

	const onResendCode = () => {
		console.log("Resend code requested");
	}


	return (

		<Stack.Navigator
			screenOptions={{
				headerShown: false,
				transitionSpec: customTransitionSpec,
				cardStyleInterpolator: customCardStyleInterpolator,
			}}
		>
			{(page === "email") && (
				<Stack.Screen name="Login">
					{(props) => <Login {...props} lastEmail={email} passEmail={(email) => handleEmailSubmit(email)} />}
				</Stack.Screen>
			)}

			{(page === "credentials") && (
				<Stack.Screen name="Credentials">
					{(props) => <Credentials {...props}
						lastCreds={userData}
						onBackPress={() => setPage("email")}
						setUserCredentials={(credentials) => handleUserCredentials(credentials)}

					/>}
				</Stack.Screen>
			)}

			{(page === "verify") && (
				<Stack.Screen name="Verification">
					{(props) => <Verification {...props}
						onBackPress={() => setPage("credentials")}
						onResendCode={onResendCode}
						onSubmitCode={(code) => { onSubmitCode(code) }}
					/>}
				</Stack.Screen>
			)}
		</Stack.Navigator>
	);
};

export default LoginStack;
