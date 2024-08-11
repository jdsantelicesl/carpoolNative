import React, { useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Dimensions, Animated, TextInput, Alert } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import MapScreen from '../.././components/map/MapScreen'
import { useNavigation } from 'expo-router';
import OriginSlideUp from '../../components/map/OriginSlideUp';
import DestinationSlideUp from '../../components/map/DestinationSlideUp';
// panResponder docs: https://reactnative.dev/docs/panresponder
// react-native-modal docs: https://github.com/react-native-modal/react-native-modal
const { height, width } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const LocFindSlideUp = () => {
	const [isModalVisible, setModalVisible] = useState(true);
	const pan = useState(new Animated.ValueXY())[0];
	const [originText, setOriginText] = useState("");
	const [destinationText, setDestinationText] = useState("");
	
	const [originLat, setLat] = useState(null);
	const [originLong, setLong] = useState(null);
	
	const handleChangeText = () => {
		// Make this refer to Workflow #2, so it could let them query.
		};
		
	// When pressed either origin or destination box, calls this function
	const returnList = (input) =>{
		// input: originText | deestinationText
		// Makes sure the list returns the location/destination text
		}
			
	const toggleModal = () => {
		setModalVisible(!isModalVisible);
		};
	
	// Used to navigate to another tab
	const navigation = useNavigation();
	const handleChangeTab = (tab) => {
		navigation.navigate(tab)
	}
				
	return (
		<View style={styles.container}>
			<MapScreen 
			onLatChange = {setLat}
			onLongChange = {setLong}/>
			<Modal
				isVisible={isModalVisible}
				backdropOpacity={0}
				//onBackdropPress={toggleModal}
				onBackButtonPress={toggleModal}
				swipeDirection= "down"
				swipeThreshold={500}
				//onSwipeComplete={toggleModal}
				avoidKeyboard={true}
				propagateSwipe={true}
				animationInTiming={100}
                coverScreen={false}
				animationIn="fadeIn"
				animationOut="fadeOut"
				style={styles.modal}
			>
				<Animated.View style={[styles.modalContent, { transform: [{ translateY: pan.y }] }]}>
					<TouchableOpacity onPress={() => handleChangeTab("ride")}>
						{/* <Text style={styles.closeText}>Close</Text> */}
						<FontAwesome6 name="circle-arrow-left" size={24} color="#000000" />
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
                                onChangeText={() => setOriginText()}
                                onPressIn={() => returnList(originText)}
								/>
						</View>
							<OriginSlideUp />
                        <View style={styles.inputContent}>
                            <FontAwesome6 name="location-dot" size={24} color="#000000" style={styles.locDotIcon} />
                            <TextInput
                                style={styles.locInput}
                                placeholder={"Where to?"}
                                placeholderTextColor="grey"
                                value={destinationText}
                                onChangeText={() => setDestinationText()}
                                onPressIn= {() => returnList(destinationText)}
                            />
                        </View>
							<DestinationSlideUp />
					</View>

                    <View style={styles.locFindListContainer}>
						<View style={styles.locFindListContent}>
                        	<Text> LocFind Query Container </Text>
						</View>
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
		marginTop: 3.5 * vh,
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
        backgroundColor: "red",
        flexDirection: "column",
        marginTop: 2 * vh,
    },
    locFindListContent: {

    },
});

export default LocFindSlideUp;
