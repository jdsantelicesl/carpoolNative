import React, { useState, useEffect } from 'react'
import { Text, View, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import { FontAwesome6 } from '@expo/vector-icons';
import Hr from './hr';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const convertDay = (day) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const adjustedDay = (day - 1 + 7) % 7;
    return days[adjustedDay];
};

const Message = ({ style, origin, destination, day, arrival, prevText, rideData, onPress }) => {
    const dayOfWeek = convertDay(day);
    // sets hour, minute, amPm from 24h to 12h clock
    const hour = (Math.floor(arrival) > 12) ? (Math.floor(arrival) - 12) : Math.floor(arrival);
    const roundMin = Math.round((arrival - Math.floor(arrival)) * 60);
    const minute = roundMin < 10 ? `0${roundMin}` : roundMin;
    const amPm = (Math.floor(arrival) >= 12) ? "pm" : "am";
    const formattedTime = `${hour}:${minute}${amPm}`;

    // For future implementation if new message is unread
    const [read, setRead] = useState(false);

    return (
        <TouchableOpacity style={styles.componentCont} onPress={onPress}>
            <View style={[style, styles.container]}>
                {/* This is the grey circle, currently place holder for user profile */}
                {/* <FontAwesome style={styles.profile} name="user-circle" size={10 * vh} color="#D9D9D9" /> */}
                {rideData ?
                    (<View style={profileStyles.profile}>
                        <View style={{ flexDirection: 'row' }}>
                            {rideData.members[0] && rideData.members[0].pfp &&
                                <Image style={profileStyles.userProfiles} source={{ uri: rideData.members[0].pfp }} />
                            }
                            {rideData.members[1] && rideData.members[1].pfp &&
                                <Image style={profileStyles.userProfiles} source={{ uri: rideData.members[1].pfp }} />
                            }
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {rideData.members[2] && rideData.members[2].pfp &&
                                <Image style={profileStyles.userProfiles} source={{ uri: rideData.members[2].pfp }} />
                            }
                            {rideData.members[3] && rideData.members[3].pfp &&
                                <Image style={profileStyles.userProfiles} source={{ uri: rideData.members[3].pfp }} />
                            }
                        </View>
                    </View>) :
                    (<Image style={profileStyles.profile} source={require("../../assets/images/applogo-fill-leaf.png")} />)
                }

                <View style={styles.content}>

                    {/* Display Ride Information Origin -> Destination */}
                    <View style={styles.top}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                            {origin} <Text></Text> {destination && <FontAwesome6 name="arrow-right" size={16} />} {destination}
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

                <FontAwesome6 style={styles.arrow} name="chevron-right" size={20} color="black" />

            </View>
            <Hr style={styles.hr} />
        </TouchableOpacity>
    )
}

export default Message;

const styles = StyleSheet.create({
    componentCont: {
        height: 14 * vh,
    },
    container: {
        marginTop: 1 * vh,
        marginBottom: 2 * vh,
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
    arrow: {
        flex: 1,
        marginTop: 2 * vh,
        marginLeft: -2 * vh,

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
        marginLeft: 2 * vw,
    },
    hr: {
        marginHorizontal: 2 * vw,
        marginVertical: 0 * vh,
        height: 0.2 * vh,
        width: 96 * vw,
        backgroundColor: "black",
    },
});

const profileStyles = StyleSheet.create({
    profile: {
        width: 20 * vw,
        height: 20 * vw,
        borderRadius: 5 * vh,
        borderColor: "black",
        borderWidth: 0.2 * vw,
        backgroundColor: '#D9D9D9',
        overflow: 'hidden', // Prevent overflow
    },
    userProfiles: {
        width: 10 * vw,
        height: 10 * vw,
        borderRadius: 5 * vh,
    },
})