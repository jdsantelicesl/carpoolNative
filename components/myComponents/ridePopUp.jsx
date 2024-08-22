// Being used in Profile page as an extension to rideObject.
// Modal conditionally renders if rideObject's onRideClick is triggered 
// Refer to './rideObject' and '../../app/(tabs)/profile.jsx' on how it is implemented

import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Alert, Image } from 'react-native';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';

import apiClient from '../../components/utilities/apiClient';
import { getUserData } from '../../components/utilities/cache';
import UserProfilePopUp from './userProfilePopUp';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const convertDay = (day) => {
	const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const adjustedDay = (day - 1 + 7) % 7;
	return days[adjustedDay];
};

const RidePopUp = ({ visible, onClose, rideData }) => {

	const url = process.env.EXPO_PUBLIC_API_URL; // placeholder

	if (!rideData) return null;

	// Takes in JSON object and store
	const { origins, destination, arrival, members, day } = rideData;
	// Had problems getting the origins.short earlier, it is because in json object name is "origins" instead of "origin"
	// Need to keep in mind that "origins" is the key name from backend

	const dayOfWeek = convertDay(day);

	const hour = (Math.floor(arrival) > 12) ? (Math.floor(arrival) - 12) : Math.floor(arrival);
	const roundMin = Math.round((arrival - Math.floor(arrival)) * 60);
	const minute = roundMin < 10 ? `0${roundMin}` : roundMin;
	const amPm = (Math.floor(arrival) >= 12) ? "pm" : "am";
	const formattedTime = `${hour}:${minute}${amPm}`;

	const leaveRide = async () => {
		try {
			const user_id = await getUserData("clientId")
			const send_userId = encodeURIComponent(user_id);
			const send_rideId = encodeURIComponent(rideData._id);
			const send_url = url + `/ride/delete?client_id=${send_userId}&ride_id=${send_rideId}`;

			await apiClient.get(send_url)

			alert("Left Ride");
			onClose();
		}
		catch {
			alert("Could not leave ride");
			console.log("error leaving ride: ", error);
			onClose();
		}

	}

	const [renderProfile, setRenderProfile] = useState(false);
	const [user, setUser] = useState(null);

	const handleUserClick = (userData) => {
		setUser(userData);
		setRenderProfile(true);
	}

	const renderUser = ({ item }) => (
		<TouchableOpacity style={styles.userItem} onPress={() => handleUserClick(item)}>
			{ item.pfp ? (<Image style={styles.profile} source={{ uri: item.pfp }} />)
				: (<FontAwesome name="user-circle" size={24} style={styles.icon} />) }
			<Text style={styles.userName}>{item.name}</Text>
		</TouchableOpacity>
	);

	return (

		<Modal
			animationType="fade"
			transparent={true}
			visible={visible}
			onRequestClose={onClose}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<View style={styles.content}>

						{/* Displaying Location */}
						<View style={styles.locationContainer}>
							<Text style={styles.locationText}>
								{origins.short} <Text> </Text>
								<FontAwesome6 name="arrow-right" size={20} color="black" style={styles.arrow} /> <Text> </Text>
								{destination.short}
							</Text>
						</View>

						{/* Display Arrival & Day */}
						<Text style={styles.timeText}>Every {dayOfWeek} at {formattedTime}</Text>

						{/* Displaying Ride Members */}
						<Text style={styles.membersTitle}>Ride Members:</Text>
						<FlatList
							data={members}
							renderItem={renderUser}
							keyExtractor={(item) => item.id.toString()}
							style={styles.userList}
						/>

					</View>

					{/* Buttons */}
					<View style={styles.buttonContainer}>

						{/* Cancel Button */}
						<TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>

						{/* Leave Button */}
						<TouchableOpacity
							style={[styles.button, styles.leaveButton]}
							onPress={() => leaveRide()}
						>
							<Text style={styles.buttonText}>Leave</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>

			{/* User Profile Pop Up,
                Grab data from user db and convert. */}
			{renderProfile && <UserProfilePopUp
				userData={user}
				visible={renderProfile}
				onClose={() => setRenderProfile(false)}
			/>}

		</Modal>
	);
};

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalView: {
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 3 * vh,
		width: 90 * vw,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 2 * vh,
	},
	headerText: {
		fontSize: 6 * vw,
		fontWeight: 'bold',
		color: '#007AFF',
	},
	content: {
		marginBottom: 2 * vh,
	},
	locationContainer: {
		marginTop: 1 * vh,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	locationText: {
		fontSize: 5 * vw,
		fontWeight: 'bold',
		textAlign: "center",
	},
	arrow: {
		marginHorizontal: 2 * vw,
	},
	timeText: {
		fontSize: 4 * vw,
		textAlign: 'center',
		marginBottom: 2 * vh,
		color: "#6E6B6B"
	},
	membersTitle: {
		fontSize: 4.5 * vw,
		fontWeight: 'bold',
		marginBottom: 1 * vh,
	},
	userList: {
		maxHeight: 20 * vh,
	},
	userItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 1 * vh,
	},
	profile: {
		width: 3 * vh,
		height: 3 * vh,
		borderRadius: 1.5 * vh,
		borderColor: "black",
		borderWidth: 0.1 * vw
	},
	userName: {
		fontSize: 4 * vw,
		marginLeft: 2 * vw,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	button: {
		borderRadius: 10,
		padding: 1.5 * vh,
		elevation: 2,
		flex: 1,
		marginHorizontal: 1 * vw,
	},
	cancelButton: {
		backgroundColor: '#007AFF',
	},
	leaveButton: {
		backgroundColor: '#FF3B30',
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 4 * vw,
	},
});

export default RidePopUp;
