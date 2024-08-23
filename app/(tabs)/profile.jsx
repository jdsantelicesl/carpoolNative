import React, { useState, useEffect } from 'react';
import {
    Text, View, SafeAreaView, StyleSheet, Dimensions, TouchableWithoutFeedback,
    ScrollView, RefreshControl, FlatList, StatusBar, Image, AppState, TouchableOpacity,
    Alert, TextInput
} from 'react-native';
import Rating from '../../components/myComponents/rating';
import Hr from '../../components/myComponents/hr';
import RideObject from '../../components/myComponents/rideObject';
import RidePopUp from '../../components/myComponents/ridePopUp';
import ReviewsObject from '../../components/myComponents/reviewsObject';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUserData, getUserData, clearAllData } from '../../components/utilities/cache';
import apiClient from '../../components/utilities/apiClient';
import pickImage from '../../components/utilities/pickImage';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from 'expo-router';
import Loading from '../../components/myComponents/loading';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';

// TODO: Grab user Bio/School/Profile from DB
const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const profile = () => {

    // Navigating to (login) after clicked on log out
    const navigation = useNavigation();

    const [refreshing, setRefreshing] = useState(false);

    // user profile data
    const [userName, setName] = useState("loading...");
    const [userSchool, setSchool] = useState("loading...");
    const [userBio, setBio] = useState("loading...");
    // to edit bio and school
    const [editBio, setEditBio] = useState(false);

    const [rating, setRating] = useState(0);
    const [numRat, setNumRat] = useState(0);

    // for either rides or reviews
    const [page, setPage] = useState('rides');
    const [displayRides, setDisplayRides] = useState(null);
    const [displayRatings, setDisplayRatings] = useState(null);
    // Conditionally rendering popUp
    const [popUpVisible, setPopUpVisible] = useState(false);
    // Passing in selected ride's data to RidePopUp
    const [selectedRide, setSelectedRide] = useState(null);
    // for pickImage
    const [imageUri, setImageUri] = useState(null);

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

        // force refresh the flatlists, im kinda hacking it
        const last_page = page;
        setPage(null);

        const cachedUserData = await getUserData('userData');
        const cachedRidesData = await getUserData('userRides');

        if (cachedUserData && cachedRidesData) {
            setName(cachedUserData.name);
            setDisplayRatings(cachedUserData.ratings)
            setRating(cachedUserData.averageStars);
            setDisplayRides(cachedRidesData);
            setBio(cachedUserData.bio);
            setSchool(cachedUserData.school);
            setImageUri(cachedUserData.pfp);
        }

        // Fetch from db and store data synchronously
        const user_id = await getUserData("clientId");
        const send_id = encodeURIComponent(user_id)
        try {
            const userResponse = await apiClient.get((url + `/user/getUser?client_id=${send_id}`));
            const ridesResponse = await apiClient.get((url + `/ride/getUserRides?client_id=${send_id}`));
            console.log("Fetched user & rides data")

            const pfpURI = userResponse.data.pfp ? userResponse.data.pfp : null;

            const userData = {
                name: userResponse.data.name,
                numRat: userResponse.data.ratings.length ? userResponse.data.ratings.length : 0,
                ratings: userResponse.data.ratings,
                averageStars: userResponse.data.ratings.length ? userResponse.data.ratings.reduce((accumulator, currentValue) => {
                    return accumulator + (currentValue.stars || 0);
                }, 0) / userResponse.data.ratings.length : 0,
                pfp: pfpURI + `?${new Date().getTime()}`,
                bio: userResponse.data.bio,
                school: userResponse.data.school
            };

            const ridesData = ridesResponse.data;
            console.log("uri img: ", userData.pfp);

            // Save data to Async Storage
            await saveUserData('userData', userData);
            await saveUserData('userRides', ridesData);
            // Set states
            setName(userData.name);
            setDisplayRatings(userData.ratings)
            setRating(userData.averageStars);
            setDisplayRides(ridesData);
            setImageUri(userData.pfp);
            setBio(userData.bio);
            setSchool(userData.school);

        } catch (error) {
            console.error("Error fetching data", error);
        }

        
        setPage(last_page);
        setRefreshing(false);
    };

    const handleRideClick = (ride) => {
        // Set the selected ride data
        setSelectedRide(ride);
        setPopUpVisible(true);
    };

    const handleLogOut = () => {
        // Show alert -- Make this a button

        Alert.alert("Log out", "Do you want to log out?", [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Log out",
                onPress: () => {
                    clearAllData();
                    navigation.navigate("(login)")
                }
            }

        ])
    }

    const handleProfileChange = async () => {
        const imageURI = await pickImage();
        if (!imageUri) return;

        // Compress and resize the image
        const manipResult = await ImageManipulator.manipulateAsync(
            imageURI,
            [{ resize: { width: 800 } }], // Resize width to 800 pixels
            { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // Compress and convert to JPEG
        );

        const { uri: compressedUri } = manipResult;
        const response = await fetch(compressedUri);
        const blob = await response.blob();

        const reader = new FileReader();

        const base64Blob = new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });

        const dataUrl = await base64Blob;
        const base64Data = dataUrl.split(',')[1]; // Remove the data URL prefix\
        try {
            const pfp_response = await apiClient.post(url + "/user/editProfile", { pfp: base64Data });
            onRefresh();
        }
        catch {
            console.log("error setting pfp");
            alert("could not change pfp");
        }
    }

    const handleEditBio = async() => {
        try {
            await apiClient.post(url + "/user/editProfile", { bio: userBio, school: userSchool});
        }
        catch {
            console.log("error updating user bio");
        }
        setEditBio(false);
    }

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
                    {/* Log out button */}
                    <TouchableOpacity style={styles.logOutButton} onPress={handleLogOut} >
                        <Text style={styles.logOutText}>Log out</Text>
                    </TouchableOpacity>

                    {/** User profile, name and rating */}
                    <View style={userStyle.userContainer} >
                        <TouchableOpacity onPress={() => handleProfileChange()}>
                            {imageUri ? (<Image source={{ uri: imageUri }} style={userStyle.profile} />) :
                                (<Image style={userStyle.profile} source={{ uri: imageUri }} />)}
                        </TouchableOpacity>
                        <View style={userStyle.info}>
                            <Text style={userStyle.name}>{userName}</Text>

                            <Rating style={userStyle.rating} size={3 * vh} rating={rating} total={numRat} />
                        </View>
                    </View>

                    {/** User bio. We probably want to force users to list their school. To ensure security? */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 4*vw, marginLeft: 7*vw }}>
                        <View style={[userStyle.bio, editBio && { backgroundColor: '#E1E1E1', color: 'black'}]}>
                            <TextInput style={userStyle.bioText} value={userSchool} onChangeText={setSchool} editable={editBio} ></TextInput>
                            <TextInput style={userStyle.bioText} value={userBio} onChangeText={setBio} editable={editBio} multiline></TextInput>
                        </View>
                        <View style={userStyle.bioOptions}>
                            {!editBio ?
                                (<TouchableOpacity style={[userStyle.bioEdit, {marginTop: 1.2*vh}]} onPress={() => setEditBio(true)}>
                                    <FontAwesome6 name="pencil" size={24} color="black" />
                                </TouchableOpacity>)
                                :
                                (
                                    <View>
                                        <TouchableOpacity style={[userStyle.bioButton, { backgroundColor: '#007AFF' }]} onPress={() => handleEditBio()}>
                                            <Entypo name="check" size={24} color="black" />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[userStyle.bioButton, { backgroundColor: '#FF3B30' }]}
                                            onPress={() => { setEditBio(false); onRefresh(); }}>
                                            <Entypo name="cross" size={24} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                )
                            }
                        </View>
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
                    <View >

                        {/** Rides */}
                        {(page === "rides") && 
                            <View style={displayRides && displayRides !== "empty" && displayRides.length > 0 
                                ? contentStyles.container 
                                : contentStyles.loadingContainer}>
                            {displayRides && (displayRides != "empty") && displayRides.length > 0 ? (<FlatList
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
                            />) : (
                                <Text><Loading text={"These are going to be your rides"}/></Text>
                            )}

                        </View>}

                        {/** Reviews here, to do...  */}
                        {(page === "reviews") && 
                            <View style={displayRatings && displayRatings.length > 0 
                                ? contentStyles.container 
                                : contentStyles.loadingContainer
                              }>
                                {displayRatings && displayRatings.length > 0 ? (<FlatList
                                scrollEnabled={false}
                                data={displayRatings}
                                renderItem={({ item }) => (
                                    <ReviewsObject
                                        style={styles.reviewsObject}
                                        name={item.name}
                                        stars={item.stars}
                                        content={item.content}
                                    // date={"August 17, 2024"}            // Hard Coded for now, need to add param in db
                                    // origin="Oakland, Ca"                // Hard Coded for now, need to add param in db
                                    // destination="Stanford University"   // Hard Coded for now, need to add param in db

                                    />
                            )}


                            />) : (
                                        <Text><Loading text={"Rating feature not yet enabled, coming soon..."}/></Text>
                            )}

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
    logOutButton: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "flex-end",
        marginHorizontal: 5 * vw,
        marginTop: 1 * vw,
        marginBottom: -5 * vw,
        width: "15%",
        position: 'absolute',
        right: 5,

    },
    logOutText: {
        fontSize: 4 * vw,
        color: "#367CE5",
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
        width: 68 * vw,
        marginTop: -0.5*vh,
        padding: 0.5*vh,
        marginLeft: 1.5 * vw,
        marginRight: 5.5 * vw,
        marginBottom: 3.5 * vh,
    },
    bioText: {
        color: "#6E6B6B",
        fontWeight: 'bold',
        fontSize: 2 * vh,
    },
    bioOptions: {

    },
    bioEdit: {

    },
    bioButton: {
        borderRadius: 1 * vh,
        paddingHorizontal: 2 * vw,
        marginVertical: 0.2 * vh,

    }
});

const contentStyles = StyleSheet.create({
    container: {
        marginTop: 2.5 * vh,
        // alignItems: "center"
    },
    loadingContainer: {
        marginTop: 2.5 * vh,
        alignItems: "center"
    }
});
