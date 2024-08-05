import React from 'react';
import { Text, View, SafeAreaView, StyleSheet, Dimensions } from 'react-native';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Rating from '../../components/myComponents/rating';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const profile = () => {
    return (
        <SafeAreaView style={styles.container}>

            {/** User pfp, name and rating */}
            <View style={userStyle.userContainer}>
                <View>
                    <FontAwesome6 name="user-graduate" size={10 * vh} color="black" />
                </View>
                <View style={userStyle.info}>
                    <Text style={userStyle.name}> Jerry Smith </Text>

                    {/** rating is number of stars out of 5, total is total ratings/reviews */}
                    <Rating style={userStyle.rating} size={3*vh} rating={2.5} total={10} />
                </View>
            </View>

            {/** User bio. We probably want to force users to list their school. To ensure security?
             * Might make this a view and add subcomponents later on
             */}
            <View style={userStyle.bio}>
                <Text style={userStyle.bioText}>Student at Sacramento City College</Text>
                <Text style={userStyle.bioText}>Have you ever watched Rick and Morty?</Text>
            </View>

            {/** Rides and Raitings, will call components for this */}
        </SafeAreaView>
    )
}

export default profile;

// general styles
const styles = StyleSheet.create({
    container: {
        paddingTop: 4 * vh,
        flex: 1,
        backgroundColor: '#F5F5F5',
    },

});

// styles for profile pic, name, rating, and bio
const userStyle = StyleSheet.create({
    userContainer: {
        width: 76 * vw,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4 * vh,
        marginBottom: 2 * vh,
        marginHorizontal: 12 * vw,
    },
    pfp: {

    },
    info: {
        marginLeft: 4 * vw,
        flex: 1,
    },
    name: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 3.2 * vh,
        marginBottom: .5 * vh,
        flexWrap: 'wrap',
    },
    rating: {
        marginLeft: 1.5 * vw,
    },
    bio: {
        marginHorizontal: 10 * vw,
    },
    bioText: {
        color: "#6E6B6B",
        fontWeight: 'bold',
        fontSize: 2 * vh,
    }
});