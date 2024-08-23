import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Image, Platform} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { FontAwesome6 } from '@expo/vector-icons';
import Rating from './rating';

import apiClient from '../../components/utilities/apiClient';
import { getUserData } from '../../components/utilities/cache';
import { format } from 'date-fns/fp/format';
// Refer to: https://github.com/FaridSafi/react-native-gifted-chat
// _id: 2 is self, _id: 1 is other
const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const convertDay = (day) => {
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const adjustedDay = (day - 1 + 7) % 7;
	return days[adjustedDay];
};

const Chat = ({ disableComposer, exitChat, chatData, origin, destination, arrival, day, rideId }) => {
	// Destructure the onClose and chatData props

	// Need this to render chats. Pulling from cache is async
	const [clientId, setId] = useState(null);

	const dayOfWeek = convertDay(day);
	const hour = (Math.floor(arrival) > 12) ? (Math.floor(arrival) - 12) : Math.floor(arrival);
	const roundMin = Math.round((arrival - Math.floor(arrival)) * 60);
	const minute = roundMin < 10 ? `0${roundMin}` : roundMin;
	const amPm = (Math.floor(arrival) >= 12) ? "pm" : "am";
	const formattedTime = `${hour}:${minute}${amPm}`;

	const url = process.env.EXPO_PUBLIC_API_URL; // placeholder

	useEffect(() => {
		const loadId = async () => {
			const user_id = await getUserData("clientId");
			setId(user_id);
		}

		loadId();
	}, [])

	const reqStatus = (state, ownerId) => {
		sendUrl = url + "/message/joinReq";
		sendData = {
			rideId: rideId,
			clientId: ownerId,
			status: state
		};
		apiClient.post(sendUrl, sendData)
			.then(response => {
				alert("action done");
			})
			.catch(error => {
				alert("error");
				console.log("error with ride request: ", error);
			});
	}

	const CustomBubble = (props) => {
		const mssgType = props.currentMessage.type;
		const mssgStatus = props.currentMessage.status;
		const usrId = props.currentMessage.user._id;
		// all we need to do to convert request custom message to user's is change background to the blue color. 
		// Message is moved to the right by default. 

		return (
			<>
				{/** Conditionally either render bubble for messages or a custom message for requests */}
				{!(mssgType === "request") ? (
					<Bubble
						{...props}
						wrapperStyle={{
							right: {
								backgroundColor: '#367CE5', // Blue background for the user's messages
							},
							left: {
								backgroundColor: '#ECECEC', // Light grey background for received messages
							},
						}}
						textStyle={{
							right: {
								color: 'white', // Text color for the user's messages
							},
							left: {
								color: '#000', // Text color for received messages
							},
						}}
					/>
				) :

					(
						<View style={[reqStyles.bubble, (usrId == clientId) && ({ backgroundColor: '#2E74DD' })]}>
							<View style={reqStyles.userCard}>
								<FontAwesome6 name="user-graduate" size={4 * vh} color="black" />
								<View style={reqStyles.userDetails}>
									<Text style={reqStyles.name}> {props.currentMessage.user.name} </Text>
									<Rating style={reqStyles.rating} size={2 * vh} rating={4.5} total={10} />
								</View>
							</View>
							<Text style={reqStyles.text}> {props.currentMessage.text} </Text>
							{(mssgStatus === "open") ? (<View style={reqStyles.buttonCont}>

								<TouchableOpacity style={[reqStyles.buttons, { backgroundColor: '#2E74DD' }]} onPress={() => reqStatus(true, usrId)}>
									<Text style={reqStyles.buttonText}>Accept</Text>
								</TouchableOpacity>
								<TouchableOpacity style={[reqStyles.buttons, { backgroundColor: '#ED0800' }]} onPress={() => reqStatus(false, usrId)}>
									<Text style={reqStyles.buttonText}>Reject</Text>
								</TouchableOpacity>
							</View>) :
								(<View style={reqStyles.buttonCont}>
									<View style={[reqStyles.buttons, { backgroundColor: "#6d6d6d", width: 40 * vw, borderRadius: 1 * vh }]}>
										<Text style={reqStyles.buttonText}>{mssgStatus}</Text>
									</View>
								</View>)
							}
						</View>
					)
				}
			</>
		);
	};

	// Convert chatData to GiftedChat format
	const formatChatData = async (data) => {
		const formattedData = await Promise.all(
			data.map(async (item) => {
				let user_pfp;

				try {
					const response = await apiClient.get(url + `/user/getUser?client_id=${item.clientId}`)
					user_pfp = response.data.pfp;
				} catch (error) {
					console.error(`Error getting pfp for user ${item.clientId}:`, error);
					user_pfp = null;
				}

				return {
					_id: item._id || Math.random().toString(),
					type: item.type,
					status: item.status,
					text: item.content,
					createdAt: new Date(item.date),
					user: {
						_id: item.clientId,
						name: item.name,
						avatar: user_pfp,
					},
				};
			})
		);
		console.log("formattedData: ", formattedData)
		return formattedData;
	};

	const [messages, setMessages] = useState([]);

	useEffect(() => {

		// Format and set messages when chatData changes
		if (Array.isArray(chatData)) {
			const loadChat = async () => {
				const formattedChatData = await formatChatData(chatData);
				setMessages(formattedChatData);
			}
			loadChat();
		}
		// Hack: display developer text
		else {
			setMessages([
				{
					_id: 1,
					text: "Drive smart, stay sharp, and let's turn every ride into an A+ experience!",
					createdAt: new Date(),
					user: {
						_id: 1,
						name: 'Cracked Developers',
						avatar: require("../../assets/images/applogo-fill-leaf.png"),
					},
				},
				{
					_id: 2,
					text: "Remember, we're not just here to get you to class; we're here to ensure you make the grade in safe travels.",
					createdAt: new Date(),
					user: {
						_id: 1,
						name: 'Cracked Developers',
						avatar: require("../../assets/images/applogo-fill-leaf.png"),
					},
				},
				{
					_id: 3,
					text: "Buckle up and get ready to embark on a journey where safety is our top priority—think of us as your academic road safety patrol.",
					createdAt: new Date(),
					user: {
						_id: 1,
						name: 'Cracked Developers',
						avatar: require("../../assets/images/applogo-fill-leaf.png"),
					},
				},
				{
					_id: 4,
					text: "Welcome aboard our .edu exclusive carpool ride-sharing app!",
					createdAt: new Date(),
					user: {
						_id: 1,
						name: 'Cracked Developers',
						avatar: require("../../assets/images/applogo-fill-leaf.png"),
					},
				},
			]);
		}
	}, [chatData]);

	useEffect(() => {
		// Define the polling interval
		const interval = 5000; // 5 seconds
		const sendRideId = encodeURIComponent(rideId)

		// Function to fetch data from the server
		const fetchData = async () => {
			try {
				const response = await apiClient.get(url + `/message/getSpecific?ride_id=${sendRideId}`);
				const formattedChatData = await formatChatData(response.data)
				setMessages(formattedChatData);
			} catch (err) {
				setError(err);
			}
			console.log("messages array: ", messages);
		};

		// Start polling
		const pollingInterval = setInterval(fetchData, interval);

		// Clean up function to clear the interval
		return () => clearInterval(pollingInterval);
	}, []);

	// This appends the new message 
	const onSend = useCallback((newMessages) => {
		// Append new messages with correct user ID
		// This does render new user messages when sent but it is server sided
		// chatData is passed in as prop to be stored in messages
		// Therefore we need to update chatData itself, passed by parent "messages.jsx"
		setMessages(previousMessages =>
			GiftedChat.append(previousMessages, {
				...newMessages[0],
				user: {
					...newMessages[0].user,
					_id: clientId, // 2 is User ID, it renders as Self
				}
			}),
		);

		const sendUrl = url + "/message/send";
		const sendData = {
			messageType: "message",
			content: newMessages[0].text,
			rideId: rideId,
			clientId: clientId
		};

		apiClient.post(sendUrl, sendData)
			.then(response => {
			})
			.catch(error => {
				alert("error sending message");
				console.log("error sending message: ", error);
			})

		// Need to implement post request to append new messages
	}, [messages]);

	return (
		<>
			<StatusBar barStyle={"dark-content"} />
			<View style={styles.container}>
				{/* Back Button */}
				<TouchableOpacity onPress={exitChat} style={styles.exitChat}>
					<FontAwesome6 name="arrow-left" size={3 * vh} />
				</TouchableOpacity>

				{/* Ride Information on Top */}
				<View style={styles.location}>
					<Text style={{ fontSize: 3 * vh }}>
						{origin} <Text></Text>
						<FontAwesome6 name="arrow-right" size={2 * vh} /> <Text></Text>
						{destination}
					</Text>
				</View>
				<View style={styles.location}>
					<Text style={{ fontSize: 2 * vh }}>Arrive {dayOfWeek} by {formattedTime}</Text>
				</View>

				{/* Chat Interface */}
				<GiftedChat
					disableComposer={disableComposer}
					renderBubble={props => <CustomBubble {...props} />}
					renderUsernameOnMessage={true}
					showuserAvatar={true}
					alwaysShowSend={!disableComposer}
					messages={messages}
					onSend={messages => onSend(messages)}
					user={{
						_id: clientId, // Set the current user ID
					}}
					bottomOffset={9 * vh} // Fix spacing keyboard
				/>
			</View>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	exitChat: {
		marginTop: 5 * vh,
		padding: 10,
		borderRadius: 5,
	},
	location: {
		flexDirection: "row",
		justifyContent: "center",
		alignContent: "center",
	},
});

