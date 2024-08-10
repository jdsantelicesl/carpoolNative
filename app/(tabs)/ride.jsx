import React, { useState } from 'react';
import {
    Text, View, StyleSheet, Dimensions, SafeAreaView, TextInput, Button, Alert,
    TouchableOpacity, ScrollView, TouchableWithoutFeedback, RefreshControl
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Hr from '../../components/myComponents/hr';
import axios from 'axios'; // Use this when we create a Flask server for data endpoints
import OriginSlideUp from '../../components/map/OriginSlideUp';
import LocFind from '../../components/map/locFind';

// User id placeHolder. Replace after auth. The id is for test user
const user_id = "66b573b5bd03d4f38b185868";
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
    const [mapActive, setMapActive] = useState(false)
    // Used for when user wants to refresh by pulling down page
    const [refreshing, setRefreshing] = useState(false);

    const [pickTimeVis, setTimeVis] = useState(true)
    const [date, setDate] = useState(null)

    const [destination, setDest] = useState(null);
    const [from, setFrom] = useState(null);
    const [day, setDay] = useState(null); // 1 - 7, Sun - Sat
    const [hour, setHour] = useState("00");
    const [minute, setMinute] = useState("00")
    const [amPm, setAmPm] = useState("AM");
    const days = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
    const url = process.env.EXPO_PUBLIC_API_URL + "/ride/post"; // placeholder

    const onRefresh = () => {
        // display refreshing animation
        setRefreshing(true);

        // reset all values
        setDest(null);
        setFrom(null);
        setDay(null);

        setRefreshing(false);
    }

    const handleLocClick = (locId) => {
        // this is the 'callback' function
        /* this function will take the locId from the LocFind element clicked and
         * set it as the current location or origin/destination */

        // need to edit backend to send lat and long too
        console.log(locId)
    }

    const handleDate = (date) => {
        console.log('success')
    }

    // Needs to be implemented, could be JSON object
    const handleSubmit = async (e) => {
        e.preventDefault();

        let arrival = hour + minute / 60;

        if (amPm === "PM") {
            if (hour != 12) {
                arrival += 12;
            }
        }
        else {
            if (hour == 12) {
                arrival -= 12;
            }
        }

        const data = {
            destination: destination,
            origin: from,
            day: day,
            arrival: arrival,
            member: user_id
        };
        try {
            await axios.post(url, data);
            console.log(data);
            alert('Data sent to /data');
        } catch (error) {
            console.error('Error saving data', error);
            alert('Failed to send data');
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            { !mapActive && <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#2E74DD']}
                    />
                }
            >

                {/* Location Selection Component */}

                <Text style={styles.title}>Find a Carpool</Text>

                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.inputWrapper} onPress={() => setMapActive(true)}>
                        <FontAwesome6 name="magnifying-glass" size={24} color="#6E6B6B" style={styles.icon} />
                        <Text style={styles.locInput}>
                            {destination ? destination : 'Where to?'}
                        </Text>
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
                        <TouchableOpacity style={styles.timePickerButton} onPress={() => setTimeVis(true)}>
                            <Text>{hour}:{minute}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={pickTimeVis}
                            mode="time"
                            onConfirm={(date) => handleDate(date)}
                            onCancel={() => setTimeVis(false)}
                        />
                    </View>
                </View>

                {/* Handle Submit Component */}
                <View style={styles.submitContainer}>
                    <TouchableOpacity
                        onPress={(e) => handleSubmit(e)}

                        // Apply disabled style conditionally
                        style={[styles.submitButton, (destination && from && day && hour && minute && amPm) && { backgroundColor: '#2E74DD' }]}
                        disabled={!(destination && from && day && hour && minute && amPm)} // Disable button press functionality
                    >
                        <Text style={[styles.submitText, (destination && from && day && hour && minute && amPm) && { color: 'black' }]}>Submit</Text>
                    </TouchableOpacity>
                </View>

                <Hr style={styles.hr} />

                {/* Separating Line */}

                <LocFind query={destination} handleLocClick={handleLocClick} />

                {/* List of users (Make scrollable)*/}
            </ScrollView> }

            { mapActive && <OriginSlideUp setMapActive={setMapActive} /> }
        </SafeAreaView>
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
        color: "#5A5A5A",
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2 * vh,
        paddingHorizontal: 0 * vw,
        justifyContent: 'space-between',
    },
    timePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
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
        marginTop: 1 * vh,
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