import React, { useState, useEffect } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { FlatList, Text, View, StyleSheet, Dimensions, TouchableOpacity, Alert, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import MapScreen from '../map/MapScreen';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;
const convertDay = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const adjustedDay = (day - 1 + 7) % 7;
    return days[adjustedDay];
};

const RideGroup = ({ origin, destination, day, arrival, memberGroup, setRenderRideGroup }) => {

    const dayOfWeek = convertDay(day);
    // sets hour, minute, amPm from 24h to 12h clock
    const hour = (Math.floor(arrival) > 12) ? (Math.floor(arrival) - 12) : Math.floor(arrival);
    const roundMin = Math.round((arrival - Math.floor(arrival)) * 60);
    const minute = roundMin < 10 ? `0${roundMin}` : roundMin;
    const amPm = (Math.floor(arrival) >= 12) ? "pm" : "am";
    const [message, setMessage] = useState("Hello! I am interested in joining your carpool. I can contribute with gas money.");

    const renderMember = ({ item }) => (
        <View style={styles.memberContainer}>
            <FontAwesome6 name="user" size={24} style={styles.icon} />
            <Text style={styles.memberName}>{item.name}</Text>
        </View>
    );
    return (
        <KeyboardAwareScrollView>
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
                    <Text style={{ fontSize: 6 * vw, textAlign: "center", fontWeight: "bold" }}> {origin}  <FontAwesome6 name="arrow-right" size={17} /> {destination}</Text>
                </View>

                {/* Time and Date */}
                <View style={styles.time}>
                    <Text style={styles.time}> Every {dayOfWeek} at {hour}:{minute}{amPm} </Text>
                </View>

                {/* Map Container */}
                <View style={styles.mapContainer}>
                    <MapScreen
                        origin={1} //Place holder Values just to render map
                        dest={1}   // Place holder Values just to render map
                    />
                </View>

                {/* User FlatList */}
                <FlatList
                    scrollEnabled={false}
                    data={memberGroup}
                    renderItem={renderMember}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.list}
                />

                {/* Text Input */}
                <TextInput
                    style={styles.textInput}
                    placeholder={message}
                    placeholderTextColor="#888"
                    multiline
                />
                {/* Submit Button */}
                <TouchableOpacity style={styles.button} onPress={() => alert("Yo")}>
                    <FontAwesome6 name="telegram" size={50} />
                </TouchableOpacity>

            </View>
        </KeyboardAwareScrollView>
    );
}

export default RideGroup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 8 * vh,
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
        borderColor: 'green',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 3,
    },
    memberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 1 * vh,
    },
    icon: {
        marginRight: 2 * vw,
    },
    memberName: {
        fontSize: 5 * vw,
        fontWeight: 'bold',
    },
    list: {
        marginHorizontal: 5 * vw,
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
        marginTop: 2 * vh,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
