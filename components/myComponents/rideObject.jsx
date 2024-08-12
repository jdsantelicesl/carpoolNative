import React from 'react'
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const convertDay = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const adjustedDay = (day - 1 + 7) % 7;
    return days[adjustedDay];
};

const RideObject = ({ origin, destination, day, depart, arrival, members }) => {
    const dayOfWeek = convertDay(day);

    const handleButtonPress = () => {
        Alert.alert('Requested to join ride');
    };

    return ( 
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.userContainer}>
                    <FontAwesome6 name="user" size={25}/> 
                    <Text style={styles.members}> {members} </Text>
                </View>

                <View style={styles.locationContainer}>
                    <Text style={styles.locationContent}> 
                        {origin} <Text> </Text>
                        <FontAwesome6 name="arrow-right" size={12}/> <Text> </Text>
                        {destination}
                    </Text>
                </View>

                <View style={styles.timeContainer}>
                    <Text> Depart {dayOfWeek} by {depart} </Text>
                    <Text> Arrive {dayOfWeek} by {arrival} </Text>
                </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
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