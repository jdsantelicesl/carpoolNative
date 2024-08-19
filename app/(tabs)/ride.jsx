import React, { useState, useEffect } from 'react';
import {
    Text, View, StyleSheet, Dimensions, SafeAreaView, TextInput, Button, Alert,
    TouchableOpacity, ScrollView, TouchableWithoutFeedback, RefreshControl, FlatList, StatusBar,
    AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { getHours, getMinutes } from 'date-fns';
import Hr from '../../components/myComponents/hr';
import axios from 'axios'; // Use this when we create a Flask server for data endpoints
import { render } from 'react-native-web';
import LocFindSlideUp from '../../components/map/LocFindSlideUp';
import RideObject from '../../components/myComponents/rideObject';
import RideGroup from '../../components/myComponents/rideGroup';

import { saveUserData, getUserData } from '../../components/utilities/cache';


// User id placeHolder. Replace after auth. The id is for test user
const user_id = process.env.EXPO_PUBLIC_USER_ID;
const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const DayButton = ({ title, onPress, isSelected }) => (
    <TouchableOpacity
        style={[styles.dayButton, isSelected && styles.selectedDayButton]}
        onPress={onPress}
    >
        <Text style={[styles.dayButtonText, isSelected && styles.selectedDayButtonText]}>{title}</Text>
    </TouchableOpacity>
);

const ride = () => {

    const [displayRides, setDisplayRides] = useState(null)
    const [renderRideGroup, setRenderRideGroup] = useState(false);
    // Used for when user wants to refresh by pulling down page
    const [refreshing, setRefreshing] = useState(false);
    const [renderMap, setRenderMap] = useState(false);

    const dateObj = new Date(); // Your date object
    const [date, setDate] = useState(dateObj)
    const [sendDate, setSendDate] = useState(getHours(Date()) + (getMinutes(Date()) / 60)) // need to use Date() directly!
    const [destination, setDest] = useState(null);
    const [from, setFrom] = useState(null);
    const [day, setDay] = useState(null); // 1 - 7, Sun - Sat
    const days = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
    const url = process.env.EXPO_PUBLIC_API_URL; // placeholder

    // Use these for rendering rideGroup
    const [rideData, setRideData] = useState(null);

    // Get Rides Data (Check Cache first and then Fetch from DB if not cached) &
    // Check AppState if in background/foreground, user gets fresh data every app open
    useEffect(() => {
        // Use cache data until new data is fetched. Useful when dealing with bad signal
        const fetchUserData = async () => {
            const cachedRidesData = await getUserData('ridesData');


            setDisplayRides(cachedRidesData);
            console.log("Cached Data");


            const send_id = encodeURIComponent(user_id);
            try {
                const ridesResponse = await axios.get(url + `/ride/getRides?client_id=${send_id}`);
                const ridesData = ridesResponse.data;
                console.log("Fetched rides data");

                await saveUserData('ridesData', ridesData)
                setDisplayRides(ridesData)
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        // Fetch when Component mounts and when refreshing.
        // conditonal check because useEffect will be called twice onRefresh
        if (!refreshing) {
            fetchUserData();
        }

        // Handle AppState
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active') {
                console.log("App Active")
                onRefresh();
            }
        }
        // Listen to app state changes
        const currentAppState = AppState.addEventListener('change', handleAppStateChange)

        // Clean listener component when app is unmounted
        return () => {
            currentAppState.remove();
        }

    }, [refreshing]);

    const onRefresh = async () => {
        console.log('----refreshing | Ride Page');
        // display refreshing animation
        setRefreshing(true);
        // Simulate a delay to ensure that refreshing state is properly updated
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    }

    const onClearInput = () => {
        setDest(null);
        setFrom(null);
        setDay(null);
        setDate(new Date);
    }


    // renders rideGroup and passes props
    const clickedRide = (rideData) => {
        setRideData(rideData);
        setRenderRideGroup(true);
    }


    const handleDate = (event, new_date) => {
        if (new_date instanceof Date) {
            setDate(new_date)
            const hours = getHours(new_date)
            const minutes = getMinutes(new_date)
            const calculatedTime = hours + (minutes / 60)
            setSendDate(calculatedTime)

        } else {
            console.log('No date selected or invalid date:', new_date);
        }
    }

    // Needs to be implemented, could be JSON object
    const handleSubmit = async (e) => {
        e.preventDefault();
        //first get users name, then post
        const send_id = encodeURIComponent(user_id);
        const detailsUrl = url + `/user/getUser?client_id=${send_id}`;
        const headers = {
            token: accessToken,
            clientId: user_id
        }
        axios.get(detailsUrl, {headers: headers})
            .then(response => {
                const user_name = response.data.name;

                const data = {
                    destination: {
                        name: destination.name,
                        short: destination.shortName,
                        lat: destination.lat,
                        long: destination.long
                    },
                    origin: {
                        name: from.name,
                        short: from.shortName,
                        lat: from.lat,
                        long: from.long
                    },
                    day: day,
                    arrival: sendDate,
                    member: {
                        id: user_id,
                        name: user_name
                    }
                };
                send_url = url + "/ride/post"
                axios.post(send_url, data)
                    .then(response => {
                        alert('Data sent to /data');
                        onRefresh();
                    })
                    .catch(error => {
                        console.error('Error saving data', error);
                        alert('Failed to send data');
                    })
            })
            .catch(error => {
                console.log("error getting user's name: ", error);
            })
    }

    return (
        <>
            {!renderMap && !renderRideGroup &&
                <SafeAreaView style={styles.container}>
                    <ScrollView
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={['#2E74DD']}
                            />
                        }
                    >
                        {/* Just makes top statusbar dark mode */}
                        <StatusBar barStyle="dark-content" />

                        {/* Location Selection Component */}

                        <Text style={styles.title}>Find a Carpool</Text>

                        <View style={styles.inputContainer}>
                            <TouchableOpacity style={styles.inputWrapper} onPress={() => setRenderMap(true)}>
                                <FontAwesome6 name="location-dot" size={24} style={[styles.icon, (destination && { color: "black" })]} />
                                <Text style={[styles.locInput, (destination && { color: "black" })]}>
                                    {destination ? `${from.shortName} -> ${destination.shortName}` : 'Where to?'}
                                </Text>
                                <TouchableOpacity style={{ paddingRight: 4 * vh, padding: 1.5 * vh, marginRight: -2 * vw }} onPress={() => onClearInput()} >
                                    <FontAwesome6 name="xmark" size={24} style={[{ color: "#6E6B6B" }, (destination && { color: "black" })]} />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        </View>

                        {/* Weekday Component */}

                        <Text style={styles.subTitle}>When do you need to be there?</Text>
                        <View style={styles.weekdayContainer}>
                            {days.map((d, index) => (
                                <DayButton
                                    key={index}
                                    title={d}
                                    onPress={() => setDay(index + 1)}
                                    isSelected={day === index + 1}
                                />
                            ))}
                        </View>

                        {/* Time Selection Component */}

                        <View style={styles.timeContainer}>
                            <Text style={styles.subTitle}>Time:</Text>
                            <View style={styles.timePickerContainer}>
                                <RNDateTimePicker
                                    mode="time"
                                    display='default'
                                    value={date}
                                    onChange={handleDate}
                                />
                            </View>
                        </View>

                        {/* Handle Submit Component */}
                        <View style={styles.submitContainer}>
                            <TouchableOpacity
                                onPress={(e) => handleSubmit(e)}

                                // Apply disabled style conditionally
                                style={[styles.submitButton, (destination && from && day) && { backgroundColor: '#2E74DD' }]}
                                disabled={!(destination && from && day)} // Disable button press functionality
                            >
                                <Text style={[styles.submitText, (destination && from && day) && { color: 'black' }]}>Submit</Text>
                            </TouchableOpacity>
                        </View>

                        <Hr style={styles.hr} />

                        {/* List rides below*/}

                        <View style={{ marginTop: 1.5 * vh }}>
                            {(displayRides != "empty") && displayRides && <FlatList
                                scrollEnabled={false}
                                // data is going to taken in an object which fetches DB to get all rides
                                data={displayRides}
                                renderItem={({ item }) => (
                                    <RideObject
                                        origin={item.origins}
                                        destination={item.destination}
                                        day={item.day}
                                        arrival={item.arrival}
                                        members={item.members}
                                        rideData={item}
                                        onRideClick={clickedRide}
                                    />
                                )}
                                keyExtractor={item => item.id}
                            />}

                            {(displayRides === "empty") && <Text>Post a ride to see recommendations! :) </Text>}
                            {!displayRides && <Text>Loading...</Text>}
                        </View>
                    </ScrollView>



                </SafeAreaView>}

            {renderMap && !renderRideGroup && <LocFindSlideUp setRenderMap={setRenderMap} setDest={setDest} setFrom={setFrom} />}

            {renderRideGroup &&
                <RideGroup
                    origin={rideData.origins}
                    destination={rideData.destination}
                    day={rideData.day}
                    arrival={rideData.arrival}
                    memberGroup={rideData.members}
                    rideId={rideData._id}
                    setRenderRideGroup={setRenderRideGroup} />
            }
        </>
    );
};

