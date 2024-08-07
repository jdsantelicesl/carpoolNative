import React, { useState } from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text, Dimensions, Animated } from 'react-native';
import Modal from 'react-native-modal';
import MapScreen from './MapScreen';
// panResponder docs: https://reactnative.dev/docs/panresponder
// react-native-modal docs: https://github.com/react-native-modal/react-native-modal
const { height } = Dimensions.get('window');

const SlideUpComponent = () => {
	const [isModalVisible, setModalVisible] = useState(false);
	const pan = useState(new Animated.ValueXY())[0];

	const toggleModal = () => {
		setModalVisible(!isModalVisible);
	};

	return (
		<View style={styles.container}>
		<Button
			style={styles.textInput}
			title="Open Map"
			onPress={toggleModal}
		/>
		<Modal
			isVisible={isModalVisible}
			onBackdropPress={toggleModal}
			onBackButtonPress={toggleModal}
			//swipeDirection="down"
			onSwipeComplete={toggleModal}
			animationIn="slideInUp"
			animationOut="slideOutDown"
			useNativeDriver={false}
			propagateSwipe={true}
			panResponderThreshold={0}
			// panResponder is not stated in modal docs but in react-native docs
			panResponder={{
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: Animated.event(
				[null, { dy: pan.y }],
				{ useNativeDriver: false }
			),
			onPanResponderRelease: (e, { dy }) => {
				if (dy > 150) {
				toggleModal();
				} else {
				Animated.spring(pan, {
					toValue: { x: 0, y: 0 },
					useNativeDriver: false,
				}).start();
				}
			},
			}}
			style={styles.modal}
		>
			<View style={styles.mapContainer}>
				<MapScreen />
			</View>
			<Animated.View style={[styles.modalContent, { transform: [{ translateY: pan.y }] }]}>
				<TouchableOpacity onPress={toggleModal}>
					<Text style={styles.closeText}>Close</Text>
				</TouchableOpacity>
				<Text>Your Slide-Up Content Goes Here</Text>
				<Text>Disabled Slide Down to Close for now, configuring Map to stay still, and including what renders depending on screen Height</Text>
			</Animated.View>
		</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
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
		height: height * 0.3,
		backgroundColor: 'white',
		padding: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	closeText: {
		color: 'blue',
		textAlign: 'right',
	},
});

export default SlideUpComponent;
