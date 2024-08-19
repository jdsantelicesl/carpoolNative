import React, {useEffect , useState} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Login from './login'; // Adjust the import path if needed
import Verification from './verification'; // Adjust the import path if needed
import Credentials from './credentials'; // Adjust the import path if needed

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

	const [sentCode, setSentCode] = useState(false);
	const [verified, setVerified] = useState(false);
	const [accessToken, setAccessToken] = useState(null);
	
	const onSendCode = () => {
		console.log("Requested for Code")
		setSentCode("Verification")
	}

	const onResendCode = () => {
		console.log("Resend code requested");
	}

	const onAccessTokenChange = (token) => {
		setVerified(true);
		setAccessToken(token);
		console.log(`Login attempted with Access Token: ${token}`);
	}

	const handleUserCredentials = (creds) => {
		console.log("User credentials set", creds);
		navigation.navigate('(tabs)');
	}

	return (
		
		<Stack.Navigator 
			screenOptions={{
				headerShown: false,
				transitionSpec: customTransitionSpec,
				cardStyleInterpolator: customCardStyleInterpolator,
			}}
		>
			{!sentCode && (
				<Stack.Screen name="Login"> 
					{(props) => <Login {...props} onSendCode={onSendCode} />}
				</Stack.Screen>
			)}

			{sentCode && !verified && (
				<Stack.Screen name="Verification"> 
					{(props) => <Verification {...props} 
									onBackPress={() => setSentCode(false)} 
									onResendCode={onResendCode} 
									onAccessTokenChange={(token) => {onAccessTokenChange(token)}}
									/>}
				</Stack.Screen>
			)}

			{verified && (
				<Stack.Screen name="Credentials"> 
					{(props) => <Credentials {...props} 
									onBackPress={() => setVerified(false)}
									setUserCredentials={(credentials) => handleUserCredentials(credentials)}

								/>}
				</Stack.Screen>
			)}
		</Stack.Navigator>
	);
};

export default LoginStack;
