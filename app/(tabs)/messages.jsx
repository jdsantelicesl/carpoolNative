import React from 'react'
import { Text, View, SafeAreaView, StyleSheet, Dimensions, ScrollView } from 'react-native'
import Hr from '../../components/myComponents/hr';
import Message from '../../components/myComponents/message';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const messages = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text style={styles.title}> Messages </Text>
                <Hr style={styles.hr} />

                {/** Example only. Should fetch data and use component to display data retrieved. */}
                <Message 
                    origin={"West Davis"} 
                    destination={"Sacramento City College"} 
                    day={2} 
                    arrival={11.5}
                    prevText={"Lets plan to leave by 7:10am tomorrow"}
                />

                <Message 
                    origin={"Sacramento"} 
                    destination={"East Davis"} 
                    day={2} 
                    arrival={18.5} 
                    prevText={"Headng back, anyone still up for Joe's Sandwiches"}
                />
                
                <Message 
                    origin={"Message from developers"} 
                    day={2} // Make it day of download app
                    arrival={2.5} // Make it time of download app
                    // Or maybe disregard, these are placeholders for now
                    // Not given value shows NaN
                    prevText={"Make sure to know your carpool friends well"}
                />

            </ScrollView>
        </SafeAreaView>
    )
}

export default messages;

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
        marginBottom: 2 * vh,
    },
    hr: {
        marginHorizontal: 2 * vw,

        height: 0.2 * vh,
        width: 96 * vw,
        backgroundColor: "black",
    }
});
