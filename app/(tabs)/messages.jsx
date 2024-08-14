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
                <Message name={"West Davis to Sacramento City College"} day={"Monday"} depart={"7:30am"} arrive={"8:10am"} />
                <Hr style={styles.hr} />
                <Message name={"Sacramento City College to East Davis"} day={"Monday"} depart={"1:00pm"} arrive={"1:35pm"} />
                <Hr style={styles.hr} />
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
