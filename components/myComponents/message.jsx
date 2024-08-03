import React from 'react'
import { Text, View, SafeAreaView, StyleSheet, Dimensions } from 'react-native'
import AntDesign from '@expo/vector-icons/AntDesign';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const Message = ({ style, name, day, depart, arrive, people }) => {
    return (
        <View style={[style, styles.container]}>
            {/* Sepparate the view into a top and bottom flex box. These will be horizontal */}
            <View style={styles.top}>
                <Text style={styles.title}>{name}</Text>
                <AntDesign style={styles.arrow} name="arrowright" size={24} color="black" />
            </View>

            <View style={styles.bottom}>
                {/* Sepparate the bottom into 3, time prompts, times, and profiles */}
                <View style={styles.timePromptContainer}>
                    <Text style={styles.timePrompt}>Depart {day} by</Text>
                    <Text style={styles.timePrompt}>Arrive {day} by</Text>
                </View>

                <View style={styles.timeContainer}>
                    <Text style={styles.time}>{depart}</Text>
                    <Text style={styles.time}>{arrive}</Text>
                </View>

                <View>
                    {/* Place holder. Will use this view to display user profiles. Users will be passes vie the people prop.
                    The prop will be a json object of their infor */}
                </View>

            </View>
        </View>
    )
}

export default Message;

const styles = StyleSheet.create({
    container: {
        marginVertical: 2 * vh,
        marginHorizontal: 5 * vw,
    },
    top: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: vh,
    },
    title: {
        fontSize: 2 * vh,
        fontWeight: "bold",
        width: 75 * vw,
    },
    arrow: {

        marginLeft: 4 * vw,
    },
    bottom: {
        flexDirection: "row",
    },
    timePromptContainer: {

    },
    timePrompt: {
        fontSize: 2*vh,
        color: "#6E6B6B",
        fontWeight: "bold",
    },
    timeContainer: {
        marginLeft: 2*vw,
    },
    time: {
        fontSize: 2 * vh,
        color: "black",
        fontWeight: "bold",
    },
});