import React, { useEffect, useState } from 'react'
import { Text, View, SafeAreaView, StyleSheet, Dimensions, ScrollView, StatusBar, FlatList, RefreshControl, AppState } from 'react-native'
import axios from 'axios'
import Hr from '../../components/myComponents/hr';
import Message from '../../components/myComponents/message';
import Chat from '../../components/myComponents/chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

// Cache -- save user data
const saveUserData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Error saving data", error);
    }
};

// Cache -- get user data
const getUserData = async (key) => {
    try{
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            return JSON.parse(value);
        } 
    } catch (error) {
        console.error("Error fetching data", error);
    }
    return null;
};

const messages = () => {

    const [disableComposer, setDisableComposer] = useState(false); // Disable send chat
    const [listMessages, setMessages] = useState(null);
    const [chatVisible, setChatVisible] = useState(false);
    const [chatData, setChatData] = useState([]);
    const [origin, setOrigin] = useState("");
    const [arrival, setArrival] = useState(null);
    const [day, setDay] = useState(null);
    const [destination, setDestination] = useState("");
    const [passRideId, setRideId] = useState(null);

    const [refreshing, setRefreshing] = useState(false);

    const exitChat = () => {
        setChatVisible(false);
        onRefresh();
    };
    
    // @param: items -- from item.messages
    const openChat = (items) => {
        setChatData(items);
        console.log(items);
        setChatVisible(true);
    };

    const url = process.env.EXPO_PUBLIC_API_URL; // placeholder
    const user_id = process.env.EXPO_PUBLIC_USER_ID;

    const fetchUserData = async () => {
        const cachedMessages = await getUserData('messagesData');

        if (cachedMessages) { 
            setMessages(cachedMessages)
            console.log("Cached Messages")
        } else {
            const sendId = encodeURIComponent(user_id);
            try {
                const messagesResponse = await axios.get(url + `/message/getChats?client_id=${sendId}`);
                const messagesData = messagesResponse.data;
                console.log("Fetched Messages")

                await saveUserData('messagesData', messagesData);
                setMessages(messagesData)

            } catch (error) {
                console.error("Failed to fetch messages", error)
            }
        }
        setRefreshing(false);
    }

    useEffect(() => {
        fetchUserData();
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
    }, [refreshing]);
    
    const onRefresh = async () => {
        console.log("----refreshing | Messages Page")
        await AsyncStorage.removeItem('messagesData')
        console.log("Cleared Cache")
        // display refreshing animation
        setRefreshing(true);
        // Simulate a delay to ensure that refreshing state is properly updated
        // await new Promise(resolve => setTimeout(resolve, 1000));
        
    }


    return (
        <>
            {!chatVisible && <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#2E74DD']}
                        />
                    }
                >
                    <Text style={styles.title}>Messages</Text>
                    <Hr style={styles.hr} />

                    {/** Example only. Should fetch data and use component to display data retrieved. */}
                    <FlatList
                        style={{ marginTop: 0.5 * vh }}
                        scrollEnabled={false}
                        data={listMessages}
                        renderItem={({ item }) => (
                            <Message
                                origin={item.origins.short}
                                destination={item.destination.short}
                                day={item.day}
                                arrival={item.arrival}
                                prevText={item.messages[0].content}
                                rideData={item}
                                onPress={()=> 
                                    {
                                        openChat(item.messages); 
                                        setRideId(item._id);
                                        setOrigin(item.origins.short); 
                                        setDestination(item.destination.short); 
                                        setArrival(item.arrival); 
                                        setDay(item.day);
                                        setDisableComposer(false);
                                    }
                                }
                            />)
                        }
                        keyExtractor={item => item._id}
                    />

                <Message
                    origin={"Message from Developers :)"}
                    prevText={"Remember to rate others after carpooling"}
                    onPress={() => {openChat(); setOrigin("Messages from"); setDestination("developers"); setDisableComposer(true);}}
                    />

                </ScrollView>
            </SafeAreaView>}

        {/* Conditionally render chat */}
        {chatVisible && 
        <Chat 
            disableComposer={disableComposer}
            exitChat={() => exitChat()}
            chatData={chatData}
            origin={origin} 
            destination={destination}
            arrival={arrival}
            day={day}
            rideId={passRideId}

        />}

        </>
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
        marginBottom: 0 * vh,
        height: 0.2 * vh,
        width: 96 * vw,
        backgroundColor: "black",
    }
});
