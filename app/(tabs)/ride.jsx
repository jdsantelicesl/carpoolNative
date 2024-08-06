import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, SafeAreaView, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import Hr from '../../components/myComponents/hr';
import axios from 'axios'; // Use this when we create a Flask server for data endpoints

// User id placeHolder. Replace after auth. The id is for test user
const user_id = "66b05d4898e072e89f63483d";

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

const CustomButton = ({ onPress, title }) => (
    <TouchableOpacity style={styles.submitButton} onPress={onPress}>
      <Text style={styles.submitText}>{title}</Text>
    </TouchableOpacity>
);

const ride = () => {
    const [destination, setDest] = useState("");
    const [from, setFrom] = useState("");
    const [day, setDay] = useState(null); // 1 - 7, Sun - Sat
    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0)
    const [amPm, setAmPm] = useState("AM");
    const [haveCar, setHaveCar] = useState(true); // true or false
    const [date, setDate] = useState(new Date()); // Used later for time selection after researched
    const days = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa'];
    const url = "http://192.168.1.23:5000/ride/post"; // placeholder
    // Needs to be implemented, could be JSON object
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            destination: destination,
            origin: from,
            day: day,
            hour: hour,
            minute: minute,
            amPm: amPm,
            haveCar: haveCar,
        };
        try {
            await axios.post("https://localhost:5000/ride/post" ,data);
            console.log(data);
            alert('Data sent to /data');
        } catch (error) {
            console.error('Error saving data', error);
            alert('Failed to send data');
        }
    };

    // Create array for hours and minutes (to be used for time selector)
    const hourItems = Array.from({ length: 13 }, (_, i) => ({
        label: i < 10 ? `0${i}` : String(i),
        value: i,
    }));

    // for minutes
    const minuteItems = Array.from({ length: 61 }, (_, i) => ({
        label: i < 10 ? `0${i}` : String(i),
        value: i,
    }));

    const Submit = () => (
        <View style={styles.submitContainer}>
          <CustomButton
            title="Submit"
            onPress={(e) => handleSubmit(e)}
          />
        </View>
    );


    return (
        <SafeAreaView style={styles.container}>
            {/* Location Selection Component */}

            <Text style={styles.title}>Find a Carpool</Text>
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <FontAwesome6 name="magnifying-glass" size={24} color="#6E6B6B" style={styles.icon} />
                    <TextInput
                        style={styles.locInput}
                        placeholder="Where to?"
                        placeholderTextColor="#6E6B6B"
                        value={destination}
                        onChangeText={setDest}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <FontAwesome6 name="magnifying-glass" size={24} color="#6E6B6B" style={styles.icon} />
                    <TextInput
                        style={styles.locInput}
                        placeholder="Where from?"
                        placeholderTextColor="#6E6B6B"
                        value={from}
                        onChangeText={setFrom}
                    />
                </View>
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
                    {/* onChangeTime, create function for modal or inline time selection.
                      * This current time button is interim placeholder
                      */}

                    <View style={styles.timePickerButton}>
                        <RNPickerSelect
                            onValueChange={(value) => setHour(value)}
                            items={hourItems}
                            style={pickerStyles}
                            value={hour}
                        />
                        {/* RNPickerSelect can only take in a special format of style */}
                        <Text style={{ fontSize: 2.5 * vh, color: "#6E6B6B", fontWeight: "bold"}}>:</Text>
                        <RNPickerSelect
                            onValueChange={(value) => setMinute(value)}
                            items={minuteItems}
                            style={pickerStyles}
                            value={minute}
                        />
                    </View>

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.buttons, amPm === 'AM' && styles.activeButtons]}
                            onPress={() => setAmPm('AM')}
                        >
                            <Text style={[styles.buttonsText, amPm === 'AM' && styles.activeButtonsText]}>AM</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.buttons, amPm === 'PM' && styles.activeButtons]}
                            onPress={() => setAmPm('PM')}
                        >
                            <Text style={[styles.buttonsText, amPm === 'PM' && styles.activeButtonsText]}>PM</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Do You Have Car Component */}
            {/* I resued the timePickerContainer stylesheet from time selection's components */}

            <View style={styles.timeContainer}>
                <Text style={styles.subTitle}>Do you have a car?:</Text>
                <View style={styles.timePickerContainer}>
                    {/* onChangeTime, create function for modal or inline time selection.
                      * This current time button is interim placeholder
                      */}

                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity
                            style={[styles.buttons, haveCar == true && styles.activeButtons]}
                            onPress={() => setHaveCar(true)}
                        >
                            <Text style={[styles.buttonsText, haveCar == true && styles.activeButtonsText]}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.buttons, haveCar == false && styles.activeButtons]}
                            onPress={() => setHaveCar(false)}
                        >
                            <Text style={[styles.buttonsText, haveCar == false && styles.activeButtonsText]}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Handle Submit Component */}
            <Submit />
            
            <Hr style= {styles.hr}/>

            {/* Separating Line */}

            {/* List of users (Make scrollable)*/}

        </SafeAreaView>
    );
};

export default ride;

const styles = StyleSheet.create({
    container: {
        paddingTop: 4 *vh,
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
        marginTop: -2 * vh,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#D9D9D9",
        borderRadius: 3 * vh,
        marginBottom: 2 * vh,
        width: 90 * vw,
    },
    icon: {
        marginLeft: 4 * vw,
    },
    locInput: {
        flex: 1,
        height: 6.5 * vh,
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
        paddingBottom: 1.6*vh,
        paddingTop: 1.1 *vh,
        paddingHorizontal: 5 * vw,

        width: 30*vw,
        backgroundColor: '#D9D9D9',
        borderRadius: 3 * vh,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        marginRight: 2 * vw,
    },
    timePicker: {
        fontSize: 2.5 * vh,
        fontWeight: "bold",
        color: "#6E6B6B",
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
        marginHorizontal: 2*vw,
        marginTop: 1 * vh,
        height: 0.2*vh,
        width: 96*vw,
        backgroundColor: "black",
    },
});

const pickerStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 2.5 * vh,
        color: "#6E6B6B",
        fontWeight: "bold",

        paddingTop: .2*vh,
    },
    inputAndroid: {
        fontSize: 2.5 * vh,
        color: "#6E6B6B",
    },
    
});