const reqStyles = StyleSheet.create({
	bubble: {
		width: 64 * vw,
		paddingVertical: 1.2 * vh,
		paddingHorizontal: 3 * vw,
		backgroundColor: "#D9D9D9",
		borderRadius: 2 * vh,
	},
	userCard: {
		flexDirection: 'row',
		marginHorizontal: 1 * vw,
		marginVertical: 0.5 * vh,
	},
	userDetails: {
		marginLeft: 2 * vw
	},
	rating: {
		marginLeft: 1.6 * vw
	},
	name: {
		fontWeight: 'bold',
		fontSize: 2 * vh,
		textAlign: 'center'

	},
	text: {
		marginTop: 0.5 * vh,
		fontSize: 2 * vh,

	},
	buttonCont: {
		flexDirection: "row",
		justifyContent: 'center',
		alignItems: 'center'

	},
	buttons: {
		justifyContent: 'center',
		alignItems: 'center',

		width: 26 * vw,
		height: 4 * vh,
		borderRadius: 2 * vh,
		marginVertical: 0.5 * vh,
		marginHorizontal: 1.5 * vw,
		marginTop: 1.2 * vh,
		backgroundColor: 'red',
	},
	buttonText: {
		color: 'white',
		textAlign: "center",
		fontWeight: 'bold'
	},
});

export default Chat;