export default ride;

const styles = StyleSheet.create({
    container: {
        paddingTop: 4 * vh,
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    title: {
        marginTop: 1 * vh,
        marginLeft: 6 * vw,
        color: "black",
        textAlign: "left",
        fontWeight: "bold",
        fontSize: 4 * vh,
        marginBottom: 3 * vh,
    },
    subTitle: {
        marginLeft: 5 * vw,
        color: "#5A5A5A",
        textAlign: "left",
        fontWeight: "bold",
        fontSize: 2.8 * vh,
        marginBottom: 1 * vh,
    },
    inputContainer: {
        alignItems: 'center',
        marginTop: -1 * vh,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#D9D9D9",
        borderRadius: 3 * vh,
        marginBottom: 1.8 * vh,
        width: 90 * vw,
    },
    icon: {
        marginLeft: 4 * vw,
        color: "#6E6B6B"
    },
    locInput: {
        flex: 1,
        paddingVertical: 1.6 * vh,
        fontSize: 2.5 * vh,
        fontWeight: "bold",
        color: "#6E6B6B",
        paddingLeft: 2 * vw,
    },
    weekdayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5 * vw,
        marginBottom: 2 * vh,
        marginTop: 0.5 * vh,
    },
    dayButton: {
        width: 10 * vw,
        height: 10 * vw,
        borderRadius: 3 * vw,
        backgroundColor: '#D9D9D9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedDayButton: {
        backgroundColor: '#6E6B6B',
    },
    dayButtonText: {
        color: '#6E6B6B',
        fontSize: 2.5 * vh,
        fontWeight: 'bold',
    },
    selectedDayButtonText: {
        color: 'white',
    },
    timeContainer: {
        marginLeft: 20 * vw,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2 * vh,
        paddingHorizontal: 0 * vw,
        justifyContent: 'space-between',
    },
    timePickerContainer: {
        marginRight: 28 * vw,
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3 * vh,
        paddingHorizontal: 2 * vw,
        paddingVertical: -0.5 * vh,
        flex: 1,
        justifyContent: 'flex-end',
    },
    timePickerButton: {
        paddingBottom: 1.6 * vh,
        paddingTop: 1.1 * vh,
        paddingHorizontal: 5 * vw,

        width: 30 * vw,
        backgroundColor: '#D9D9D9',
        borderRadius: 3 * vh,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        marginRight: 2 * vw,
    },
    timePicker: {
        fontSize: 2.5 * vh,
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    buttons: {
        width: 18 * vw,
        height: 6 * vh,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#C4C4C4',
        borderRadius: 2.5 * vh,
        marginLeft: 2 * vw,
    },
    activeButtons: {
        backgroundColor: '#6E6B6B',
    },
    buttonsText: {
        fontSize: 2 * vh,
        fontWeight: 'bold',
        color: '#6E6B6B',
    },
    activeButtonsText: {
        color: 'white',
    },
    submitContainer: {
        backgroundColor: '#F5F5F5',
    },
    submitButton: {
        backgroundColor: '#D9D9D9',
        padding: 1 * vh,
        borderRadius: 5 * vw,
        marginHorizontal: 20 * vw,
    },
    submitText: {
        color: '#6E6B6B',
        textAlign: 'center',
        fontSize: 2.5 * vh,
        fontWeight: 'bold',
    },
    hr: {
        marginHorizontal: 2 * vw,
        marginTop: 1.5 * vh,
        height: 0.2 * vh,
        width: 96 * vw,
        backgroundColor: "black",
    },
});

const pickerStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 2.5 * vh,
        color: "#6E6B6B",
        fontWeight: "bold",

        paddingTop: .2 * vh,
    },
    inputAndroid: {
        fontSize: 2.5 * vh,
        color: "#6E6B6B",
    },

});