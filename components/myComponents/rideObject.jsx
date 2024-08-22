import React from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Alert, Image } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;


const convertDay = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const adjustedDay = (day - 1 + 7) % 7;
    return days[adjustedDay];
};

const RideObject = ({ origin, destination, day, arrival, members, rideData, onRideClick}) => {
    const dayOfWeek = convertDay(day);

    // sets hour, minute, amPm from 24h to 12h clock
    const hour = (Math.floor(arrival) > 12) ? (Math.floor(arrival) - 12) : Math.floor(arrival);
    const roundMin = Math.round((arrival - Math.floor(arrival))*60);
    const minute = roundMin < 10 ? `0${roundMin}` : roundMin;
    const amPm = (Math.floor(arrival) >= 12) ? "pm" : "am";
    const formattedTime = `${hour}:${minute}${amPm}`;

    return ( 
        <View style={styles.container}>
            <View style={styles.infoContainer}>

                {/* Displaying User */}
                <View style={styles.userContainer}>
                    {/* <FontAwesome6 name="user" size={25}/>  */}
                    <Image style={styles.profile} source={{uri: members[0].pfp}}/>
                    <Text style={styles.members}> {members[0].name} </Text>
                </View>

                {/* Location */}
                <View style={styles.locationContainer}>
                    <Text style={styles.locationContent}> 
                        {origin.short}
                        <Text> </Text> <FontAwesome6 name="arrow-right" size={12}/> <Text> </Text>
                        {destination.short}
                    </Text>
                </View>

                {/* Time */}
                <View style={styles.timeContainer}>
                    <Text>Arrive {dayOfWeek} by {formattedTime} </Text>
                </View>
            </View>

            {/* Button */}
            <TouchableOpacity style={styles.button} onPress={() => {onRideClick(rideData); }}>
                <FontAwesome6 name="arrow-right" size={4 * vh} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row',
        marginVertical: .6 * vh,
        marginHorizontal: 5 * vw,
        backgroundColor: '#fff',
        borderRadius: 2 * vh,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profile: {
        width: 3 * vh, 
        height: 3 * vh, 
        borderRadius: 1.5 * vh,
        borderColor: "black",
        borderWidth: 0.1 * vw
    },
    infoContainer: {
        flex: 3,
        padding: 2 * vh,
    },
    userContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    members:{
        fontWeight: 'bold',
        fontSize: 5 * vw,
        marginLeft: 1 * vw,
    },
    locationContainer: {
        marginTop: 1 * vh,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    locationContent: {
        fontWeight: 'bold',
    },
    timeContainer: {
        marginTop: 0.5 * vh,
        flexDirection: 'column',
    },
    button: {
        flex: 1,
        backgroundColor: '#007AFF',
        borderTopRightRadius: 2 * vh,
        borderBottomRightRadius: 2 * vh,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RideObject;