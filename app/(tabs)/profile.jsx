import React, { useState, useEffect } from 'react';
import {
    Alert, Text, View, SafeAreaView, StyleSheet, Dimensions, TouchableWithoutFeedback, ScrollView, RefreshControl, FlatList
} from 'react-native';
import axios from 'axios';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Rating from '../../components/myComponents/rating';
import Hr from '../../components/myComponents/hr';
import RideObject from '../../components/myComponents/rideObject';
import RideGroup from '../../components/myComponents/rideGroup';
import RidePopUp from '../../components/myComponents/ridePopUp';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

// placeholder
const user_id = "66b690a0c48abbd2f6bcadfc";

const profile = () => {
    const [refreshing, setRefreshing] = useState(false);
    // for either rides or reviews
    const [page, setPage] = useState('rides');
    const [displayRides, setDisplayRides] = useState(null);

    // Conditionally rendering popUp
    const [popUpVisible, setPopUpVisible] = useState(false);
    // Passing in selected ride's data to RidePopUp
    const [selectedRide, setSelectedRide] = useState(null); 
    
    const url = process.env.EXPO_PUBLIC_API_URL; // placeholder

    const pagePress = (value) => {
        setPage(value);
    }

    useEffect(() => {
        console.log('refreshing');

        // reset all values

        // fetch new rides
        const send_id = encodeURIComponent(user_id)
        send_url = url + `/ride/getUserRides?client_id=${send_id}`
        axios.get(send_url)
            .then(response => {
                setDisplayRides(response.data);
            })
            .catch(error => {
                console.log("error fetching rides: ", error);
            })
    }, [refreshing]);

    const onRefresh = async () => {
        // display refreshing animation
        setRefreshing(true);
        // Simulate a delay to ensure that refreshing state is properly updated
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    };

    const handleRideClick = (ride) => {
        // Set the selected ride data
        setSelectedRide(ride); 
        setPopUpVisible(true); 
    };

    return (
        <>
        <SafeAreaView style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#2E74DD']}
                    />
                }
            >

                {/** User pfp, name and rating */}
                <View style={userStyle.userContainer}>
                    <View>
                        <FontAwesome6 name="user-graduate" size={10 * vh} color="black" />
                    </View>
                    <View style={userStyle.info}>
                        <Text style={userStyle.name}> Jerry Smith </Text>

                        <Rating style={userStyle.rating} size={3 * vh} rating={2.5} total={10} />
                    </View>
                </View>

                {/** User bio. We probably want to force users to list their school. To ensure security? */}
                <View style={userStyle.bio}>
                    <Text style={userStyle.bioText}>Student at Sacramento City College</Text>
                    <Text style={userStyle.bioText}>Have you ever watched Rick and Morty?</Text>
                </View>

                {/** Rides and Raitings, will call components for this */}
                <View style={styles.contentBar}>
                    <View style={styles.selector}>
                        <TouchableWithoutFeedback onPress={() => pagePress('rides')}>
                            <View style={{ backgroundColor: "transparent" }}>
                                <Text style={[styles.heading, (page == 'rides') && { color: '#2E74DD' }]}> Rides </Text>
                                <Hr style={[styles.bar, (page == 'rides') && styles.barPressed]} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.selector}>
                        <TouchableWithoutFeedback onPress={() => pagePress('reviews')}>
                            <View style={{ backgroundColor: "transparent" }}>
                                <Text style={[styles.heading, (page == 'reviews') && { color: '#2E74DD' }]}> Reviews </Text>
                                <Hr style={[styles.bar, (page == 'reviews') && styles.barPressed]} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>

                {/** Content: User Rides or Ratings. Use conditional rendering based on state. */}
                <View style={contentStyles.container}>

                    {/** Rides */}
                    {(page === "rides") && <View>
                        {(displayRides != "empty") && displayRides && <FlatList
                            scrollEnabled={false}
                            // data is going to taken in an object which fetches DB to get all rides
                            data={displayRides}
                            renderItem={({ item }) => (
                                <RideObject
                                    origin={item.origins}
                                    destination={item.destination}
                                    day={item.day}
                                    arrival={item.arrival}
                                    members={item.members}
                                    onRideClick={() => handleRideClick(item)} // Pass the ride data to handleRideClick
                                />
                            )}
                            keyExtractor={item => item.id}
                        />}

                        {(displayRides === "empty") && <Text>Post a ride to see recommendations! :) </Text>}
                        {!displayRides && <Text>Loading...</Text>}
                    </View>}

                    {/** Reviews here, to do...  */}
                    {(page === "reviews") && <View>
                        <Text>Reviews</Text>

                    </View>}


                    {/** Ratings */}
                </View>

            </ScrollView>
        </SafeAreaView>
        
        {/** Render ride options. Delete and details probably? Something similar to rideGroup but diff component */}
        {popUpVisible &&
            <RidePopUp 
                visible={popUpVisible}
                onClose={() => setPopUpVisible(false)}
                rideData={selectedRide} // Pass the selected ride data to the popup
            />}
        </>
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
    contentBar: {
        flexDirection: 'row',
        marginHorizontal: 4 * vw,
    },
    selector: {
        alignItems: 'center',
    },
    bar: {
        width: 46 * vw,
        height: 0.2 * vh,
        backgroundColor: 'black'
    },
    barPressed: {
        backgroundColor: '#2E74DD',
        height: .6 * vh,
        marginTop: -.2 * vh
    },
    heading: {
        marginBottom: 1 * vh,

        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 2 * vh
    }
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
        marginBottom: 4 * vh,
    },
    bioText: {
        color: "#6E6B6B",
        fontWeight: 'bold',
        fontSize: 2 * vh,
    }
});

const contentStyles = StyleSheet.create({
    container: {
        marginTop: 2.5 * vh,
    }
});
