import React, { useState, useEffect } from 'react';
import {
    Text, View, SafeAreaView, StyleSheet, Dimensions, TouchableWithoutFeedback,
    ScrollView, RefreshControl, FlatList, StatusBar, Image, AppState,
} from 'react-native';
import axios from 'axios';

import Rating from '../../components/myComponents/rating';
import Hr from '../../components/myComponents/hr';
import RideObject from '../../components/myComponents/rideObject';
import RidePopUp from '../../components/myComponents/ridePopUp';
import ReviewsObject from '../../components/myComponents/reviewsObject';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { saveUserData, getUserData } from '../../components/utilities/cache';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

// placeholder
const user_id = process.env.EXPO_PUBLIC_USER_ID;
const accessToken = process.env.EXPO_PUBLIC_TOKEN;

const profile = () => {
    const [refreshing, setRefreshing] = useState(false);

    // user profile data
    const [userName, setName] = useState("loading...");
    const [rating, setRating] = useState(null);

    // for either rides or reviews
    const [page, setPage] = useState('rides');
    const [displayRides, setDisplayRides] = useState(null);
    const [displayRatings, setDisplayRatings] = useState(null);
    // Conditionally rendering popUp
    const [popUpVisible, setPopUpVisible] = useState(false);
    // Passing in selected ride's data to RidePopUp
    const [selectedRide, setSelectedRide] = useState(null);

    const url = process.env.EXPO_PUBLIC_API_URL; // placeholder

    const pagePress = (value) => {
        setPage(value);
    }

    // Fetch user data & listens to app state
    useEffect(() => {
        // Get Rides Data (Checking Cache)

        onRefresh();

        // Handle AppState
        const handleAppStateChange = (nextAppState) => {
            if (nextAppState === 'active') {
                console.log("App Active")
                onRefresh();
            }
        }
        // Listen to app state changes
        const currentAppState = AppState.addEventListener('change', handleAppStateChange)

        // Clean listener component when app is unmounted
        return () => {
            currentAppState.remove();
        }

    }, []);

    const onRefresh = async () => {
        console.log('----refreshing | Profile Page');
        setRefreshing(true);

        const cachedUserData = await getUserData('userData');
        const cachedRidesData = await getUserData('ridesData');

        if (cachedUserData && cachedRidesData) {
            setName(cachedUserData.name);
            setDisplayRatings(cachedUserData.ratings)
            setRating(cachedUserData.averageStars);
            setDisplayRides(cachedRidesData);
        }
        
        // Fetch from db and store data synchronously
        const send_id = encodeURIComponent(user_id)
        const headers = {
            "token": accessToken,
            "clientId": user_id
        }
        try {
            const userResponse = await axios.get((url + `/user/getUser?client_id=${send_id}`), { headers: headers });
            const ridesResponse = await axios.get((url + `/ride/getUserRides?client_id=${send_id}`), { headers: headers });
            console.log("Fetched user & rides data")

            const userData = {
                name: userResponse.data.name,
                ratings: userResponse.data.ratings,
                averageStars: userResponse.data.ratings.reduce((accumulator, currentValue) => {
                    return accumulator + (currentValue.stars || 0);
                }, 0) / userResponse.data.ratings.length,
            };

            const ridesData = ridesResponse.data;

            // Save data to Async Storage
            await saveUserData('userData', userData);
            await saveUserData('ridesData', ridesData);
            // Set states
            setName(userData.name);
            setDisplayRatings(userData.ratings)
            setRating(userData.averageStars);
            setDisplayRides(ridesData);
        } catch (error) {
            console.error("Error fetching data", error);
        }

        setRefreshing(false);
    };

    const handleRideClick = (ride) => {
        // Set the selected ride data
        setSelectedRide(ride);
        setPopUpVisible(true);
    };

    return (
        <>
            <StatusBar barStyle={"dark-content"} />
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
                    {/** User profile, name and rating */}
                    <View style={userStyle.userContainer}>
                        <View>
                            <Image style={userStyle.profile} source={{ uri: `https://picsum.photos/140/140?random=${Math.random()}` }} />
                        </View>
                        <View style={userStyle.info}>
                            <Text style={userStyle.name}>{userName}</Text>

                            <Rating style={userStyle.rating} size={3 * vh} rating={rating} total={10} />
                        </View>
                    </View>

                    {/** User bio. We probably want to force users to list their school. To ensure security? */}
                    <View style={userStyle.bio}>
                        <Text style={userStyle.bioText}>Student at Sacramento City College</Text>
                        <Text style={userStyle.bioText}>Have you ever watched Rick and Morty?</Text>
                    </View>

                    {/** Rides and Ratings, will call components for this */}
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
                            {displayRatings && <FlatList
                                scrollEnabled={false}
                                data={displayRatings}
                                renderItem={({ item }) => (
                                    <ReviewsObject
                                        style={styles.reviewsObject}
                                        name={item.name}
                                        stars={item.stars}
                                        content={item.content}
                                        date={"August 17, 2024"}            // Hard Coded for now, need to add param in db
                                        origin="Oakland, Ca"                // Hard Coded for now, need to add param in db
                                        destination="Stanford University"   // Hard Coded for now, need to add param in db

                                    />
                                )}


                            />}
                            <ReviewsObject
                                style={styles.reviewsObject}
                                name="Sample"
                                date="January 21, 1980"
                                stars={4}
                                content="Great ride, very punctual and friendly!"
                                origin="Downtown"
                                destination="Airport"
                            />

                        </View>}


                        {/** Ratings */}
                    </View>

                </ScrollView>
            </SafeAreaView>

            {/** Render ride options. Delete and details probably? Something similar to rideGroup but diff component */}
            {popUpVisible &&
                <RidePopUp
                    visible={popUpVisible}
                    onClose={() => { setPopUpVisible(false); onRefresh(); }} // Make this refresh again without animation
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
    title: {
        marginTop: 1 * vh,
        marginLeft: 6 * vw,
        color: "black",
        textAlign: "left",
        fontWeight: "bold",
        fontSize: 4 * vh,
        marginBottom: 2 * vh,
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
    },
    reviewsObject: {
        marginHorizontal: 5 * vw,
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
        marginHorizontal: 10 * vw,
    },
    profile: {
        width: 10 * vh,
        height: 10 * vh,
        borderRadius: 7 * vh,
        borderColor: "black",
        borderWidth: 0.2 * vw
    },
    info: {
        marginLeft: 4 * vw,
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start"
    },
    name: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 3.2 * vh,
        marginBottom: .5 * vh,
        flexWrap: 'wrap',
    },
    rating: {
        marginLeft: 0 * vw,
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
