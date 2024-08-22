import React, { useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Dimensions, Animated, TextInput, Alert, StatusBar, } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import MapScreen from './MapScreen'
import LocFind from './locFind';

import apiClient from '../../components/utilities/apiClient';
import { getUserData } from '../../components/utilities/cache';

// panResponder docs: https://reactnative.dev/docs/panresponder
// react-native-modal docs: https://github.com/react-native-modal/react-native-modal
const { height, width } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const LocFindSlideUp = ({ setRenderMap, setDest, setFrom }) => {
	const [isModalVisible, setModalVisible] = useState(true);
	const [isConfVisible, setConfVisible] = useState(false);
	const pan = useState(new Animated.ValueXY())[0];

	const [originText, setOriginText] = useState("");
	const [destinationText, setDestinationText] = useState("");
	const [query, setQuery] = useState("")

	// need this data for ride and dont want to have to edit others
	const [originShort, setOriginShort] = useState("");
	const [destShort, setDestShort] = useState("");

	const [originLat, setOriginLat] = useState(null);
	const [originLong, setOriginLong] = useState(null);

	const [destLat, setDestLat] = useState(null);
	const [destLong, setDestLong] = useState(null);

	// when user clicks out of TextInput
	const [getFirst, setGetFirst] = useState(false);

	const url = process.env.EXPO_PUBLIC_API_URL + "/ride/getCoordinates";
	
	const confirmRoute = () => {
		setDest({
			name: destinationText,
			lat: destLat,
			long: destLong,
			shortName: destShort
		});
		setFrom({
			name: originText,
			lat: originLat,
			long: originLong,
			shortName: originShort
		});
		setModalVisible(true);
		setConfVisible(false);
		setRenderMap(false);
	}

	// handles location selection from LocFind
	const locClick = (loc_id, loc_name, short_name) => {
		// this variable is used to store wether we are editing origin or dest
		let originOrDest = ""
		// Check if we are referring to origin or dest
		if (query == originText) {
			setOriginText(loc_name);
			setOriginShort(short_name);
			setQuery("");
			originOrDest = "origin";
		}
		else if (query == destinationText) {
			setDestinationText(loc_name);
			setDestShort(short_name);
			setQuery("");
			originOrDest = "dest"
		}

		encode_id = encodeURIComponent(loc_id)
		fetch_url = `${url}?placeId=${encode_id}`
		
		apiClient.get(fetch_url)
			.then(response => {
				const get_lat = response.data.location.latitude;
				const get_long = response.data.location.longitude;

				if (originOrDest === "origin") {
					setOriginLat(get_lat);
					setOriginLong(get_long);

					if (destLat && destLong) {
						setModalVisible(false);
						setConfVisible(true);
					}
				}
				else if (originOrDest === "dest") {
					setDestLat(get_lat);
					setDestLong(get_long);

					if (originLat && originLong) {
						setModalVisible(false);
						setConfVisible(true);
					}
				}
				else {
					throw new Error("query is editing neither origin or dest");
				}
				setGetFirst(false);
			})
			.catch(error => {
				console.log("error getting coordinates: ", error);
			});
	}

	return (
		<View style={styles.container}>
			<StatusBar barStyle="dark-content" />
			<MapScreen origin={{ lat: originLat, long: originLong }} dest={{ lat: destLat, long: destLong }} />

			<Modal
				isVisible={isModalVisible}
				backdropOpacity={0}
				swipeDirection="down"
				swipeThreshold={500}
				avoidKeyboard={true}
				propagateSwipe={true}
				animationInTiming={100}
				coverScreen={false}
				animationIn="fadeIn"
				animationOut="fadeOut"
				style={styles.modal}
			>
				<Animated.View style={[styles.modalContent, { transform: [{ translateY: pan.y }] }]}>
					<TouchableOpacity
						style={{ marginRight: 80 * vw }}
						onPress={() => setRenderMap(false)}>
						<FontAwesome6 name="circle-arrow-left" size={30} color="#000000" />
					</TouchableOpacity>

					<Text style={styles.subTitle}>Organize your trip</Text>

					<View style={styles.inputWrapper}>
						<View style={styles.inputContent}>
							<FontAwesome6 name="location-dot" size={24} color="#000000" style={styles.locDotIcon} />
							<TextInput
								style={styles.locInput}
								placeholder={"Where from?"}
								placeholderTextColor="grey"
								value={originText}
								onChangeText={(data) => { setOriginText(data); setQuery(data) }}
								onBlur={() => setGetFirst(true)}
							/>
						</View>
						<View style={styles.inputContent}>
							<FontAwesome6 name="location-dot" size={24} color="#000000" style={styles.locDotIcon} />
							<TextInput
								style={styles.locInput}
								placeholder={"Where to?"}
								placeholderTextColor="grey"
								value={destinationText}
								onChangeText={(data) => { setDestinationText(data); setQuery(data) }}
								onBlur={() => setGetFirst(true)}
							/>
						</View>
					</View>

					<View style={styles.locFindListContainer}>
						<LocFind query={query} handleLocClick={locClick} getFirst={getFirst}/>
					</View>

				</Animated.View>

			</Modal>


			<Modal
				isVisible={isConfVisible}
				backdropOpacity={0}
				swipeDirection="down"
				swipeThreshold={500}
				avoidKeyboard={true}
				propagateSwipe={true}
				animationInTiming={100}
				coverScreen={false}
				animationIn="fadeIn"
				animationOut="fadeOut"
				style={styles.modal}
			>
				<Animated.View style={[styles.confRoute, { transform: [{ translateY: pan.y }] }]}>
					<TouchableOpacity
						style={{ marginRight: 80 * vw }}
						onPress={() => { setModalVisible(true); setConfVisible(false) }}>
						<FontAwesome6 name="circle-arrow-left" size={30} color="#000000" />
					</TouchableOpacity>

					<View style={styles.submitContainer}>
						<TouchableOpacity style={styles.submitButton} onPress={confirmRoute}>
							<Text style={styles.submitText}>Confirm Route</Text>
						</TouchableOpacity>
					</View>
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
		marginTop: -1.5 * vh,
	},
	bodyText: {
		color: "black",
		textAlign: "center",
		fontSize: 17,
	},
	subBodyText: {
		color: "#6E6B6B",
		textAlign: "center",
		fontSize: 15,
	},
	modal: {
		justifyContent: 'flex-end',
		margin: 0,
	},
	modalContent: {
		height: height * 0.8,
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
		flexDirection: 'column',
		backgroundColor: '#D9D9D9',
		borderRadius: 5 * vw,
		justifyContent: "center",
		alignItems: "center",
		width: 70 * vw,
		height: 12 * vh,
		// Bro how do you center this View
		marginTop: 2.5 * vh,
		marginHorizontal: 4 * vw,
	},
	inputContent: {
		flexDirection: 'row',
		flex: 1,
	},
	locDotIcon: {
		marginTop: 3 * vw,
		marginLeft: 4 * vw,
	},
	mapPin: {
		marginTop: 3 * vw,
		marginRight: 4 * vw,
	},
	locInput: {
		flex: 1,
		height: 6.5 * vh,
		fontSize: 2.5 * vh,
		fontWeight: "bold",
		color: "black",
		paddingLeft: 3 * vw,
	},
	locFindListContainer: {
		flexDirection: "column",
		marginTop: 2 * vh,
	},
	confRoute: {
		height: height * .16,
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
	submitButton: {
		backgroundColor: '#2E74DD',
		paddingHorizontal: 1 * vh,
		paddingVertical: 1.5 * vh,
		borderRadius: 6 * vw,
		marginHorizontal: 20 * vw,
	},
	submitText: {
		color: 'black',
		textAlign: 'center',
		fontSize: 2.5 * vh,
		fontWeight: 'bold',
	},
});

export default LocFindSlideUp;
