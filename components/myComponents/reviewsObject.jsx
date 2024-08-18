import React from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Rating from './rating'

const { width, height } = Dimensions.get('window');
const vh = height * 0.01;
const vw = width * 0.01;

const ReviewsObject = ({style, name, date, stars, content, origin, destination, }) => {
    
    return (
        <View style={[style, styles.container]}>
            <View style={styles.infoContainer}>

				{/* User */}
                <View style={styles.userContainer}>
					<View styles={styles.profile}>
                    	<FontAwesome6 name="user" size={30} />
					</View>
						
					<View styles={styles.nameAndDateContainer}>
						<Text style={styles.name}>{name}</Text>
						<Text style={styles.date}>{date}</Text>
					</View>

					<View style={styles.ratingContainer}>
						<Rating size={2.5 * vh} rating={stars}/>
					</View>
                </View>


				{/* Location */}
                {(origin && destination) && (
                    <View style={styles.locationContainer}>
                        <Text style={styles.locationContent}>
                            {origin}
                            <Text> </Text> <FontAwesome6 name="arrow-right" size={12} /> <Text> </Text>
                            {destination}
                        </Text>
                    </View>
                )}

				{/* Content */}
                <View style={styles.contentContainer}>
                    <Text style={styles.content}>{content}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: .6 * vh,
        backgroundColor: '#fff',
        borderRadius: 2 * vh,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoContainer: {
        flex: 1,
        padding: 2 * vh,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
	nameAndDateContainer: {
		flexDirection: 'column',
	},
	profile:{
		
	},
    name: {
        fontWeight: 'bold',
        fontSize: 5 * vw,
        marginLeft: 1 * vw,
    },
    ratingContainer: {
		flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginTop: -1 * vh,
    },
    date: {
        fontSize: 3.5 * vw,
        color: '#666',
    },
    locationContainer: {
        marginTop: 1 * vh,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    locationContent: {
        fontWeight: 'bold',
        fontSize: 3.5 * vw,
    },
    contentContainer: {
        marginTop: 1 * vh,
    },
    content: {
        fontSize: 4 * vw,
        color: '#333',
    },
});

export default ReviewsObject;