import React, { useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Dimensions, Animated, TextInput, Alert } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import MapScreen from './MapScreen';
// panResponder docs: https://reactnative.dev/docs/panresponder
// react-native-modal docs: https://github.com/react-native-modal/react-native-modal
const { height, width } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const SlideUpComponent = () => {
	const [isModalVisible, setModalVisible] = useState(false);
	const pan = useState(new Animated.ValueXY())[0];
	const [origin, setOrigin] = useState("");

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	const handleConfirm = () =>{
		Alert.alert("Touched confirm");
	}


	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => toggleModal()}>
				<FontAwesome6 name="map-pin" size={24} color="#6E6B6B" style={styles.mapPin} />
			</TouchableOpacity>
		<Modal
			isVisible={isModalVisible}
			onBackdropPress={toggleModal}
			onBackButtonPress={toggleModal}

			// Disabled Swipe, prioritizing figma user flow, figure out swipe later
			
			// swipeDirection= "down"
			// swipeThreshold={500}
			// onSwipeComplete={toggleModal}
			// propagateSwipe={true}
			animationInTiming = {100}
			animationIn="fadeIn"
			animationOut="fadeOut"
			style={styles.modal}
		>
			<View style={styles.mapContainer}>
				<MapScreen/>
			</View>
			
			<Animated.View style={[styles.modalContent, { transform: [{ translateY: pan.y }] }]}>
				<TouchableOpacity onPress={toggleModal}>
					{/* <Text style={styles.closeText}>Close</Text> */}
					<FontAwesome6 name="circle-arrow-left" size={24} color="#000000" style={styles.xIcon} />
				</TouchableOpacity>
				<Text style={styles.subTitle}>Set your origin</Text>
				<Text style={styles.subSubTitle}>Drag map to move pin</Text>
				<Text style={styles.subSubTitle}>_________________________</Text>
				<View style={styles.inputWrapper}>
					<FontAwesome6 name="location-dot" size={24} color="#000000" style={styles.locDotIcon} />
					<TextInput
						style={styles.locInput}
						placeholder="Current..."
						placeholderTextColor="grey"
						value={origin} 
						// Future changes:
						// When typed in a certain place, query a list of possible places,
						// Pan the map to location which the user puts
						onChangeText={setOrigin}
					/>
					<TouchableOpacity onPress={() => setOrigin("")}>
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
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
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
        marginHorizontal: 7 * vw,
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
});

export default SlideUpComponent;
