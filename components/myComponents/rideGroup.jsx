import React, { useState, useEffect } from 'react';
import { FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { FlatList, Text, View, StyleSheet, Dimensions, TouchableOpacity, Alert, TextInput, StatusBar, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MapScreen from '../map/MapScreen';
import UserProfilePopUp from './userProfilePopUp';

import apiClient from '../../components/utilities/apiClient';
import { getUserData } from '../../components/utilities/cache';

// Find a way to grab userId and pass it through userProfilePopUp
// So when I press the user in the RideGroup pop up, I'm gonna see 

// Note: variable name "Member" is strictly for rideGroup file
//       variable name "User" is strictly related to userProfilePopUp

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;
const convertDay = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const adjustedDay = (day - 1 + 7) % 7;
    return days[adjustedDay];
};

const RideGroup = ({ origin, destination, day, arrival, memberGroup, rideId, setRenderRideGroup }) => {

    const dayOfWeek = convertDay(day);
    const hour = (Math.floor(arrival) > 12) ? (Math.floor(arrival) - 12) : Math.floor(arrival);
    const roundMin = Math.round((arrival - Math.floor(arrival)) * 60);
    const minute = roundMin < 10 ? `0${roundMin}` : roundMin;
    const amPm = (Math.floor(arrival) >= 12) ? "pm" : "am";
    const formattedTime = `${hour}:${minute}${amPm}`;

    const url = process.env.EXPO_PUBLIC_API_URL; // placeholder

    const [message, setMessage] = useState("Hello! I am interested in joining your carpool. I can contribute with gas money.");
    const [sentRequest, setSentRequest] = useState(false);

    const sendRequest = async () => {
        setSentRequest(true);
        const sendUrl = url + "/message/send";
        const user_id = await getUserData("clientId");

        const sendData = {
            messageType: "request",
            content: message,
            rideId: rideId,
            clientId: user_id
        };

        apiClient.post(sendUrl, sendData)
            .then(response => {
                if (response.data == "Ok") {
                    alert("Request sent");
                }
                else if (response.data == "Existing request") {
                    alert("Already requested");
                }
                setRenderRideGroup(false);
            })
            .catch(error => {
                alert("Error sending request");
                console.log("error sending request: ", error);
            });
    }

    // Below handles when a user is clicked
    // ------------------------------------
    const [renderProfile, setRenderProfile] = useState(false);

    const [user, setUser] = useState(null);

    // Called when click on user name
    handleUserClick = (userData) => {
        setUser(userData);
        setRenderProfile(true);
    };

    // Called when click on close on popUp
    handleUserClose = () => {
        setRenderProfile(false);
    };

    const renderMember = ({ item }) => (
        <TouchableOpacity style={styles.memberContainer} onPress={() => handleUserClick(item)}>
            {item.pfp ? (<Image style={styles.profile} source={{ uri: item.pfp }} />) :
                (<FontAwesome name="user-circle" size={24} style={styles.icon} />)}
            <Text style={styles.memberName}>{item.name}</Text>
        </TouchableOpacity>
    );
    // ------------------------------------

    return (
        <KeyboardAwareScrollView style={{ backgroundColor: "white" }}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.container}>

                {/* Exit Button */}
                <View style={styles.leftArrow} >
                    <TouchableOpacity onPress={() => setRenderRideGroup(false)}>
                        <FontAwesome6 name="arrow-left" size={24}></FontAwesome6>
                    </TouchableOpacity>
                </View>

                {/* Begin Content */}

                {/* Location */}
                <View style={styles.location}>
                    <Text style={{ fontSize: 6 * vw, textAlign: "center", fontWeight: "bold" }}> {origin.short}  <FontAwesome6 name="arrow-right" size={17} /> {destination.short}</Text>
                </View>

                {/* Time and Date */}
                <View style={styles.time}>
                    <Text style={styles.time}> Every {dayOfWeek} at {formattedTime} </Text>
                </View>

                {/* Map Container */}
                <View style={styles.mapContainer}>
                    <MapScreen
                        origin={origin} //Place holder Values just to render map
                        dest={destination}
                    // Place holder Values just to render map
                    />
                </View>

                {/* User FlatList */}
                <View style={styles.list}>
                    <FlatList
                        scrollEnabled={false}
                        data={memberGroup}
                        renderItem={renderMember}
                        keyExtractor={(item, index) => index.toString()}
                    />

                    {/** Empty seats */}
                    <FlatList
                        scrollEnabled={false}
                        data={Array.from({ length: (5 - memberGroup.length) }, (_, index) => index)}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.memberContainer}>
                                <FontAwesome name="user-circle" size={24} style={styles.icon} />
                                <Text style={styles.memberName}>Empty</Text>
                            </TouchableOpacity>)
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>

                {/* Text Input */}
                <TextInput
                    style={styles.textInput}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                />
                {/* Submit Button */}
                <TouchableOpacity style={styles.button} onPress={() => sendRequest()} disabled={sentRequest}>
                        <FontAwesome6 name="telegram" color={"#2E74DD"} size={50} />
                </TouchableOpacity>

            </View>

            {/* User Profile Pop Up,
                Grab data from user db and convert. */}
            {renderProfile && <UserProfilePopUp
                userData={user}
                visible={renderProfile}
                onClose={() => handleUserClose()}
            />}

        </KeyboardAwareScrollView>
    );
}

export default RideGroup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 7 * vh,
    },
    profile: {
        width: 3 * vh,
        height: 3 * vh,
        borderRadius: 1.5 * vh,
        borderColor: "black",
        borderWidth: 0.1 * vw,
        marginRight: 1 * vw,
    },
    leftArrow: {
        marginLeft: 4 * vw,
    },
    location: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    time: {
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
    mapContainer: {
        backgroundColor: "#fff", // White background to make shadow more visible
        borderRadius: 2 * vh,
        marginTop: 1 * vh,
        marginHorizontal: 2 * vh,
        height: 30 * vh,
        overflow: 'hidden', // Ensures the map content is clipped to the rounded border
        borderWidth: .2 * vh,
        borderColor: '#2E74DD', // wtf was that green border? respectfully
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
    memberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 0.65 * vh,
        paddingHorizontal: 3 * vw
    },
    icon: {
        marginRight: 2 * vw,
    },
    memberName: {
        fontSize: 5 * vw,
        fontWeight: 'bold',
    },
    list: {
        marginVertical: 1.2 * vh,
        marginHorizontal: 5 * vw,
        height: 21.5 * vh,
    },
    textInput: {
        backgroundColor: '#E1E1E1',
        marginHorizontal: 4 * vw,
        padding: 2 * vh,
        height: 12 * vh,
        borderRadius: 2 * vh,
        fontSize: 4.8 * vw,
        fontWeight: 'bold',
    },
    button: {
        marginTop: 0.5 * vh,
        marginHorizontal: 40 * vw,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
