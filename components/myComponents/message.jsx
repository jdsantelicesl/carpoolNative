import React, {useState, useEffect} from 'react'
import { Text, View, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Hr from './hr';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const convertDay = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const adjustedDay = (day - 1 + 7) % 7;
    return days[adjustedDay];
};

const Message = ({ style, origin, destination, day, arrival, prevText, people, profile, setChatVisible }) => {
    const dayOfWeek = convertDay(day);
    // sets hour, minute, amPm from 24h to 12h clock
    const hour = (Math.floor(arrival) > 12) ? (Math.floor(arrival) - 12) : Math.floor(arrival);
    const roundMin = Math.round((arrival - Math.floor(arrival))*60);
    const minute = roundMin < 10 ? `0${roundMin}` : roundMin;
    const amPm = (Math.floor(arrival) >= 12) ? "pm" : "am";
    const formattedTime = `${hour}:${minute}${amPm}`;

    // For future implementation if new message is unread
    const [read, setRead] = useState(false);

    return (
        <>
        <View style={[style, styles.container]}>
            {/* This is the grey circle, currently place holder for user profile */}
            <FontAwesome style={styles.profile} name="user-circle" size={10 * vh} color="#D9D9D9" />

            <View style={styles.content}>

                {/* Display Ride Information Origin -> Destination */}
                <View style={styles.top}>
                    <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                        {origin} <Text></Text> {destination && <FontAwesome6 name="arrow-right" size={16}/>} {destination} 
                    </Text>
                </View>
                

                <View style={styles.bottom}>
                    {/* Sepparate the bottom into 3, day, arrival, and profile*/}
                    <View style={styles.arrivalPromptContainer}>
                        <Text style={styles.arrivalPrompt}>{day && dayOfWeek} {arrival && formattedTime} </Text>
                    </View>


                    <View>
                        {/* Place holder. Will use this view to display user profiles. Users will be passes vie the people prop.
                        The prop will be a json object of their infor */}

                        {/* I Added the profile on the top of the code instead, place holder is the circle,
                            If that is an option, we can delete this place holder. */}
                    </View>

                </View>  

                {/* Previous Text */}
                <View> 
                    <Text 
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles.prevText}
                    >
                        {prevText}
                    </Text> 
                </View>

            </View>

            <TouchableOpacity style={styles.button} onPress={() => alert("yo")}>
                    <FontAwesome6 style={styles.arrow} name="chevron-right" size={20} color="black" />
            </TouchableOpacity>
            
        </View>
        <Hr style={styles.hr} />
        </>
    )
}

export default Message;

const styles = StyleSheet.create({
    container: {
        marginVertical: 2 * vh,
        marginHorizontal: 2.5 * vw,
        flexDirection: "row",
    },
    content: {
        flexDirection: "column",
        marginLeft: 5 * vw,
        marginTop: 1 * vh,
    },
    top: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 8 * vw,
    },
    title: {
        fontSize: 2 * vh,
        fontWeight: "bold",
        width: 60 * vw,
    },
    profile: {
        
    },
    button:{
        // backgroundColor: "red",
        marginLeft: -2 * vh,
    },
    arrow: {
        flex: 1,
        marginTop: 2 * vh,
        
    },
    bottom: {
        flexDirection: "row",
    },
    arrivalPromptContainer: {
    },
    arrivalPrompt: {
        fontSize: 4 * vw,
        color: "black",
        fontWeight: "bold",
    },
    prevText: {
        marginTop: 1 * vh,
        fontSize: 4 * vw,
        color: "#6D6D6D",
        width: 69 * vw, // Nice
    },
    arrivalContainer: {
        marginLeft: 2*vw,
    },
    hr: {
        marginHorizontal: 2 * vw,
        marginVertical: -1 * vh,
        height: 0.2 * vh,
        width: 96 * vw,
        backgroundColor: "black",
    },
});