import React, { useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Dimensions, Animated, TextInput, Alert } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import MapScreen from './MapScreen';
import axios from 'axios';

// panResponder docs: https://reactnative.dev/docs/panresponder
// react-native-modal docs: https://github.com/react-native-modal/react-native-modal
const { height, width } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;
const url = process.env.EXPO_PUBLIC_API_URL + "/ride/getRoute"

const DestinationSlideUp = ({originLat, originLong, destinationLat, destinationLong} ) => {
	const [isModalVisible, setModalVisible] = useState(false);
	const pan = useState(new Animated.ValueXY())[0];
	const [originText, setOriginText] = useState("");
	[destinationLat, setLat] = useState();
	[destinationLong, setLong] = useState();
	
	console.log("")
	console.log("Origin: " + originLat, originLong);
	console.log("Destination: " + destinationLat, destinationLong);

	
	const handleChangeText = () => {
		// Make this refer to Workflow #2, so it could let them query.
	};
	
	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};
	
	const handleConfirm = () =>{

		const data = {
			origin: {lat: originLat, long: originLong},
			destination: {lat: destinationLat, long: destinationLong},
		}

		axios.post(url, data)
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
	};


	return (
		<View>
			<TouchableOpacity>
				<FontAwesome6 name="map-pin" size={24} color="#000000" style={styles.mapPin} onPress={toggleModal} />
			</TouchableOpacity>
		<Modal
			isVisible={isModalVisible}
			onBackdropPress={toggleModal}
			onBackButtonPress={toggleModal}
			animationInTiming = {100}
			animationOutTiming = {100}
			animationIn="fadeIn"
			animationOut="fadeOut"
			avoidKeyboard={true}
			// coverScreen={false}
			style={styles.modal}
		>
			<View style={styles.mapContainer}>
				<MapScreen
				onLatChange={setLat}
				onLongChange={setLong}
				/>
			</View>
			
			<Animated.View style={[styles.modalContent, { transform: [{ translateY: pan.y }] }]}>
				<TouchableOpacity onPress={toggleModal}>
					<FontAwesome6 name="circle-arrow-left" size={24} color="#000000" style={styles.xIcon} />
				</TouchableOpacity>
				<Text style={styles.subTitle}>Set your destination</Text>
				<Text style={styles.subSubTitle}>Drag map to move pin</Text>
				<Text style={styles.subSubTitle}>_________________________</Text>
				<View style={styles.inputWrapper}>
					<FontAwesome6 name="location-dot" size={24} color="#000000" style={styles.locDotIcon} />
					<TextInput
						style={styles.locInput}
						placeholder= "Destination"
						placeholderTextColor="grey"
						value={originText} 
						onChangeText={() => handleChangeText()}
					/>
					<TouchableOpacity onPress={() => setOriginText("")}>
						<FontAwesome6 name="xmark" size={24} color="#000000" style={styles.xIcon} />
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={() => handleConfirm()}>
					<View style={styles.confirmButton}>
						<Text style={styles.confirmText}>Confirm</Text>
					</View>
				</TouchableOpacity>
			</Animated.View>
		</Modal>
		
		</View>
	);
};

const styles = StyleSheet.create({
	mapPin: {
		marginLeft: 10 * vw,
	},
	textInput: {
		height: 40,
		borderColor: 'gray',
		borderWidth: 1,
		width: '80%',
		paddingHorizontal: 10,
	},
	closeText: {
		color: 'blue',
		textAlign: 'left',
	},
	subTitle: {
        color: "#000000",
		justifyContent: "center",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
		marginTop: -1 * vh,
    },
	subSubTitle: {
        color: "#6E6B6B",
        textAlign: "center",
        fontSize: 17,
		marginBottom: -1 *vh,
    },
	mapContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	modalContent: {
		height: height * 0.37,
		backgroundColor: 'white',
		padding: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 8,
		elevation: 5,
	},
	inputWrapper: {
		flexDirection: 'row',
        backgroundColor: '#D9D9D9',
        borderRadius: 5 * vw,
		justifyContent: "center",
		alignItems: "center",
		width: 75 * vw,
		height: 10 * vh,
		// Bro how do you center this View
		marginTop: 3.5 * vh,
		marginHorizontal: 7 * vw,
    },
	locDotIcon: {
        marginLeft: 4 * vw,
    },
	xIcon:{
		marginRight: 5 * vw,
	},
	locInput: {
        flex: 1,
        height: 6.5 * vh,
        fontSize: 2.5 * vh,
        fontWeight: "bold",
        color: "black",
        paddingLeft: 3 * vw,
    },
	confirmButton: {
		backgroundColor: '#D9D9D9',
        borderRadius: 5 * vw,
		width: 75 * vw,
		height: 4 * vh,
        marginHorizontal: 8 * vw,
		marginTop: 2 * vh,
	},
	confirmText: {
		color: "#6E6B6B",
		justifyContent: "center",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
		marginTop: 0.5 * vh,
	},
	mapPin : {
		marginLeft: 55 * vw,
		marginTop: -4 * vh,
	},
});

export default DestinationSlideUp;
